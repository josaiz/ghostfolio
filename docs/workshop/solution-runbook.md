# Solution runbook — how to run and demonstrate the reference solution

Exact steps to start up, test the happy path, and demonstrate the reference solution.

## 0. Requirements

- Node.js ≥ 22.18.0 (`node -v`).
- Docker Desktop (only if you want to run Ghostfolio; the MCP demo does not need it).
- OpenCode installed and open at the **root** of the repo.

## 1. Verify that OpenCode detects the components

With OpenCode open at the root:
- **Commands**: type `/workshop-` and the 9 commands should appear.
- **Agents**: the 8 agents should be listed (`ghostfolio-architect`, `frontend-angular-agent`, ...).
- **Skills**: the 8 skills from `.opencode/skills/` should be available (+ the generic ones `angular-developer`, `nestjs-best-practices`).
- **MCP**: the `ghostfolio-demo-data` server should appear connected with its 7 tools.

If something does not appear: confirm you are at the root, that the plural folders (`agents/`, `commands/`, `skills/`) exist,
and restart OpenCode after changes to `opencode.json`.

## 2. Verify the MCP (without Ghostfolio)

```bash
# Mac/Linux
./scripts/check-demo-mcp.sh
# Windows
.\scripts\check-demo-mcp.ps1
```
Expected: 7 checks in green, `✅ MCP ghostfolio-demo-data OK`.

## 3. (Optional) Start Ghostfolio and demo data

```bash
./scripts/start.sh                 # http://localhost:3333   (Windows: .\scripts\start.ps1)
./scripts/check.sh
# create admin from the UI, copy its security token, and then:
./scripts/seed-workshop-data.sh    # Windows: .\scripts\seed-workshop-data.ps1
```

## 4. Run the main commands

```text
/workshop-inspect-architecture portfolio insights
/workshop-analyze-demo-portfolio
/workshop-review-financial-safety docs/workshop/generated/INT-01-portfolio-insights.md
/workshop-plan-frontend-card FE-01
/workshop-plan-backend-card BE-01
/workshop-plan-mcp-card MCP-02
/workshop-prepare-team-handoff INT-01
/workshop-demo-runbook
```
The outputs you generate are saved in `docs/workshop/generated/`.

## 5. Demo happy path (Portfolio Insights Demo)

1. `./scripts/check-demo-mcp.sh` → green.
2. In OpenCode: `/workshop-analyze-demo-portfolio`.
   - Should show 3 accounts, 54 activities and concentration by account with figures from the MCP, e.g.:
     - *Trade Republic Growth*: AAPL 26.2%, MSFT 21.8%, NVDA 19.7% (top-3 67.7%).
     - *Crypto Exchange*: BTC 60.8%, ETH 39.2%.
   - And anomalies: 5 types in the sandbox (`exact-duplicate`, `high-fee`, `currency-mismatch`, `price-outlier`, `oversell-risk`).
3. `/workshop-review-financial-safety` on that result → **PASS** (descriptive text, no advice).
4. (Optional) `/workshop-plan-frontend-card FE-01` to show how the widget would be planned.

Demo success criteria: the cycle **demo data → MCP → analysis → insights → safety** runs from start to finish,
is reproducible and does not recommend buying/selling.

## 6. Direct MCP call (to teach the protocol)

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"cli","version":"1.0.0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_account_summary","arguments":{"account":"Trade Republic Growth"}}}' \
  | node tools/mcp/ghostfolio-demo-data-mcp/src/index.mjs 2>/dev/null
```

## 7. Presenting the final solution

- Show how a card (e.g. FE-01) flows down through command → agent → skill → (MCP) → plan → safety → handoff.
- Close with `pedagogical-matrix.md`: why each team did something different and how it all fits into the same epic.

## 8. Reset / cleanup

- Demo data: `./scripts/reset-workshop-data.sh` (only deletes activities tagged `WORKSHOP_DEMO_DATA`).
- Docker environment: `./scripts/reset.sh` (deletes local containers/volumes). **Do not** run in the middle of the session.
- Generated artifacts: you can empty `docs/workshop/generated/` (does not affect the solution).
