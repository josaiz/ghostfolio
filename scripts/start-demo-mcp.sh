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
  echo "==> MCP zero-dependency: no hay nada que instalar."
elif [ ! -d "$MCP_DIR/node_modules" ]; then
  echo "==> Instalando dependencias del MCP"
  (cd "$MCP_DIR" && npm install)
fi

if [ "${1:-}" = "--serve" ]; then
  echo "==> Arrancando ghostfolio-demo-data en primer plano (Ctrl+C para salir)."
  echo "    Habla JSON-RPC por stdin; los logs salen por stderr."
  exec node "$MCP_DIR/src/index.mjs"
fi

echo "==> OpenCode arranca este MCP automáticamente vía opencode.json."
echo "==> Verificando que funciona..."
node "$MCP_DIR/src/smoke-test.mjs"

cat <<'EOF'

Listo. Cómo usarlo:
  - Desde OpenCode: el agente `portfolio-domain-agent` o el command `/workshop-analyze-demo-portfolio`.
  - Smoke test cuando quieras: ./scripts/check-demo-mcp.sh
  - Arranque manual en primer plano (depuración): ./scripts/start-demo-mcp.sh --serve
EOF
