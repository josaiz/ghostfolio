$script:ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$script:RepoRoot = Resolve-Path (Join-Path $script:ScriptDir "..")
Set-Location $script:RepoRoot

$script:WorkshopEnvFile = ".env"
$script:WorkshopEnvExample = ".env.example"
$script:WorkshopComposeFile = "docker/docker-compose.build.yml"
$script:WorkshopDefaultPort = "3333"

function Write-WorkshopStep {
  param([string]$Message)

  Write-Host ""
  Write-Host "==> $Message"
}

function Invoke-WorkshopCompose {
  param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ComposeArgs
  )

  & docker compose --env-file $script:WorkshopEnvFile -f $script:WorkshopComposeFile @ComposeArgs
}

function Assert-LastCommand {
  param([string]$Message)

  if ($LASTEXITCODE -ne 0) {
    throw $Message
  }
}

function Assert-Docker {
  if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker is not installed or is not available in PATH."
  }

  & docker compose version *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose is not available. Install Docker Desktop or the Docker Compose plugin."
  }

  & docker info *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Docker is installed, but the Docker daemon is not running. Start Docker Desktop and try again."
  }
}

function Assert-WorkshopEnvFile {
  if (-not (Test-Path $script:WorkshopEnvFile)) {
    Write-Error ".env does not exist. Run .\scripts\start.ps1 to create it from .env.example."
    return $false
  }

  return $true
}

function New-WorkshopSecret {
  $bytes = New-Object byte[] 32
  [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
  return (($bytes | ForEach-Object { $_.ToString("x2") }) -join "")
}

function Read-WorkshopText {
  param([string]$Path)

  return [System.IO.File]::ReadAllText((Resolve-Path $Path))
}

function Write-WorkshopText {
  param(
    [string]$Path,
    [string]$Content
  )

  $encoding = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText((Resolve-Path $Path), $Content, $encoding)
}

function Get-WorkshopEnvValue {
  param([string]$Key)

  if (-not (Test-Path $script:WorkshopEnvFile)) {
    return ""
  }

  foreach ($line in Get-Content $script:WorkshopEnvFile) {
    if ($line -match "^$([regex]::Escape($Key))=(.*)$") {
      return $Matches[1]
    }
  }

  return ""
}

function Set-WorkshopEnvValue {
  param(
    [string]$Key,
    [string]$Value
  )

  $lines = @()
  if (Test-Path $script:WorkshopEnvFile) {
    $lines = @(Get-Content $script:WorkshopEnvFile)
  }

  $found = $false
  $updated = foreach ($line in $lines) {
    if ($line -match "^$([regex]::Escape($Key))=") {
      $found = $true
      "$Key=$Value"
    } else {
      $line
    }
  }

  if (-not $found) {
    $updated += ""
    $updated += "$Key=$Value"
  }

  $content = ($updated -join [Environment]::NewLine) + [Environment]::NewLine
  Write-WorkshopText -Path $script:WorkshopEnvFile -Content $content
}

function Ensure-WorkshopEnvDefault {
  param(
    [string]$Key,
    [string]$Value
  )

  if ([string]::IsNullOrWhiteSpace((Get-WorkshopEnvValue -Key $Key))) {
    Set-WorkshopEnvValue -Key $Key -Value $Value
  }
}

function Ensure-WorkshopSecretValue {
  param([string]$Key)

  $value = Get-WorkshopEnvValue -Key $Key
  if ([string]::IsNullOrWhiteSpace($value) -or $value -match "<INSERT_") {
    Set-WorkshopEnvValue -Key $Key -Value (New-WorkshopSecret)
  }
}

function Ensure-WorkshopProjectName {
  $value = Get-WorkshopEnvValue -Key "COMPOSE_PROJECT_NAME"
  if ([string]::IsNullOrWhiteSpace($value) -or $value -eq "ghostfolio") {
    Set-WorkshopEnvValue -Key "COMPOSE_PROJECT_NAME" -Value "ghostfolio_build"
  }
}

function Replace-RemainingWorkshopPlaceholders {
  $content = Read-WorkshopText -Path $script:WorkshopEnvFile
  $matches = [regex]::Matches($content, "<INSERT_[^>]+>")
  if ($matches.Count -eq 0) {
    return
  }

  $placeholders = $matches | ForEach-Object { $_.Value } | Select-Object -Unique
  foreach ($placeholder in $placeholders) {
    $content = $content.Replace($placeholder, (New-WorkshopSecret))
  }

  Write-WorkshopText -Path $script:WorkshopEnvFile -Content $content
}

function Ensure-WorkshopEnvFile {
  if (-not (Test-Path $script:WorkshopEnvFile)) {
    if (-not (Test-Path $script:WorkshopEnvExample)) {
      throw ".env is missing and .env.example was not found."
    }

    Copy-Item $script:WorkshopEnvExample $script:WorkshopEnvFile
    Write-Host "Created .env from .env.example."
  }

  Ensure-WorkshopProjectName
  Ensure-WorkshopEnvDefault -Key "REDIS_HOST" -Value "redis"
  Ensure-WorkshopEnvDefault -Key "REDIS_PORT" -Value "6379"
  Ensure-WorkshopSecretValue -Key "REDIS_PASSWORD"

  Ensure-WorkshopEnvDefault -Key "POSTGRES_DB" -Value "ghostfolio-db"
  Ensure-WorkshopEnvDefault -Key "POSTGRES_USER" -Value "user"
  Ensure-WorkshopSecretValue -Key "POSTGRES_PASSWORD"

  Ensure-WorkshopSecretValue -Key "ACCESS_TOKEN_SALT"
  Ensure-WorkshopSecretValue -Key "JWT_SECRET_KEY"
  Ensure-WorkshopEnvDefault -Key "DATABASE_URL" -Value 'postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?connect_timeout=300'
  Ensure-WorkshopEnvDefault -Key "DIRECT_URL" -Value 'postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?connect_timeout=300'
  Ensure-WorkshopEnvDefault -Key "REDIS_DB" -Value "0"
  Ensure-WorkshopEnvDefault -Key "ROOT_URL" -Value "http://localhost:3333"
  Ensure-WorkshopEnvDefault -Key "PORT" -Value $script:WorkshopDefaultPort

  Replace-RemainingWorkshopPlaceholders

  $content = Read-WorkshopText -Path $script:WorkshopEnvFile
  if ($content -match "<INSERT_") {
    throw ".env still contains placeholders. Please review it before starting Docker."
  }
}

function Get-WorkshopAppUrl {
  $port = Get-WorkshopEnvValue -Key "PORT"
  if ([string]::IsNullOrWhiteSpace($port)) {
    $port = $script:WorkshopDefaultPort
  }

  return "http://localhost:$port"
}

function Show-WorkshopFooter {
  $appUrl = Get-WorkshopAppUrl

  Write-Host ""
  Write-Host "Ghostfolio should be available at:"
  Write-Host $appUrl
  Write-Host ""
  Write-Host "Useful commands:"
  Write-Host ".\scripts\check.ps1"
  Write-Host ".\scripts\logs.ps1"
  Write-Host "docker compose --env-file .env -f docker/docker-compose.build.yml ps"
}
