param(
  [switch]$Force
)

. "$PSScriptRoot\common.ps1"

Write-Host "WARNING: this will delete the local Ghostfolio database and Redis volumes."

if (-not $Force) {
  $confirm = Read-Host "Continue? [y/N]"
  if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Aborted."
    exit 0
  }
}

try {
  Write-WorkshopStep "Checking Docker"
  Assert-Docker

  if (-not (Assert-WorkshopEnvFile)) {
    exit 1
  }

  Write-WorkshopStep "Deleting containers, networks, and volumes"
  Invoke-WorkshopCompose down -v
  Assert-LastCommand "Docker Compose reset failed."
} catch {
  Write-Error $_
  exit 1
}
