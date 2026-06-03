# ghostfolio-demo-data MCP

Local **read-only** MCP that exposes the workshop demo dataset to OpenCode agents.
Allows querying accounts, holdings, concentration, and anomalies of the demo portfolio **without touching the database**
or real data, in a deterministic and reproducible way.

- **Data source**: the CSVs in `data/workshop/import/` (not PostgreSQL).
- **Mode**: strictly read-only. No tool writes, deletes, or mutates data.
- **Dependencies**: **none**. It is a stdio MCP server (JSON-RPC 2.0) implemented manually with Node ≥ 22.
- **No LLM**. No financial advice: outputs are descriptive and educational.

## Tools

| Tool | Args | Returns |
|------|------|---------|
| `list_demo_accounts` | — | Demo accounts (currencies, number of symbols, number of activities). |
| `get_demo_portfolio_summary` | — | Totals + holdings per account + invested cost + concentration by symbol. |
| `list_demo_activities` | `account?`, `symbol?`, `type?`, `limit?` | Filtered activities. |
| `detect_demo_anomalies` | `source?` (`anomalies`\|`main`\|`both`) | Deterministic anomalies (duplicate, high commission, currency, atypical price, oversell). |
| `get_account_summary` | `account` | Summary of a specific account. |
| `get_symbol_exposure` | `symbol?` | Exposure by symbol across the entire portfolio. |
| `get_recent_activities` | `limit?` | N most recent activities. |

Anomaly detection derives its thresholds from the **clean** dataset (`ghostfolio-workshop-main.csv`) and applies them
to the indicated source. It does not use the `ANOMALY=` labels from the CSV, so scanning the clean dataset yields ~0 findings.

## How OpenCode uses it

Registered in `opencode.json` (repo root):

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

OpenCode starts the process automatically and exposes the tools prefixed with the server name
(`ghostfolio-demo-data`). Use them from the `portfolio-domain-agent` agent or the command
`/workshop-analyze-demo-portfolio`.

## Testing it (smoke test)

```bash
# Mac/Linux
node tools/mcp/ghostfolio-demo-data-mcp/src/smoke-test.mjs
./scripts/check-demo-mcp.sh

# Windows PowerShell
node tools\mcp\ghostfolio-demo-data-mcp\src\smoke-test.mjs
.\scripts\check-demo-mcp.ps1
```

The smoke test performs `initialize` → `tools/list` → `tools/call` and validates the responses (3 accounts, 54 activities,
5 anomaly types). Exit code 0 = OK.

## Manual call (debugging)

The server speaks JSON-RPC over stdin/stdout (one JSON message per line):

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"cli","version":"1.0.0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_demo_portfolio_summary","arguments":{}}}' \
  | node tools/mcp/ghostfolio-demo-data-mcp/src/index.mjs
```

(Logs go to `stderr`; `stdout` only carries MCP messages.)

## Why zero-dependency

For the workshop we prioritize reproducibility and immediate startup on Mac/Windows: the server runs with `node`
and nothing else, no `npm install` or network needed. The MCP protocol over stdio is simple JSON-RPC and can be implemented manually without risk.
See `docs/workshop/reference-implementation.md` and the skill `mcp-server-authoring`.

## Limitations

- Reads CSV, not PostgreSQL. This is a deliberate decision (stable and reproducible for the workshop). A future version
  could read the Ghostfolio HTTP API in read-only mode by reusing `tools/workshop/lib/workshop-data.mjs`.
- "Nominal invested cost" does not convert currencies or use current market prices.
