---
description: Produces a plan to create or extend the local read-only demo data MCP. E.g. /workshop-plan-mcp-card MCP-02
agent: mcp-builder-agent
subtask: true
---

Plan the MCP work for the card: **$ARGUMENTS**

Backlog (locate card $1):
@docs/workshop/whiteboard-backlog.md

Existing MCP context:
@tools/mcp/ghostfolio-demo-data-mcp/README.md

Work like this:
1. Load the `mcp-server-authoring` skill.
2. Review and reuse the current data layer (`tools/mcp/ghostfolio-demo-data-mcp/src/data.mjs`). Do not duplicate CSV parsing.
3. Deliver a **plan**:
   - Name and purpose of the new tool (or change), `inputSchema` (JSON Schema), and output shape.
   - Which demo dataset fields it uses and how (read-only).
   - Where it is registered (`tools/list` and `tools/call` in `src/index.mjs`).
   - How to test it: `scripts/check-demo-mcp.sh|.ps1` and an example `tools/call`.
4. If you are asked to implement it, do so in `tools/mcp/ghostfolio-demo-data-mcp/`, keep **zero dependencies**, and verify with the smoke test.

Save the plan in `docs/workshop/generated/$1-mcp-plan.md`. Demo data is read-only. No commit/push.
