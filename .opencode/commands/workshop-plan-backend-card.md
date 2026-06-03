---
description: Produces a backend (NestJS) implementation plan for a BE backlog card. E.g. /workshop-plan-backend-card BE-01
agent: backend-nestjs-agent
subtask: true
---

Plan the backend implementation for the card: **$ARGUMENTS**

Backlog (locate card $1):
@docs/workshop/whiteboard-backlog.md

Work as follows:
1. Load the `nestjs-api-development` skill (and `nestjs-best-practices` for general patterns).
2. Identify a real analogous module in `apps/api/src/app/` (ideally `endpoints/<feature>/`) and follow it.
3. Deliver a **plan**, not code (unless asked to implement):
   - **Data contract** first: interface/DTO in `libs/common/src/lib/...`.
   - Proposed endpoint (method, route `/api/v1/...`), module + controller + service and its registration in `app.module.ts`.
   - **Deterministic** data source (demo CSV or existing services). **No real LLM.**
   - Required permissions/guards and how authentication works.
   - Validation: `npm run test:api`, `npm run lint`.
4. List files to create/edit (minimum possible) and risks.

Save the plan in `docs/workshop/generated/$1-backend-plan.md`.
Remember: do not touch `prisma/schema.prisma`. `git status` before, `git diff` after if you implement. No commit/push.
