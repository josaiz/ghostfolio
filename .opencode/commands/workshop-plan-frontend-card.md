---
description: Produces a frontend implementation plan (Angular/Nx) for a FE card from the backlog. E.g. /workshop-plan-frontend-card FE-01
agent: frontend-angular-agent
subtask: true
---

Plan the frontend implementation for the card: **$ARGUMENTS**

Backlog (locate card $1):
@docs/workshop/whiteboard-backlog.md

Work as follows:
1. Load the `angular-nx-development` skill (and `angular-developer` for Angular mechanics).
2. Identify a real analogous component in `apps/client/src/app/components/` or `libs/ui/` and follow it.
3. Deliver a **plan**, not code (unless explicitly asked to implement):
   - Component/view to create and **exact path** (e.g. `apps/client/src/app/components/portfolio-insights/`).
   - Inputs/outputs and **data contract** it consumes (deterministic mock or endpoint).
   - Where it is mounted (page/host) and how to navigate to it.
   - Validation steps: `npm run lint`, client build, visual review.
   - Proposed UI texts (which will later go through `/workshop-review-financial-safety`).
4. Indicate which files would be created/edited and why (minimum possible).

Save the plan in `docs/workshop/generated/$1-frontend-plan.md`.
Remember: `git status` before, `git diff` after if you implement. No commit/push.
