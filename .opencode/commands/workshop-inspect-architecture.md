---
description: Investigates the real Ghostfolio architecture for a card or topic and produces an actionable technical map (FND-01).
agent: ghostfolio-architect
subtask: true
---

Investigate the Ghostfolio architecture relevant to: **$ARGUMENTS**

Reference backlog (look up the card if you are given an ID like `FE-01`):
@docs/workshop/whiteboard-backlog.md

Work as follows:
1. Load the `ghostfolio-domain-analysis` skill if the topic touches portfolio/accounts/activities/insights.
2. Confirm real paths with `grep`/`glob`/`read`. Do not invent files: if you haven't seen it, search for it.
3. Deliver a **technical map** with this structure:
   - **Functional objective** (in one sentence)
   - **Real files involved** (verified paths)
   - **Data contracts** (interfaces/DTO/endpoints)
   - **Analogous pattern to follow** (existing module/component to copy)
   - **Risks and areas not to touch**
   - **Recommended next command** (`/workshop-plan-frontend-card`, `-backend-card` or `-mcp-card`)

Expected output: a map in markdown. If given a card ID, save it in
`docs/workshop/generated/<ID>-architecture-map.md`. Do not edit functional code. Read-only.
