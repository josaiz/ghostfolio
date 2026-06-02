#!/usr/bin/env bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)
REPO_ROOT=$(cd -- "$SCRIPT_DIR/.." >/dev/null 2>&1 && pwd)
cd "$REPO_ROOT"

WORKSHOP_ENV_FILE=".env"
WORKSHOP_ENV_EXAMPLE=".env.example"
WORKSHOP_COMPOSE_FILE="docker/docker-compose.build.yml"
WORKSHOP_DEFAULT_PORT="3333"

print_step() {
  printf '\n==> %s\n' "$1"
}

require_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "ERROR: Docker is not installed or is not available in PATH." >&2
    return 1
  fi

  if ! docker compose version >/dev/null 2>&1; then
    echo "ERROR: Docker Compose is not available. Install Docker Desktop or the Docker Compose plugin." >&2
    return 1
  fi

  if ! docker info >/dev/null 2>&1; then
    echo "ERROR: Docker is installed, but the Docker daemon is not running. Start Docker Desktop and try again." >&2
    return 1
  fi
}

require_env_file() {
  if [ ! -f "$WORKSHOP_ENV_FILE" ]; then
    echo "ERROR: .env does not exist. Run ./scripts/start.sh to create it from .env.example." >&2
    return 1
  fi
}

workshop_compose() {
  docker compose --env-file "$WORKSHOP_ENV_FILE" -f "$WORKSHOP_COMPOSE_FILE" "$@"
}

generate_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
    return
  fi

  (
    set +o pipefail 2>/dev/null || true
    LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 64
    printf '\n'
  )
}

get_env_value() {
  local key=$1
  if [ ! -f "$WORKSHOP_ENV_FILE" ]; then
    return 0
  fi

  awk -F= -v key="$key" '$1 == key { sub(/^[^=]*=/, ""); print; exit }' "$WORKSHOP_ENV_FILE"
}

set_env_value() {
  local key=$1
  local value=$2

  if grep -q "^${key}=" "$WORKSHOP_ENV_FILE"; then
    KEY="$key" VALUE="$value" perl -0pi -e 's/^\Q$ENV{KEY}\E=.*/$ENV{KEY} . "=" . $ENV{VALUE}/me' "$WORKSHOP_ENV_FILE"
  else
    printf '\n%s=%s\n' "$key" "$value" >>"$WORKSHOP_ENV_FILE"
  fi
}

ensure_env_default() {
  local key=$1
  local value=$2

  if [ -z "$(get_env_value "$key")" ]; then
    set_env_value "$key" "$value"
  fi
}

ensure_secret_value() {
  local key=$1
  local value
  value=$(get_env_value "$key")

  if [ -z "$value" ] || printf '%s' "$value" | grep -q '<INSERT_'; then
    set_env_value "$key" "$(generate_secret)"
  fi
}

ensure_workshop_project_name() {
  local value
  value=$(get_env_value "COMPOSE_PROJECT_NAME")

  if [ -z "$value" ] || [ "$value" = "ghostfolio" ]; then
    set_env_value "COMPOSE_PROJECT_NAME" "ghostfolio_build"
  fi
}

replace_remaining_placeholders() {
  local placeholders
  placeholders=$(grep -oE '<INSERT_[^>]+>' "$WORKSHOP_ENV_FILE" | sort -u || true)

  if [ -z "$placeholders" ]; then
    return
  fi

  local placeholder
  while IFS= read -r placeholder; do
    [ -z "$placeholder" ] && continue
    PLACEHOLDER="$placeholder" SECRET="$(generate_secret)" perl -0pi -e 's/\Q$ENV{PLACEHOLDER}\E/$ENV{SECRET}/g' "$WORKSHOP_ENV_FILE"
  done <<EOF
$placeholders
EOF
}

ensure_env_file() {
  if [ ! -f "$WORKSHOP_ENV_FILE" ]; then
    if [ ! -f "$WORKSHOP_ENV_EXAMPLE" ]; then
      echo "ERROR: .env is missing and .env.example was not found." >&2
      return 1
    fi

    cp "$WORKSHOP_ENV_EXAMPLE" "$WORKSHOP_ENV_FILE"
    echo "Created .env from .env.example."
  fi

  ensure_workshop_project_name
  ensure_env_default "REDIS_HOST" "redis"
  ensure_env_default "REDIS_PORT" "6379"
  ensure_secret_value "REDIS_PASSWORD"

  ensure_env_default "POSTGRES_DB" "ghostfolio-db"
  ensure_env_default "POSTGRES_USER" "user"
  ensure_secret_value "POSTGRES_PASSWORD"

  ensure_secret_value "ACCESS_TOKEN_SALT"
  ensure_secret_value "JWT_SECRET_KEY"
  ensure_env_default "DATABASE_URL" 'postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?connect_timeout=300'
  ensure_env_default "DIRECT_URL" 'postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?connect_timeout=300'
  ensure_env_default "REDIS_DB" "0"
  ensure_env_default "ROOT_URL" "http://localhost:3333"
  ensure_env_default "PORT" "$WORKSHOP_DEFAULT_PORT"

  replace_remaining_placeholders

  if grep -q '<INSERT_' "$WORKSHOP_ENV_FILE"; then
    echo "ERROR: .env still contains placeholders. Please review it before starting Docker." >&2
    return 1
  fi
}

get_app_url() {
  local port
  port=$(get_env_value "PORT")
  if [ -z "$port" ]; then
    port=$WORKSHOP_DEFAULT_PORT
  fi

  printf 'http://localhost:%s\n' "$port"
}

print_success_footer() {
  local app_url
  app_url=$(get_app_url)

  cat <<EOF

Ghostfolio should be available at:
$app_url

Useful commands:
./scripts/check.sh
./scripts/logs.sh
docker compose --env-file .env -f docker/docker-compose.build.yml ps
EOF
}
