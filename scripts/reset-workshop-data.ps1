param(
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $RepoRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js is required to reset workshop data. Install Node.js >= 22 or use the development runtime."
  exit 1
}

$nodeArgs = @("tools/workshop/reset-workshop-data.mjs")
if ($Force) {
  $nodeArgs += "--force"
}
$nodeArgs += $args

node @nodeArgs
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
