. "$PSScriptRoot\common.ps1"

try {
  Write-WorkshopStep "Checking Docker"
  Assert-Docker

  Write-WorkshopStep "Preparing .env"
  Ensure-WorkshopEnvFile

  Write-WorkshopStep "Rebuilding Ghostfolio from local source without cache"
  Invoke-WorkshopCompose build --no-cache
  Assert-LastCommand "Docker Compose rebuild failed."

  Write-WorkshopStep "Starting Ghostfolio"
  Invoke-WorkshopCompose up -d
  Assert-LastCommand "Docker Compose up failed."

  Show-WorkshopFooter
} catch {
  Write-Error $_
  exit 1
}
