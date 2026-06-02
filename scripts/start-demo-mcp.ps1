$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $RepoRoot

$McpDir = "tools\mcp\ghostfolio-demo-data-mcp"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js >= 22 is required to run the demo MCP."
  exit 1
}

# Install dependencies only if the MCP ever declares some (it is zero-dependency today).
$pkg = Get-Content (Join-Path $McpDir "package.json") -Raw
if ($pkg -match '"dependencies":\s*\{\}') {
  Write-Host "==> MCP zero-dependency: no hay nada que instalar."
} elseif (-not (Test-Path (Join-Path $McpDir "node_modules"))) {
  Write-Host "==> Instalando dependencias del MCP"
  Push-Location $McpDir
  npm install
  Pop-Location
}

if ($args.Count -ge 1 -and $args[0] -eq "--serve") {
  Write-Host "==> Arrancando ghostfolio-demo-data en primer plano (Ctrl+C para salir)."
  Write-Host "    Habla JSON-RPC por stdin; los logs salen por stderr."
  node (Join-Path $McpDir "src\index.mjs")
  exit $LASTEXITCODE
}

Write-Host "==> OpenCode arranca este MCP automaticamente via opencode.json."
Write-Host "==> Verificando que funciona..."
node (Join-Path $McpDir "src\smoke-test.mjs")
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Listo. Como usarlo:"
Write-Host "  - Desde OpenCode: el agente portfolio-domain-agent o el command /workshop-analyze-demo-portfolio."
Write-Host "  - Smoke test cuando quieras: .\scripts\check-demo-mcp.ps1"
Write-Host "  - Arranque manual en primer plano (depuracion): .\scripts\start-demo-mcp.ps1 --serve"
