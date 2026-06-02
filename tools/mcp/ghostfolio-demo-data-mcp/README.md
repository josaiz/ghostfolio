# ghostfolio-demo-data MCP

MCP local **read-only** que expone el dataset demo del workshop a los agentes de OpenCode.
Permite consultar cuentas, holdings, concentración y anomalías del portfolio demo **sin tocar la base de datos**
ni los datos reales, de forma determinista y reproducible.

- **Fuente de datos**: los CSV de `data/workshop/import/` (no PostgreSQL).
- **Modo**: estrictamente solo lectura. Ninguna tool escribe, borra ni muta datos.
- **Dependencias**: **ninguna**. Es un servidor MCP stdio (JSON-RPC 2.0) implementado a mano con Node ≥ 22.
- **Sin LLM**. Sin asesoramiento financiero: las salidas son descriptivas y educativas.

## Tools

| Tool | Args | Devuelve |
|------|------|----------|
| `list_demo_accounts` | — | Cuentas demo (divisas, nº símbolos, nº actividades). |
| `get_demo_portfolio_summary` | — | Totales + holdings por cuenta + coste invertido + concentración por símbolo. |
| `list_demo_activities` | `account?`, `symbol?`, `type?`, `limit?` | Actividades filtradas. |
| `detect_demo_anomalies` | `source?` (`anomalies`\|`main`\|`both`) | Anomalías deterministas (duplicado, comisión alta, divisa, precio atípico, sobreventa). |
| `get_account_summary` | `account` | Resumen de una cuenta concreta. |
| `get_symbol_exposure` | `symbol?` | Exposición por símbolo en todo el portfolio. |
| `get_recent_activities` | `limit?` | N actividades más recientes. |

La detección de anomalías deriva sus umbrales del dataset **limpio** (`ghostfolio-workshop-main.csv`) y los aplica
a la fuente indicada. No usa las etiquetas `ANOMALY=` del CSV, así que escanear el dataset limpio da ~0 hallazgos.

## Cómo lo usa OpenCode

Registrado en `opencode.json` (raíz del repo):

```json
{
  "mcp": {
    "ghostfolio-demo-data": {
      "type": "local",
      "command": ["node", "tools/mcp/ghostfolio-demo-data-mcp/src/index.mjs"],
      "enabled": true
    }
  }
}
```

OpenCode arranca el proceso automáticamente y expone las tools prefijadas con el nombre del servidor
(`ghostfolio-demo-data`). Úsalas desde el agente `portfolio-domain-agent` o el command
`/workshop-analyze-demo-portfolio`.

## Probarlo (smoke test)

```bash
# Mac/Linux
node tools/mcp/ghostfolio-demo-data-mcp/src/smoke-test.mjs
./scripts/check-demo-mcp.sh

# Windows PowerShell
node tools\mcp\ghostfolio-demo-data-mcp\src\smoke-test.mjs
.\scripts\check-demo-mcp.ps1
```

El smoke test hace `initialize` → `tools/list` → `tools/call` y valida las respuestas (3 cuentas, 54 actividades,
5 tipos de anomalía). Exit code 0 = OK.

## Llamada manual (depuración)

El servidor habla JSON-RPC por stdin/stdout (un mensaje JSON por línea):

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"cli","version":"1.0.0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_demo_portfolio_summary","arguments":{}}}' \
  | node tools/mcp/ghostfolio-demo-data-mcp/src/index.mjs
```

(Los logs van a `stderr`; `stdout` solo lleva mensajes MCP.)

## Por qué zero-dependency

Para el workshop priorizamos reproducibilidad y arranque inmediato en Mac/Windows: el servidor funciona con `node`
y nada más, sin `npm install` ni red. El protocolo MCP por stdio es JSON-RPC simple y se implementa a mano sin riesgo.
Ver `docs/workshop/reference-implementation.md` y la skill `mcp-server-authoring`.

## Limitaciones

- Lee CSV, no PostgreSQL. Es una decisión deliberada (estable y reproducible para el workshop). Una versión futura
  podría leer la API HTTP de Ghostfolio en modo read-only reutilizando `tools/workshop/lib/workshop-data.mjs`.
- "Coste invertido nominal" no convierte divisas ni usa precios de mercado actuales.
