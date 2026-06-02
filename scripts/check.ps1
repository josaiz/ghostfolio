. "$PSScriptRoot\common.ps1"

$failures = 0

function Write-Pass {
  param([string]$Message)
  Write-Host "[OK] $Message"
}

function Write-Fail {
  param([string]$Message)
  Write-Host "[FAIL] $Message"
  $script:failures += 1
}

Write-WorkshopStep "Checking Docker"
try {
  Assert-Docker
  Write-Pass "Docker is installed, Docker Compose works, and Docker is running."
} catch {
  Write-Fail "Docker is not ready. Start Docker Desktop and try again."
  exit 1
}

if (-not (Assert-WorkshopEnvFile)) {
  Write-Fail ".env is missing. Run .\scripts\start.ps1 first."
  exit 1
}

Write-WorkshopStep "Container status"
Invoke-WorkshopCompose ps
if ($LASTEXITCODE -eq 0) {
  Write-Pass "Docker Compose returned container status."
} else {
  Write-Fail "Could not read Docker Compose status."
}

$appUrl = Get-WorkshopAppUrl
Write-WorkshopStep "Checking Ghostfolio at $appUrl"
try {
  Invoke-WebRequest -Uri "$appUrl/api/v1/health" -UseBasicParsing -TimeoutSec 10 | Out-Null
  Write-Pass "Ghostfolio responds on $appUrl."
} catch {
  try {
    Invoke-WebRequest -Uri $appUrl -UseBasicParsing -TimeoutSec 10 | Out-Null
    Write-Pass "Ghostfolio responds on $appUrl."
  } catch {
    Write-Fail "Ghostfolio does not respond yet. It may still be starting; check .\scripts\logs.ps1."
  }
}

Write-WorkshopStep "Checking PostgreSQL"
Invoke-WorkshopCompose exec -T postgres sh -c 'pg_isready -d "$POSTGRES_DB" -U "$POSTGRES_USER"' *> $null
if ($LASTEXITCODE -eq 0) {
  Write-Pass "PostgreSQL is accepting connections."
} else {
  Write-Fail "PostgreSQL is not ready. Check Docker Desktop and .\scripts\logs.ps1."
}

Write-WorkshopStep "Checking Redis"
$redisOutput = & docker compose --env-file $script:WorkshopEnvFile -f $script:WorkshopComposeFile exec -T redis sh -c 'redis-cli --pass "$REDIS_PASSWORD" ping' 2>$null
if ($LASTEXITCODE -eq 0 -and ($redisOutput -join "`n") -match "PONG") {
  Write-Pass "Redis replies to ping."
} else {
  Write-Fail "Redis is not ready. Check REDIS_PASSWORD in .env and .\scripts\logs.ps1."
}

Write-WorkshopStep "Checking restart loops"
$containerIds = & docker compose --env-file $script:WorkshopEnvFile -f $script:WorkshopComposeFile ps -q 2>$null
if (-not $containerIds) {
  Write-Fail "No containers were found for this compose project."
} else {
  $restartingNames = @()
  foreach ($containerId in $containerIds) {
    $state = & docker inspect -f '{{.Name}} {{.State.Status}} {{.State.Restarting}}' $containerId 2>$null
    if ($state -match " true$") {
      $restartingNames += (($state -split " ")[0] -replace "^/", "")
    }
  }

  if ($restartingNames.Count -eq 0) {
    Write-Pass "No workshop containers are restarting in a loop."
  } else {
    Write-Fail "These containers are restarting: $($restartingNames -join ', ')"
  }
}

if ($failures -eq 0) {
  Write-Host ""
  Write-Host "All checks passed. Ghostfolio is ready: $appUrl"
  exit 0
}

Write-Host ""
Write-Host "$failures check(s) failed. The fastest next step is usually: .\scripts\logs.ps1"
exit 1
