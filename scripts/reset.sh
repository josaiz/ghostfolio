#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)/common.sh"

echo "WARNING: this will delete the local Ghostfolio database and Redis volumes."

if [ "${1:-}" != "--force" ]; then
  read -r -p "Continue? [y/N] " confirm
  if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Aborted."
    exit 0
  fi
fi

print_step "Checking Docker"
require_docker
require_env_file

print_step "Deleting containers, networks, and volumes"
workshop_compose down -v
