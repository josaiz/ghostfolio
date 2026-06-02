. "$PSScriptRoot\common.ps1"

try {
  Write-WorkshopStep "Checking Docker"
  Assert-Docker

  if (-not (Assert-WorkshopEnvFile)) {
    exit 1
  }

  Write-WorkshopStep "Stopping Ghostfolio without deleting data"
  Invoke-WorkshopCompose down
  Assert-LastCommand "Docker Compose down failed."
} catch {
  Write-Error $_
  exit 1
}
