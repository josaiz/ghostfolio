# Facilitator Guide — Innovation Night (Ghostfolio + OpenCode)

How to prepare and run the session so that teams do **real product development** and don't get stuck on
"meta" tasks (creating OpenCode components just for the sake of it).

## 1. Prepare the session (before)

1. Verify the repo starts: `./scripts/start.sh` → `http://localhost:3333` and `./scripts/check.sh` OK.
2. Create the admin user from the UI and save the security token. Seed data: `./scripts/seed-workshop-data.sh`.
3. Verify the MCP: `./scripts/check-demo-mcp.sh` → 7 checks in green.
4. Check that OpenCode detects `opencode.json`, `.opencode/commands`, `.opencode/agents`, `.opencode/skills`.
5. Copy the backlog to Microsoft Whiteboard: import `docs/workshop/whiteboard-cards.csv` or create 7 swimlanes manually
   from `docs/workshop/whiteboard-backlog.md`.
6. Decide the starting branch for teams (see point 3).

## 2. Divide teams

Suggestion: 6 small teams aligned with the swimlanes.
- **Frontend** (FE-01/02/03), **Backend** (BE-01/02), **Data/Domain** (FND-02, DATA-01/02),
  **MCP/Platform** (MCP-01/02/03), **Safety** (SAFE-01/02, also reviews the others),
  **Integration/Facilitation** (INT-01/02).
- Everyone starts with **FND-01** (map) to gain context. The Safety team can start SAFE-01 in parallel.

## 3. Base branch vs solutions branch

- **Base branch**: Ghostfolio + demo data + scripts, **without** `.opencode/` or MCP. Teams **build** the
  components from scratch (more challenge, more learning). Use this if the group is advanced.
- **Solutions branch (`workshop/solutions`)**: already includes all components and the MCP. Teams **use and
  extend** (faster, product-focused). Use this if time is short.
- Recommended mixed option: teams start from the base, and the solutions branch is available as a **reference**
  to fall back on if they get stuck.

## 4. Suggested timing (~3 h session)

| Block | Time | What |
|--------|--------|-----|
| Intro + epic + rules | 20 min | Present the epic and `pedagogical-matrix.md`. Emphasise: product, not "meta". |
| Setup + FND-01 | 25 min | Start up, verify MCP, architecture map per team. |
| Sprint 1 (plan) | 45 min | Each team uses their planning command; delivers a plan. |
| Checkpoint 1 | 15 min | Each team shows their plan in 2 min. Safety reviews texts. |
| Sprint 2 (build/use) | 45 min | Implement minimum slice or extend a component (MCP/skill). |
| Checkpoint 2 | 15 min | Partial demo. `git diff` per team. |
| Integration + demo | 20 min | INT-01 happy path live. Safety gate. |
| Handoffs + closing | 15 min | INT-02 handoffs; retro. |

## 5. Checkpoints (what to ask)

- **CP1**: "Show me the plan and the command that generated it." There must be a clear functional objective.
- **CP2**: "Run your change or your tool. What do you see? Does it pass safety?" Ask for `git status`/`git diff`.
- **Final**: the happy path (`/workshop-analyze-demo-portfolio` + safety) runs from start to finish.

## 6. How to prevent teams from getting stuck on "meta" tasks

- Always ask: **"What does the Ghostfolio product gain from this?"** If the answer is "I have a new agent",
  redirect: "What product card does it solve and what does the result look like?".
- Remember the rule: every card has a functional objective **and** an agentic deliverable. A component without a
  product objective is incomplete.
- Use the skill `workshop-task-design` to rewrite a poorly defined card on the spot.

## 7. Questions to guide teams

- "What existing component is similar to what you want? Have you read it?" (avoid reinventing).
- "Where do your numbers come from? From the MCP?" (avoid invented data).
- "Does your text recommend something? Run it through `/workshop-review-financial-safety`."
- "What is the smallest change that demonstrates the value?"

## 8. Fallbacks if something fails

- **Ghostfolio won't start**: the MCP insights demo **doesn't need it** (reads CSV). Continue with OpenCode + MCP.
- **MCP doesn't appear in OpenCode**: run `./scripts/check-demo-mcp.sh`. Check `opencode.json` and that `node` exists.
  Restart OpenCode after config changes.
- **OpenCode doesn't see commands/agents/skills**: confirm you are in the repo root and that `.opencode/commands`,
  `.opencode/agents`, `.opencode/skills` (plural) exist. Restart OpenCode.
- **Demo data missing**: `./scripts/seed-workshop-data.sh`. For MCP insights the CSVs in
  `data/workshop/import/` are sufficient.
- **A team is blocked**: have them use the solutions branch as a reference or the `workshop-facilitator-agent`.
- **Something broke in the repo**: `git status`/`git diff`; revert with `git checkout -- <file>`. No `git push`.

## 9. Criteria for "closing" the session

- At least one happy path demonstrated live (INT-01) that passes safety.
- Each team with a product deliverable (plan or slice) and a handoff (INT-02).
- Closing message: the OpenCode components were used to develop real product, in a governed and repeatable way.
