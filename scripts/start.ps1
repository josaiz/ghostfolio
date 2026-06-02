. "$PSScriptRoot\common.ps1"

try {
  Write-WorkshopStep "Checking Docker"
  Assert-Docker

  Write-WorkshopStep "Preparing .env"
  Ensure-WorkshopEnvFile

  Write-WorkshopStep "Building Ghostfolio from local source"
  Invoke-WorkshopCompose build
  Assert-LastCommand "Docker Compose build failed."

  Write-WorkshopStep "Starting Ghostfolio"
  Invoke-WorkshopCompose up -d
  Assert-LastCommand "Docker Compose up failed."

  Show-WorkshopFooter
} catch {
  Write-Error $_
  exit 1
}
