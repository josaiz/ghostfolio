#!/usr/bin/env bash
set -uo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)/common.sh"

failures=0

pass() {
  printf '[OK] %s\n' "$1"
}

fail() {
  printf '[FAIL] %s\n' "$1"
  failures=$((failures + 1))
}

print_step "Checking Docker"
if require_docker; then
  pass "Docker is installed, Docker Compose works, and Docker is running."
else
  fail "Docker is not ready. Start Docker Desktop and try again."
  exit 1
fi

if ! require_env_file; then
  fail ".env is missing. Run ./scripts/start.sh first."
  exit 1
fi

print_step "Container status"
if workshop_compose ps; then
  pass "Docker Compose returned container status."
else
  fail "Could not read Docker Compose status."
fi

app_url=$(get_app_url)
print_step "Checking Ghostfolio at $app_url"
if ! command -v curl >/dev/null 2>&1; then
  fail "curl is not installed, so the HTTP check cannot run."
elif curl -fsS "$app_url/api/v1/health" >/dev/null 2>&1 || curl -fsSI "$app_url" >/dev/null 2>&1; then
  pass "Ghostfolio responds on $app_url."
else
  fail "Ghostfolio does not respond yet. It may still be starting; check ./scripts/logs.sh."
fi

print_step "Checking PostgreSQL"
if workshop_compose exec -T postgres sh -c 'pg_isready -d "$POSTGRES_DB" -U "$POSTGRES_USER"' >/dev/null 2>&1; then
  pass "PostgreSQL is accepting connections."
else
  fail "PostgreSQL is not ready. Check Docker Desktop and ./scripts/logs.sh."
fi

print_step "Checking Redis"
if workshop_compose exec -T redis sh -c 'redis-cli --pass "$REDIS_PASSWORD" ping' 2>/dev/null | grep -q PONG; then
  pass "Redis replies to ping."
else
  fail "Redis is not ready. Check REDIS_PASSWORD in .env and ./scripts/logs.sh."
fi

print_step "Checking restart loops"
container_ids=$(workshop_compose ps -q 2>/dev/null || true)
if [ -z "$container_ids" ]; then
  fail "No containers were found for this compose project."
else
  restarting_names=$(
    for container_id in $container_ids; do
      docker inspect -f '{{if .State.Restarting}}{{.Name}}{{end}}' "$container_id" 2>/dev/null | sed 's#^/##'
    done | awk 'NF'
  )

  if [ -z "$restarting_names" ]; then
    pass "No workshop containers are restarting in a loop."
  else
    fail "These containers are restarting: $restarting_names"
  fi
fi

if [ "$failures" -eq 0 ]; then
  printf '\nAll checks passed. Ghostfolio is ready: %s\n' "$app_url"
  exit 0
fi

printf '\n%s check(s) failed. The fastest next step is usually: ./scripts/logs.sh\n' "$failures"
exit 1
