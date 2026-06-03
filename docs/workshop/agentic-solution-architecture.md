# Agentic solution architecture — Portfolio Insights Assistant

How commands, agents, skills and the MCP fit together to solve **real product tasks** on Ghostfolio,
in a governed and repeatable way with OpenCode.

## 1. Product epic we are solving

**Portfolio Insights Assistant**: a Ghostfolio enhancement that, on top of the demo portfolio, (a) shows a summary,
(b) detects concentration by account/symbol, (c) detects simple anomalies in imported data, (d) presents
basic insights, (e) queries demo data via a read-only MCP and (f) guarantees it does not give personalised financial advice.

We do not use a real LLM for the calculations: the insights are **deterministic and reproducible**. The value of the workshop
is not "asking code from AI", but **building an agentic development system** that implements this enhancement.

## 2. Commands (`.opencode/commands/`)

| Command | Purpose | Agent |
|---------|----------|--------|
| `/workshop-inspect-architecture` | Investigate architecture and map it (FND-01). | ghostfolio-architect |
| `/workshop-plan-frontend-card` | Plan for a frontend widget/view (FE-*). | frontend-angular-agent |
| `/workshop-plan-backend-card` | Plan for an endpoint/service (BE-*). | backend-nestjs-agent |
| `/workshop-plan-mcp-card` | Plan for an MCP tool (MCP-*). | mcp-builder-agent |
| `/workshop-analyze-demo-portfolio` | Descriptive insights from the demo portfolio (DATA-01/INT-01). | portfolio-domain-agent |
| `/workshop-implement-small-product-slice` | Implement a minimal happy path (INT-01). | (active agent) |
| `/workshop-review-financial-safety` | Financial safety gate (SAFE-02). | financial-safety-reviewer |
| `/workshop-prepare-team-handoff` | Handoff between teams (INT-02). | workshop-facilitator-agent |
| `/workshop-demo-runbook` | Demo runbook (INT-01). | workshop-facilitator-agent |

## 3. Agents (`.opencode/agents/`)

- `ghostfolio-architect` — investigates architecture (read-only).
- `frontend-angular-agent` — Angular/Nx frontend.
- `backend-nestjs-agent` — NestJS endpoints/services.
- `prisma-data-agent` — data/Prisma (read-only).
- `mcp-builder-agent` — local read-only MCP.
- `portfolio-domain-agent` — portfolio demo domain/insights.
- `financial-safety-reviewer` — financial limits (read-only).
- `workshop-facilitator-agent` — facilitation/handoffs (primary).

## 4. Skills (`.opencode/skills/`)

`ghostfolio-domain-analysis`, `angular-nx-development`, `nestjs-api-development`, `prisma-readonly-data-access`,
`mcp-server-authoring`, `financial-safety-review`, `workshop-task-design`, `product-slice-delivery`.

In addition, OpenCode discovers the generic skills already present in the repo: `.agents/skills/angular-developer` and
`.agents/skills/nestjs-best-practices`. Ours **reference** them (generic knowledge → how to apply it in Ghostfolio).

## 5. MCP (`tools/mcp/ghostfolio-demo-data-mcp/`)

Local **read-only** MCP server, zero-dependency, registered in `opencode.json` as `ghostfolio-demo-data`.
Reads the demo CSVs from `data/workshop/import/`. Tools: `list_demo_accounts`, `get_demo_portfolio_summary`,
`list_demo_activities`, `detect_demo_anomalies`, `get_account_summary`, `get_symbol_exposure`, `get_recent_activities`.

## 6. How each component solves product tasks

- **Command** = the repeatable "how to work" for a card (investigate/plan/implement/review).
- **Agent** = the "who", with permissions scoped to its function (research agents do not edit).
- **Skill** = the "what to know" about the repo and the domain, to apply real patterns.
- **MCP** = the "what data", in a stable and read-only way, without loose prompts.

Together they turn "make an insights widget" into a governed flow: map → plan with real patterns →
fetch data from the MCP → review safety → handoff.

## 7. What each team builds

- **Frontend**: FE-01/02/03 — insights widget/view/button (plan or minimal code).
- **Backend**: BE-01/02 — mock endpoint + concentration service (plan or minimal code).
- **Data/Domain**: FND-02, DATA-01/02 — insights contract and concentration/anomaly rules.
- **MCP/Platform**: MCP-01/02/03 — read-only server and tools (study it and extend it).
- **Safety**: SAFE-01/02 — limits guide and review gate (they review the others).
- **Integration/Facilitation**: INT-01/02 — demonstrable happy path and handoffs.

## 8. Base branch vs solutions branch

- **Base branch** (what participants see at the start): Ghostfolio running locally with demo data, the
  start/seed scripts and the dataset. **Without** `.opencode/`, **without** MCP, **without** agentic workshop docs.
- **Solutions branch** (`workshop/solutions`, this one): adds `opencode.json`, `AGENTS.md`, `.opencode/` (agents,
  commands, skills), the `ghostfolio-demo-data` MCP, the `*-demo-mcp.*` scripts and all the docs under `docs/workshop/`.
  It is the **reference solution**: teams can draw inspiration from it, use the components and extend them.

The facilitator decides whether teams start from the base branch (and rebuild) or from the solutions branch (and extend).
See `facilitator-guide.md`.

## 9. How the demo runs (summary; details in `solution-runbook.md`)

1. Start Ghostfolio: `./scripts/start.sh` (or `.ps1`). Seed data if needed: `./scripts/seed-workshop-data.sh`.
2. Verify the MCP: `./scripts/check-demo-mcp.sh` (or `.ps1`) → 7 checks in green.
3. In OpenCode, run `/workshop-analyze-demo-portfolio` → insights with figures from the MCP.
4. Run `/workshop-review-financial-safety` on those insights → PASS.
5. (Optional) `/workshop-plan-frontend-card FE-01` to see a widget plan.

## 10. Security restrictions

- Do not touch `.env`, `prisma/schema.prisma`, `prisma/migrations/`, `docker/`, `nx.json`.
- No real data: demo dataset only. MCP strictly read-only.
- No personalised financial advice (gate `financial-safety-reviewer`).
- Small changes; `git status`/`git diff` around them; no commit/push unless explicitly requested.
- No real LLM in the insights calculations.

## 11. Read-only pieces

- MCP `ghostfolio-demo-data` and all its tools.
- Agents `ghostfolio-architect`, `prisma-data-agent`, `portfolio-domain-agent`, `financial-safety-reviewer`
  (`edit: deny`).
- The demo dataset is treated as read-only except for the official seed.

---

## Flow diagram (product task → components)

```text
FE-01  Widget Portfolio Insights
  -> /workshop-plan-frontend-card FE-01
    -> frontend-angular-agent
      -> skill: angular-nx-development (+ angular-developer)
      -> consume: contrato de FND-02 / MCP get_demo_portfolio_summary
      -> output: plan de implementación (ficheros a crear/editar)
      -> gate: /workshop-review-financial-safety (texto de UI)

BE-01  Endpoint mock de insights
  -> /workshop-plan-backend-card BE-01
    -> backend-nestjs-agent
      -> skill: nestjs-api-development (+ nestjs-best-practices)
      -> output: plan (DTO en libs/common, endpoint endpoints/portfolio-insights/)

MCP-02  Demo portfolio summary
  -> /workshop-plan-mcp-card MCP-02
    -> mcp-builder-agent
      -> skill: mcp-server-authoring
      -> MCP: ghostfolio-demo-data
        -> tool: get_demo_portfolio_summary  (read-only, datos CSV demo)

DATA-01  Reglas de concentración
  -> /workshop-analyze-demo-portfolio
    -> portfolio-domain-agent
      -> skill: ghostfolio-domain-analysis
      -> datos: MCP get_demo_portfolio_summary / get_symbol_exposure
      -> output: reglas con cifras reales (descriptivas)

SAFE-02  Financial safety review
  -> /workshop-review-financial-safety
    -> financial-safety-reviewer
      -> skill: financial-safety-review
      -> output: PASS/FAIL + hallazgos + reescritura segura

INT-01  Happy path (Portfolio Insights Demo)
  -> /workshop-implement-small-product-slice INT-01
      -> skill: product-slice-delivery
      -> usa MCP + /workshop-analyze-demo-portfolio + gate de safety
      -> output: demo reproducible (sin tocar apps/)
  -> /workshop-prepare-team-handoff INT-01
      -> workshop-facilitator-agent -> handoff
```
