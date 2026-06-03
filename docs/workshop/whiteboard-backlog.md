# Product Backlog — Innovation Night (for Microsoft Whiteboard)

Epic: **Portfolio Insights Assistant** — a product enhancement on top of Ghostfolio that summarises the demo portfolio,
detects concentration and simple anomalies, and does so in a **descriptive** way (no financial advice) and
**governed** (with an agentic development system in OpenCode).

> Each card is a **real product task**. The OpenCode component (command/agent/skill/MCP) is the **means**
> to solve it, not the end. Copy this backlog to Microsoft Whiteboard in 7 swimlanes (one column per swimlane).
> The equivalent CSV version is in `whiteboard-cards.csv`.

Swimlanes: **Foundation · Frontend · Backend · Domain & Data · MCP · Safety & Review · Integration**

Status legend in the solutions branch:
- 🟢 **Resolved**: the component already exists and works on this branch (use it / study it).
- 🟡 **Tooling ready**: the command/agent/skill exists; the team produces the product deliverable (plan or code).

---

## Swimlane: Foundation

### FND-01 — Technical map of Ghostfolio for the feature
- **Swimlane**: Foundation
- **Suggested team**: any (ideal to start with)
- **Functional goal**: understand where everything lives so nothing breaks when building insights.
- **Product deliverable**: technical map (files, contracts, endpoints, risks) of the portfolio/insights area.
- **Agentic deliverable**: run `/workshop-inspect-architecture` with the `ghostfolio-architect` agent.
- **OpenCode concept**: Command + Agent (read-only investigation).
- **Dependencies**: none.
- **Acceptance criterion**: document with verified real paths and the recommended planning command.
- **Hints**: start from `docs/workshop/architecture-notes.md`; ask the agent to confirm paths with grep.
- **Difficulty**: Low · **Time**: 20 min · **Status**: 🟢

### FND-02 — Functional contract of the Portfolio Insights Assistant
- **Swimlane**: Foundation
- **Suggested team**: Data/Domain
- **Functional goal**: define what insights the feature offers and in what data shape, so FE/BE/MCP fit together.
- **Product deliverable**: insights data contract (fields, types, examples) to be consumed by frontend and backend.
- **Agentic deliverable**: skill `ghostfolio-domain-analysis` + agent `portfolio-domain-agent`; data via MCP.
- **OpenCode concept**: Skill + Agent (+ MCP as data source).
- **Dependencies**: FND-01.
- **Acceptance criterion**: contract with 3–5 descriptive insights, each traceable to an MCP metric.
- **Hints**: use `get_demo_portfolio_summary`; nothing about "buy/sell".
- **Difficulty**: Medium · **Time**: 30 min · **Status**: 🟡

---

## Swimlane: Frontend Product Tasks

### FE-01 — "Portfolio Insights" widget in the UI
- **Swimlane**: Frontend
- **Suggested team**: Frontend
- **Functional goal**: allow a user to see a panel with the demo portfolio insights.
- **Product deliverable**: plan (or component) for a visible widget showing concentration/anomalies.
- **Agentic deliverable**: `/workshop-plan-frontend-card FE-01` → agent `frontend-angular-agent` + skill `angular-nx-development`.
- **OpenCode concept**: Command + Agent + Skill.
- **Dependencies**: FND-02 (contract). Consumes MCP/BE-01.
- **Acceptance criterion**: plan with the real component path (e.g. `apps/client/src/app/components/portfolio-insights/`),
  an analogous component to follow (`home-overview`), inputs/contract and validation steps (`npm run lint`).
- **Hints**: copy the `home-overview`/`portfolio-summary` pattern; do not add libraries.
- **Difficulty**: Medium · **Time**: 40 min · **Status**: 🟡

### FE-02 — "Demo Portfolio Health" section
- **Swimlane**: Frontend
- **Suggested team**: Frontend
- **Functional goal**: a view that summarises the descriptive "health" of the demo portfolio (diversification, number of anomalies).
- **Product deliverable**: plan (or view) with a simple health/insights visualisation.
- **Agentic deliverable**: `/workshop-plan-frontend-card FE-02` → `frontend-angular-agent` + `angular-nx-development`.
- **OpenCode concept**: Command + Agent + Skill.
- **Dependencies**: FE-01 or FND-02.
- **Acceptance criterion**: plan with where the view is mounted, what metrics it shows and where they come from.
- **Hints**: health = descriptive metrics, not a score that looks like a recommendation.
- **Difficulty**: Medium · **Time**: 35 min · **Status**: 🟡

### FE-03 — "Explain demo portfolio" button
- **Swimlane**: Frontend
- **Suggested team**: Frontend
- **Functional goal**: an interaction that requests and displays the demo portfolio summary.
- **Product deliverable**: plan (or implementation) of a button that consumes the endpoint/MCP and shows the summary.
- **Agentic deliverable**: `/workshop-plan-frontend-card FE-03` + `/workshop-review-financial-safety` for the text.
- **OpenCode concept**: Command + Agent + Safety review.
- **Dependencies**: FE-01, BE-01 or MCP-02.
- **Acceptance criterion**: the displayed text passes the safety review (PASS) and is descriptive.
- **Hints**: the "explain" describes; it does not advise.
- **Difficulty**: Medium · **Time**: 35 min · **Status**: 🟡

---

## Swimlane: Backend Product Tasks

### BE-01 — Mocked portfolio insights endpoint
- **Swimlane**: Backend
- **Suggested team**: Backend
- **Functional goal**: expose a deterministic demo summary for the frontend to consume.
- **Product deliverable**: technical plan for the endpoint (module/controller/service + DTO) that returns demo insights.
- **Agentic deliverable**: `/workshop-plan-backend-card BE-01` → `backend-nestjs-agent` + skill `nestjs-api-development`.
- **OpenCode concept**: Command + Agent + Skill.
- **Dependencies**: FND-02.
- **Acceptance criterion**: plan with contract in `libs/common`, route `/api/v1/...`, analogous module to copy and validation with `npm run test:api`. No real LLM.
- **Hints**: follow the `apps/api/src/app/endpoints/<feature>/` convention.
- **Difficulty**: Medium · **Time**: 40 min · **Status**: 🟡

### BE-02 — Concentration service by account/symbol
- **Swimlane**: Backend
- **Suggested team**: Backend
- **Functional goal**: calculate the exposure/concentration of each account as a reusable product data point.
- **Product deliverable**: backend service (or plan) that calculates cost per symbol and share per account.
- **Agentic deliverable**: `backend-nestjs-agent` + skill `prisma-readonly-data-access` (safe read).
- **OpenCode concept**: Agent + Skill (read-only data).
- **Dependencies**: FND-02; aligned with DATA-01.
- **Acceptance criterion**: documented read-only logic that reproduces the MCP figures (`get_symbol_exposure`).
- **Hints**: compare your calculation with `get_demo_portfolio_summary` to validate.
- **Difficulty**: High · **Time**: 45 min · **Status**: 🟡

---

## Swimlane: Domain & Data Product Tasks

### DATA-01 — Concentration/exposure rules for the demo portfolio
- **Swimlane**: Domain & Data
- **Suggested team**: Data/Domain
- **Functional goal**: define how concentration is measured (thresholds, what is considered "high concentration" in a descriptive way).
- **Product deliverable**: exposure rules document with real figures from the demo dataset.
- **Agentic deliverable**: `/workshop-analyze-demo-portfolio` → `portfolio-domain-agent` + skill `ghostfolio-domain-analysis` + MCP.
- **OpenCode concept**: Command + Agent + Skill + MCP (data tool).
- **Dependencies**: MCP-02.
- **Acceptance criterion**: rules with MCP figures (e.g. "Trade Republic Growth: AAPL 26.2%, top-3 67.7%") and currency/cost caveat.
- **Hints**: all data comes from the MCP; describe, do not recommend.
- **Difficulty**: Medium · **Time**: 35 min · **Status**: 🟡

### DATA-02 — Anomaly rules for imported data
- **Swimlane**: Domain & Data
- **Suggested team**: Data/Domain
- **Functional goal**: define what counts as an anomaly in imported data (duplicate, high commission, currency, price, oversell).
- **Product deliverable**: anomaly catalogue with definition and severity, validated against the anomaly dataset.
- **Agentic deliverable**: MCP `detect_demo_anomalies` + skill `prisma-readonly-data-access` + `/workshop-review-financial-safety`.
- **OpenCode concept**: MCP (tool) + Skill + Safety review.
- **Dependencies**: MCP-03.
- **Acceptance criterion**: catalogue that explains the 5 types and why each is flagged; matches the MCP output.
- **Hints**: the detector does NOT use the CSV labels; explain the heuristic.
- **Difficulty**: Medium · **Time**: 35 min · **Status**: 🟡

---

## Swimlane: MCP Product Tasks

### MCP-01 — Local read-only MCP for demo data
- **Swimlane**: MCP
- **Suggested team**: MCP/Platform
- **Functional goal**: give OpenCode a stable tool to query demo data without loose prompts or destructive access.
- **Product deliverable**: local MCP server registered in `opencode.json` with `list_demo_accounts`.
- **Agentic deliverable**: agent `mcp-builder-agent` + skill `mcp-server-authoring`; config in `opencode.json`.
- **OpenCode concept**: MCP + Agent + Skill + Config.
- **Dependencies**: none.
- **Acceptance criterion**: `./scripts/check-demo-mcp.sh` (or `.ps1`) passes green; OpenCode lists the server tools.
- **Hints**: already implemented in `tools/mcp/ghostfolio-demo-data-mcp/`; study it and extend it.
- **Difficulty**: Medium · **Time**: 40 min · **Status**: 🟢

### MCP-02 — Tool `get_demo_portfolio_summary`
- **Swimlane**: MCP
- **Suggested team**: MCP/Platform
- **Functional goal**: allow any agent to obtain a deterministic summary of the demo portfolio.
- **Product deliverable**: MCP tool that returns totals, holdings and concentration per account.
- **Agentic deliverable**: `/workshop-plan-mcp-card MCP-02` → `mcp-builder-agent` + `mcp-server-authoring`.
- **OpenCode concept**: MCP tool.
- **Dependencies**: MCP-01.
- **Acceptance criterion**: the tool returns 3 accounts, 54 activities and shares per symbol; smoke test passes green.
- **Hints**: reuse `src/data.mjs`; do not duplicate the CSV parser.
- **Difficulty**: Medium · **Time**: 35 min · **Status**: 🟢

### MCP-03 — Tool `detect_demo_anomalies`
- **Swimlane**: MCP
- **Suggested team**: MCP/Platform
- **Functional goal**: deterministically detect simple anomalies in imported data.
- **Product deliverable**: MCP tool that reports duplicates, high commission, unexpected currency, atypical price and oversell.
- **Agentic deliverable**: `mcp-builder-agent` + `mcp-server-authoring` + `/workshop-review-financial-safety` for the texts.
- **OpenCode concept**: MCP tool + Safety review.
- **Dependencies**: MCP-01.
- **Acceptance criterion**: detects the 5 types in the anomaly CSV and ~0 in the clean dataset.
- **Hints**: derive thresholds from the clean dataset; do not read the `ANOMALY=` labels.
- **Difficulty**: High · **Time**: 45 min · **Status**: 🟢

---

## Swimlane: Safety & Review

### SAFE-01 — Assistant limits guide
- **Swimlane**: Safety & Review
- **Suggested team**: Safety
- **Functional goal**: make clear what the feature can and cannot say (informs, does not advise).
- **Product deliverable**: limits guide + safety acceptance checklist.
- **Agentic deliverable**: agent `financial-safety-reviewer` + skill `financial-safety-review`.
- **OpenCode concept**: Agent + Skill.
- **Dependencies**: none.
- **Acceptance criterion**: 7-point checklist and PASS/FAIL examples applicable to FE/MCP/INT.
- **Hints**: there is already a base in the skill `financial-safety-review`; turn it into a guide for your team.
- **Difficulty**: Low · **Time**: 25 min · **Status**: 🟢

### SAFE-02 — Review that a response does not recommend buying/selling
- **Swimlane**: Safety & Review
- **Suggested team**: Safety (reviews other teams' deliverables)
- **Functional goal**: ensure no visible text recommends personalised financial actions.
- **Product deliverable**: PASS/FAIL report with findings and safe rewrite.
- **Agentic deliverable**: `/workshop-review-financial-safety <text|path>` → `financial-safety-reviewer`.
- **OpenCode concept**: Command + Agent + Skill.
- **Dependencies**: something to review (FE-03, DATA-01, INT-01...).
- **Acceptance criterion**: report with verdict and, if FAIL, a rewrite that keeps the information while removing the advice.
- **Hints**: use it as a **gate** before any demo.
- **Difficulty**: Low · **Time**: 20 min · **Status**: 🟢

---

## Swimlane: Integration

### INT-01 — End-to-end demo happy path
- **Swimlane**: Integration
- **Suggested team**: Integration
- **Functional goal**: demonstrate the full cycle: demo data → MCP → analysis → insights → safety review.
- **Product deliverable**: a demonstrable and reproducible path (Portfolio Insights Demo).
- **Agentic deliverable**: `/workshop-implement-small-product-slice INT-01` + `/workshop-demo-runbook` + skill `product-slice-delivery`.
- **OpenCode concept**: Command + Skill (orchestration of multiple components).
- **Dependencies**: MCP-02, MCP-03, SAFE-02.
- **Acceptance criterion**: `/workshop-analyze-demo-portfolio` runs, produces a summary with MCP figures and passes safety; steps are repeatable.
- **Hints**: the reference happy path is read-only via MCP and does not touch `apps/`.
- **Difficulty**: Medium · **Time**: 40 min · **Status**: 🟢

### INT-02 — Team handoff
- **Swimlane**: Integration
- **Suggested team**: Integration/Facilitation
- **Functional goal**: allow a team to continue another team's work without losing context.
- **Product deliverable**: handoff document per card (what was done, what is missing).
- **Agentic deliverable**: `/workshop-prepare-team-handoff <ID>` → `workshop-facilitator-agent` + template `team-handoff-template.md`.
- **OpenCode concept**: Command + Agent + reusable template.
- **Dependencies**: any card in progress.
- **Acceptance criterion**: handoff with components used, files touched (`git status`), tests and next step.
- **Hints**: do not invent; anything not recorded is "pending".
- **Difficulty**: Low · **Time**: 20 min · **Status**: 🟢

---

## Quick summary

| ID | Swimlane | Title | OpenCode Component | Diff. | Min |
|----|----------|--------|---------------------|------|-----|
| FND-01 | Foundation | Technical map | Command+Agent | Low | 20 |
| FND-02 | Foundation | Insights contract | Skill+Agent+MCP | Medium | 30 |
| FE-01 | Frontend | Portfolio Insights widget | Command+Agent+Skill | Medium | 40 |
| FE-02 | Frontend | Demo Portfolio Health section | Command+Agent+Skill | Medium | 35 |
| FE-03 | Frontend | Explain demo portfolio button | Command+Agent+Safety | Medium | 35 |
| BE-01 | Backend | Mock insights endpoint | Command+Agent+Skill | Medium | 40 |
| BE-02 | Backend | Concentration service | Agent+Skill | High | 45 |
| DATA-01 | Domain & Data | Concentration rules | Command+Agent+Skill+MCP | Medium | 35 |
| DATA-02 | Domain & Data | Anomaly rules | MCP+Skill+Safety | Medium | 35 |
| MCP-01 | MCP | Local read-only MCP | MCP+Agent+Skill+Config | Medium | 40 |
| MCP-02 | MCP | Portfolio summary tool | MCP tool | Medium | 35 |
| MCP-03 | MCP | Detect anomalies tool | MCP tool+Safety | High | 45 |
| SAFE-01 | Safety & Review | Limits guide | Agent+Skill | Low | 25 |
| SAFE-02 | Safety & Review | Buy/sell review | Command+Agent+Skill | Low | 20 |
| INT-01 | Integration | Demo happy path | Command+Skill | Medium | 40 |
| INT-02 | Integration | Team handoff | Command+Agent | Low | 20 |
