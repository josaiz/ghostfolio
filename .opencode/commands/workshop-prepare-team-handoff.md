---
description: Prepares the handoff document for a team by filling in the template with what was done on a card (INT-02).
agent: workshop-facilitator-agent
---

Prepare the handoff document for: **$ARGUMENTS**

Base template:
@docs/workshop/team-handoff-template.md

Repo status:
!`git status --short`

Work as follows:
1. Identify the backlog card ($1) and its functional objective.
2. Fill in the template with:
   - Chosen card and functional objective.
   - OpenCode components created/used (commands, agents, skills, MCP/tools).
   - Decisions made and why.
   - Commands executed (include the `/workshop-*` commands used).
   - Modified files (from `git status`/`git diff`).
   - Tests performed and result.
   - Safety review (result of `/workshop-review-financial-safety`).
   - Open questions and next step for the receiving team.
3. Do not invent: if a piece of information is not available, write "pending".

Save the result to `docs/workshop/generated/$1-handoff.md`. Do not commit/push.
