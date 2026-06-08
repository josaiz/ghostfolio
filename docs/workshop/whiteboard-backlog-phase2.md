# Backlog Phase 2 — Real implementation (plan + impl)

> **Additive complement** to the Phase 1 backlog (`whiteboard-backlog.md`), which is NOT modified. Here are the cards
> where people **actually implement** a feature: the **Portfolio Insights Assistant** (endpoint + widget).
> The work is split into pairs **plan → implementation** (2 backend, 2 frontend) so that each team finishes with something
> working. Shared technical contract: `docs/workshop/portfolio-insights-feature.md`.

Swimlanes used: **Backend Product Tasks**, **Frontend Product Tasks** (same as Phase 1).

---

## Backend Product Tasks

### P2-BE-01 — Plan: endpoint Portfolio Insights
- **Swimlane**: Backend Product Tasks
- **Suggested team**: Backend
- **Functional goal**: define how Ghostfolio will expose a deterministic insights summary for the frontend to consume.
- **Product deliverable**: technical plan for the `GET /api/v1/portfolio-insights` endpoint (module/controller/service + contract).
- **Agentic deliverable**: `/workshop-plan-backend-card P2-BE-01` → agent `backend-nestjs-agent` + skill `nestjs-api-development`.
- **OpenCode concept covered**: Command + Agent + Skill (planning).
- **Dependencies**: contract `portfolio-insights-feature.md`.
- **Acceptance criteria**: plan with the `PortfolioInsights` interface in `libs/common`, the route, the pattern to copy
  (`endpoints/benchmarks/`), the files to create and validation (`npx nx run api:build`).
- **Hints**: **public** endpoint; **constant** payload (CSVs do not enter Docker); copy the `@Controller` decorator.
- **Difficulty**: Medium · **Time**: 30 min

### P2-BE-02 — Implementation: endpoint Portfolio Insights
- **Swimlane**: Backend Product Tasks
- **Suggested team**: Backend
- **Functional goal**: make `GET /api/v1/portfolio-insights` return the deterministic summary, ready for the widget.
- **Product deliverable**: working endpoint (real code) according to the contract.
- **Agentic deliverable**: `/workshop-implement-backend-slice P2-BE-02` → agent `backend-nestjs-agent` + skills
  `nestjs-api-development` + `product-slice-delivery`.
- **OpenCode concept covered**: Command + Agent + Skill (implementation).
- **Dependencies**: **P2-BE-01** (plan) and the contract.
- **Acceptance criteria**: `npx nx run api:build --configuration=development` green;
  `curl -s http://localhost:3333/api/v1/portfolio-insights` returns the JSON with 3 accounts + 5 anomalies (section 3 of the contract).
- **Hints**: create `apps/api/src/app/endpoints/portfolio-insights/{module,controller,service}.ts`,
  interface in `libs/common/.../interfaces/` (+ export in the barrel `index.ts`), and register the module in `app.module.ts`.
  **Pure** service with constant payload. Do not read files at runtime.
- **Difficulty**: Medium · **Time**: 45 min

---

## Frontend Product Tasks

### P2-FE-01 — Plan: widget Portfolio Insights
- **Swimlane**: Frontend Product Tasks
- **Suggested team**: Frontend
- **Functional goal**: define how the demo portfolio insights summary will be displayed in the UI.
- **Product deliverable**: plan for the `gf-portfolio-insights` component and its mount point (inline in Home/Analytics).
- **Agentic deliverable**: `/workshop-plan-frontend-card P2-FE-01` → agent `frontend-angular-agent` + skill `angular-nx-development`.
- **OpenCode concept covered**: Command + Agent + Skill (planning).
- **Dependencies**: contract `portfolio-insights-feature.md`.
- **Acceptance criteria**: plan with the standalone component (`home-overview` pattern), how it consumes the endpoint
  (`DataService.fetchPortfolioInsights`), inline mounting and validation (`npx nx run client:build:development-en`).
- **Hints**: **plain text** (no `$localize`) to avoid breaking `build:production`/Docker; no new libraries.
- **Difficulty**: Medium · **Time**: 30 min

### P2-FE-02 — Implementation: widget Portfolio Insights
- **Swimlane**: Frontend Product Tasks
- **Suggested team**: Frontend
- **Functional goal**: let the user see a panel in Home/Analytics with account concentration and anomalies.
- **Product deliverable**: visible widget consuming `GET /api/v1/portfolio-insights`.
- **Agentic deliverable**: `/workshop-implement-frontend-slice P2-FE-02` → agent `frontend-angular-agent` + skills
  `angular-nx-development` + `product-slice-delivery`; text reviewed with `/workshop-review-financial-safety`.
- **OpenCode concept covered**: Command + Agent + Skill (+ Safety).
- **Dependencies**: **P2-FE-01** (plan) and **P2-BE-02** (live endpoint + interface).
- **Acceptance criteria**: `npx nx run client:build:development-en` green; after `./scripts/rebuild.sh`, the
  "Portfolio Insights" widget appears in Home/Analytics with the endpoint figures; the text passes the safety review (PASS).
- **Hints**: create `apps/client/src/app/components/portfolio-insights/{component.ts,html,scss}`, add
  `fetchPortfolioInsights` to `libs/ui/.../data.service.ts`, and mount inline in `home-overview` (`.component.ts` + `.html`).
- **Difficulty**: Medium · **Time**: 45 min

---

## Suggested flow and dependencies

```text
P2-BE-01 (plan)  ──►  P2-BE-02 (impl endpoint)  ──►  P2-FE-02 (impl widget, consume the endpoint)
P2-FE-01 (plan)  ──────────────────────────────────►  P2-FE-02
```
Recommended: one backend team does P2-BE-01 → P2-BE-02; one frontend team does P2-FE-01 in parallel and then P2-FE-02
when the endpoint is live. To see it in the UI you need `./scripts/rebuild.sh` (rebuilds the Docker image).

## Summary

| ID | Swimlane | Title | Command | Dep | Diff | Min |
|----|----------|--------|---------|-----|-----|-----|
| P2-BE-01 | Backend | Plan: endpoint Portfolio Insights | `/workshop-plan-backend-card P2-BE-01` | contract | Medium | 30 |
| P2-BE-02 | Backend | Impl: endpoint Portfolio Insights | `/workshop-implement-backend-slice P2-BE-02` | P2-BE-01 | Medium | 45 |
| P2-FE-01 | Frontend | Plan: widget Portfolio Insights | `/workshop-plan-frontend-card P2-FE-01` | contract | Medium | 30 |
| P2-FE-02 | Frontend | Impl: widget Portfolio Insights | `/workshop-implement-frontend-slice P2-FE-02` | P2-FE-01, P2-BE-02 | Medium | 45 |
