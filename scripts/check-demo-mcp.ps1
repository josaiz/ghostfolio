$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $RepoRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js >= 22 is required to run the demo MCP smoke test."
  exit 1
}

Write-Host "==> Comprobando el MCP ghostfolio-demo-data (initialize + tools/list + tools/call)"
node tools\mcp\ghostfolio-demo-data-mcp\src\smoke-test.mjs
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
