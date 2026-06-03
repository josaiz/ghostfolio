#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)
REPO_ROOT=$(cd -- "$SCRIPT_DIR/.." >/dev/null 2>&1 && pwd)
cd "$REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js >= 22 is required to run the demo MCP smoke test." >&2
  exit 1
fi

echo "==> Checking the ghostfolio-demo-data MCP (initialize + tools/list + tools/call)"
node tools/mcp/ghostfolio-demo-data-mcp/src/smoke-test.mjs
