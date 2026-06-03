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
  Write-Host "==> MCP zero-dependency: nothing to install."
} elseif (-not (Test-Path (Join-Path $McpDir "node_modules"))) {
  Write-Host "==> Installing MCP dependencies"
  Push-Location $McpDir
  npm install
  Pop-Location
}

if ($args.Count -ge 1 -and $args[0] -eq "--serve") {
  Write-Host "==> Starting ghostfolio-demo-data in the foreground (Ctrl+C to exit)."
  Write-Host "    Speaks JSON-RPC over stdin; logs go to stderr."
  node (Join-Path $McpDir "src\index.mjs")
  exit $LASTEXITCODE
}

Write-Host "==> OpenCode starts this MCP automatically via opencode.json."
Write-Host "==> Verifying it works..."
node (Join-Path $McpDir "src\smoke-test.mjs")
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Ready. How to use it:"
Write-Host "  - From OpenCode: the portfolio-domain-agent agent or the /workshop-analyze-demo-portfolio command."
Write-Host "  - Smoke test whenever you want: .\scripts\check-demo-mcp.ps1"
Write-Host "  - Manual foreground start (debugging): .\scripts\start-demo-mcp.ps1 --serve"
