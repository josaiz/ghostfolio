#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)/common.sh"

print_step "Checking Docker"
require_docker
require_env_file

print_step "Stopping Ghostfolio without deleting data"
workshop_compose down
