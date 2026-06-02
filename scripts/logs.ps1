. "$PSScriptRoot\common.ps1"

try {
  Assert-Docker

  if (-not (Assert-WorkshopEnvFile)) {
    exit 1
  }

  Invoke-WorkshopCompose logs -f @args
  Assert-LastCommand "Docker Compose logs failed."
} catch {
  Write-Error $_
  exit 1
}
