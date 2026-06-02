$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $RepoRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js is required to seed workshop data. Install Node.js >= 22 or use the development runtime."
  exit 1
}

node tools/workshop/seed-workshop-data.mjs @args
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
