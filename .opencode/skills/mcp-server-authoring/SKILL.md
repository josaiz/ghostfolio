---
name: mcp-server-authoring
description: Create and extend the local read-only Ghostfolio demo data MCP. Explains the MCP stdio protocol, the zero-dependency pattern used in the workshop, and how to add a new tool safely.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Demo Data MCP Authoring (workshop)

How to work on the local MCP `ghostfolio-demo-data` in `tools/mcp/ghostfolio-demo-data-mcp/`.

## Why Zero Dependency
The workshop MCP **does not use external dependencies** (not even the official SDK): this way it "starts with `node`, and that's it",
is reproducible on Mac/Windows, and does not require a networked `npm install` during the session. MCP over stdio is
simple JSON-RPC 2.0, and we implement it by hand. (If the official SDK is wanted someday, this skill explains the
equivalent, but the default option is zero-dep.)

## MCP over stdio Protocol (essentials, validated against the spec)
- **JSON-RPC 2.0 messages delimited by `\n`**, with no embedded newlines, UTF-8.
- **`stdout` carries MCP messages only**. Logs go to **`stderr`** (`console.error`). Never `console.log` to stdout.
- `initialize` -> respond with `{ protocolVersion, capabilities: { tools: {} }, serverInfo }`. Return the
  `protocolVersion` requested by the client.
- `notifications/initialized` -> this is a notification, **do not respond**.
- `tools/list` -> `{ tools: [{ name, description, inputSchema }] }` (`inputSchema` is JSON Schema).
- `tools/call` `{ name, arguments }` -> `{ content: [{ type: "text", text }], isError? }`.
- Unknown methods -> JSON-RPC error `-32601`.

## MCP Structure
```text
tools/mcp/ghostfolio-demo-data-mcp/
  package.json     # metadata + scripts; no runtime dependencies
  README.md        # how to start and test it
  src/index.mjs    # stdio server (handshake + tool dispatch)
  src/data.mjs     # read-only demo dataset loading (reuses tools/workshop/lib/workshop-data.mjs)
```

## How to Add a New Tool (read-only)
1. Decide `name`, `description`, and `inputSchema` (JSON Schema with `type: "object"`, `properties`, `required`).
2. Implement the logic as a **pure function** that reads from `src/data.mjs` (never writes).
3. Register it in the tools array (for `tools/list`) and in the `tools/call` dispatch.
4. Return `content: [{ type: "text", text: JSON.stringify(result, null, 2) }]`.
5. Validate with `scripts/check-demo-mcp.sh|.ps1` (runs `initialize` + `tools/list` + `tools/call`).
6. If the tool is new and agents should use it, confirm that `opencode.json` registers the MCP.

## When to Use This Skill
- MCP-01/02/03 and any demo MCP extension.

## When NOT to Use It
- To touch the Ghostfolio backend/frontend (use other skills).

## Quality Checklist
- [ ] The tool is **strictly read-only**; it does not write or delete anything.
- [ ] Valid `inputSchema`; validates arguments; errors are `isError: true` with a clear message.
- [ ] Reuses `src/data.mjs`; does not duplicate the CSV parser.
- [ ] Zero new dependencies; logs to `stderr`, not `stdout`.
- [ ] Smoke test is green. Output texts contain no personalized financial advice.

## Safety Limits
- Do not connect to PostgreSQL in this version; the source is the demo CSV. Do not expose `.env` or secrets.
