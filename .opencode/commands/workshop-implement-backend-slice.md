---
description: Implements the Portfolio Insights backend slice (deterministic endpoint) according to the technical contract. E.g. /workshop-implement-backend-slice P2-BE-02
agent: backend-nestjs-agent
---

Implement the backend task: **$ARGUMENTS**

Technical contract (source of truth — follow it to the letter):
@docs/workshop/portfolio-insights-feature.md

Card and criteria:
@docs/workshop/whiteboard-backlog-phase2.md

Repo status:
!`git status --short`

Work as follows:
1. Load the skills `nestjs-api-development` and `product-slice-delivery`. Short plan before touching anything.
2. Implement with the **minimum** number of files, copying the pattern from `apps/api/src/app/endpoints/benchmarks/`:
   - NEW interfaces: `libs/common/src/lib/interfaces/portfolio-insights.interface.ts` and
     `libs/common/src/lib/interfaces/responses/portfolio-insights-response.interface.ts`; export them in the barrel
     `libs/common/src/lib/interfaces/index.ts`.
   - NEW endpoint in `apps/api/src/app/endpoints/portfolio-insights/` (module + public `@Get()` controller + service).
   - The service returns the **constant payload** from section 3 of the contract (do not read CSV/DB at runtime).
   - Register the module in `apps/api/src/app/app.module.ts`.
3. Validate: `npx nx run api:build --configuration=development` and `npm run lint` (or `affected:lint`). Format with `npm run format`.
4. Show `git diff` and explain the changes. To see it live: `./scripts/rebuild.sh` and
   `curl -s http://localhost:3333/api/v1/portfolio-insights`.

Rules: no real LLM; no financial advice; do not touch `.env`, `prisma/`, `docker/`, `nx.json`; do not modify
Phase 1 files. **Do not** run `git commit` or `git push`.
