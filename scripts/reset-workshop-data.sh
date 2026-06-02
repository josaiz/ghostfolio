#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)
REPO_ROOT=$(cd -- "$SCRIPT_DIR/.." >/dev/null 2>&1 && pwd)
cd "$REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is required to reset workshop data. Install Node.js >= 22 or use the development runtime." >&2
  exit 1
fi

node tools/workshop/reset-workshop-data.mjs "$@"
