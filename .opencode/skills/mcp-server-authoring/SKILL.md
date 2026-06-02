---
name: mcp-server-authoring
description: Crear y extender el MCP local read-only de datos demo de Ghostfolio. Explica el protocolo MCP stdio, el patrón zero-dependency usado en el workshop y cómo añadir una tool nueva de forma segura.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Autoría del MCP de datos demo (workshop)

Cómo trabajar el MCP local `ghostfolio-demo-data` en `tools/mcp/ghostfolio-demo-data-mcp/`.

## Por qué zero-dependency
El MCP del workshop **no usa dependencias externas** (ni el SDK oficial): así "arranca con `node` y ya", es
reproducible en Mac/Windows y no exige `npm install` con red durante la sesión. El protocolo MCP por stdio es
JSON-RPC 2.0 simple y lo implementamos a mano. (Si algún día se quiere el SDK oficial, esta skill explica el
equivalente, pero la opción por defecto es zero-dep.)

## Protocolo MCP por stdio (lo esencial, validado contra la spec)
- Mensajes **JSON-RPC 2.0 delimitados por `\n`**, sin saltos de línea embebidos, UTF-8.
- **`stdout` solo lleva mensajes MCP**. Los logs van a **`stderr`** (`console.error`). Nunca `console.log` al stdout.
- `initialize` → responde `{ protocolVersion, capabilities: { tools: {} }, serverInfo }`. Devuelve la
  `protocolVersion` que pide el cliente.
- `notifications/initialized` → es notificación, **no se responde**.
- `tools/list` → `{ tools: [{ name, description, inputSchema }] }` (inputSchema es JSON Schema).
- `tools/call` `{ name, arguments }` → `{ content: [{ type: "text", text }], isError? }`.
- Métodos desconocidos → error JSON-RPC `-32601`.

## Estructura del MCP
```text
tools/mcp/ghostfolio-demo-data-mcp/
  package.json     # metadata + scripts; sin dependencias de runtime
  README.md        # cómo arrancarlo y probarlo
  src/index.mjs    # servidor stdio (handshake + dispatch de tools)
  src/data.mjs     # carga read-only del dataset demo (reutiliza tools/workshop/lib/workshop-data.mjs)
```

## Cómo añadir una tool nueva (read-only)
1. Decide `name`, `description` y `inputSchema` (JSON Schema con `type: "object"`, `properties`, `required`).
2. Implementa la lógica como **función pura** que lee de `src/data.mjs` (nunca escribe).
3. Regístrala en el array de tools (para `tools/list`) y en el dispatch de `tools/call`.
4. Devuelve `content: [{ type: "text", text: JSON.stringify(resultado, null, 2) }]`.
5. Valida con `scripts/check-demo-mcp.sh|.ps1` (hace `initialize` + `tools/list` + `tools/call`).
6. Si la tool es nueva y debe usarse por agentes, confirma que `opencode.json` registra el MCP.

## Cuándo usar esta skill
- MCP-01/02/03 y cualquier extensión del MCP demo.

## Cuándo NO usarla
- Para tocar el backend/frontend de Ghostfolio (otras skills).

## Checklist de calidad
- [ ] La tool es **estrictamente read-only**; no escribe ni borra nada.
- [ ] `inputSchema` válido; valida argumentos; errores como `isError: true` con mensaje claro.
- [ ] Reutiliza `src/data.mjs`; no duplica el parser de CSV.
- [ ] Cero dependencias nuevas; logs a `stderr`, no a `stdout`.
- [ ] Smoke test verde. Textos de salida sin consejo financiero personalizado.

## Límites de seguridad
- No conectes a PostgreSQL en esta versión; la fuente es CSV demo. No expongas `.env` ni secretos.
