---
description: Produce un plan para crear o extender el MCP local read-only de datos demo. P. ej. /workshop-plan-mcp-card MCP-02
agent: mcp-builder-agent
subtask: true
---

Planifica el trabajo de MCP para la tarjeta: **$ARGUMENTS**

Backlog (localiza la tarjeta $1):
@docs/workshop/whiteboard-backlog.md

Contexto del MCP existente:
@tools/mcp/ghostfolio-demo-data-mcp/README.md

Trabaja así:
1. Carga la skill `mcp-server-authoring`.
2. Revisa la capa de datos actual (`tools/mcp/ghostfolio-demo-data-mcp/src/data.mjs`) y reutilízala. No dupliques parseo de CSV.
3. Entrega un **plan**:
   - Nombre y propósito de la tool nueva (o cambio), `inputSchema` (JSON Schema) y forma de la salida.
   - Qué datos del dataset demo usa y cómo (read-only).
   - Dónde se registra (`tools/list` y `tools/call` en `src/index.mjs`).
   - Cómo se prueba: `scripts/check-demo-mcp.sh|.ps1` y un ejemplo de `tools/call`.
4. Si se te pide implementar, hazlo en `tools/mcp/ghostfolio-demo-data-mcp/`, mantén **cero dependencias** y verifica con el smoke test.

Guarda el plan en `docs/workshop/generated/$1-mcp-plan.md`. Solo lectura sobre datos demo. No commit/push.
