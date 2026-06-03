---
description: Implements the Portfolio Insights frontend slice (widget in Home/Analytics) according to the technical contract. E.g. /workshop-implement-frontend-slice P2-FE-02
agent: frontend-angular-agent
---

Implement the frontend task: **$ARGUMENTS**

Technical contract (source of truth — follow it to the letter):
@docs/workshop/portfolio-insights-feature.md

Card and criteria:
@docs/workshop/whiteboard-backlog-phase2.md

Repo status:
!`git status --short`

Work as follows:
1. Load the skills `angular-nx-development` and `product-slice-delivery`. Short plan before touching anything.
2. Implement with the **minimum** number of files, copying the pattern from `apps/client/src/app/components/home-overview/`:
   - NEW component `apps/client/src/app/components/portfolio-insights/` (standalone `.component.ts` + `.html` + `.scss`).
     Use **plain text** (no `$localize`) to avoid breaking `build:production`/Docker.
   - Add `fetchPortfolioInsights()` to `libs/ui/src/lib/services/data.service.ts` (and `PortfolioInsightsResponse` to the import).
   - **Inline mounting**: import `GfPortfolioInsightsComponent` in `home-overview.component.ts` (`imports` array) and add
     `<gf-portfolio-insights />` in `home-overview.html`, inside the `@else` block, after the `overview-container` row.
3. Depends on the endpoint existing (P2-BE-02). Validate: `npx nx run client:build:development-en` and `npm run lint`.
   Format with `npm run format`. To see it live: `./scripts/rebuild.sh` → Home/Analytics.
4. Run the widget texts through `/workshop-review-financial-safety` (they must describe, not advise).
5. Show `git diff` and explain the changes.

Rules: no real LLM; no personalised financial advice; do not touch `.env`, `prisma/`, `docker/`, `nx.json`;
do not modify Phase 1 files. **Do not** run `git commit` or `git push`.
