---
description: Implements a minimal end-to-end happy path for an integration card (e.g. INT-01), with the smallest possible change and a safety review.
---

Implement a **minimal** and demonstrable product slice for: **$ARGUMENTS**

Current repo state:
!`git status --short`

Backlog (locate card $1):
@docs/workshop/whiteboard-backlog.md

Implementation rules (strict):
1. Load the `product-slice-delivery` skill.
2. **Start with a short plan** (which files, why) and ask for confirmation if the change touches functional Ghostfolio code.
3. Change the **minimum** number of files. Respect existing patterns. No real LLM. No personalised financial advice.
4. The workshop's default happy path is **read-only via MCP** (`ghostfolio-demo-data`) + the
   `/workshop-analyze-demo-portfolio` command, without touching `apps/`. Only touch `apps/api` or `apps/client` if the card asks for it
   and after human confirmation, delegating to `frontend-angular-agent` / `backend-nestjs-agent`.
5. **Forbidden**: touching `.env`, `prisma/schema.prisma`, `prisma/migrations/`, `docker/`, `nx.json`.

When finished:
- Show the `git diff` for what changed and explain it.
- Explain how to test the happy path (exact commands).
- Run any visible text through `/workshop-review-financial-safety`.
- Document the change in `docs/workshop/generated/$1-slice.md`.
- **Do not** run `git commit` or `git push`.
