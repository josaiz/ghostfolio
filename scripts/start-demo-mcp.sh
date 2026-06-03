#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)
REPO_ROOT=$(cd -- "$SCRIPT_DIR/.." >/dev/null 2>&1 && pwd)
cd "$REPO_ROOT"

MCP_DIR="tools/mcp/ghostfolio-demo-data-mcp"

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js >= 22 is required to run the demo MCP." >&2
  exit 1
fi

# Install dependencies only if the MCP ever declares some (it is zero-dependency today).
if grep -q '"dependencies": {}' "$MCP_DIR/package.json"; then
  echo "==> MCP zero-dependency: nothing to install."
elif [ ! -d "$MCP_DIR/node_modules" ]; then
  echo "==> Installing MCP dependencies"
  (cd "$MCP_DIR" && npm install)
fi

if [ "${1:-}" = "--serve" ]; then
  echo "==> Starting ghostfolio-demo-data in the foreground (Ctrl+C to exit)."
  echo "    Speaks JSON-RPC over stdin; logs go to stderr."
  exec node "$MCP_DIR/src/index.mjs"
fi

echo "==> OpenCode starts this MCP automatically via opencode.json."
echo "==> Verifying it works..."
node "$MCP_DIR/src/smoke-test.mjs"

cat <<'EOF'

Ready. How to use it:
  - From OpenCode: the `portfolio-domain-agent` agent or the `/workshop-analyze-demo-portfolio` command.
  - Smoke test whenever you like: ./scripts/check-demo-mcp.sh
  - Manual foreground start (debugging): ./scripts/start-demo-mcp.sh --serve
EOF
