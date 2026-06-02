#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)/common.sh"

print_step "Checking Docker"
require_docker

print_step "Preparing .env"
ensure_env_file

print_step "Rebuilding Ghostfolio from local source without cache"
workshop_compose build --no-cache

print_step "Starting Ghostfolio"
workshop_compose up -d

print_success_footer
