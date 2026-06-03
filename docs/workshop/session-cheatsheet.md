# Innovation Night — 1-page cheatsheet (facilitator)

**Core ≈ 2 h 25 + wrap-up.** Anchor: *Command = how to work · Agent = who · Skill = what to know · MCP = with what data.*
**Docker** = Ghostfolio. **OpenCode + MCP** = Node on the repo → editing `.opencode/`/MCP **does not** need `rebuild`.

## Pre-flight (10')
```bash
./scripts/start.sh            # Ghostfolio at http://localhost:3333   (Win: .\scripts\start.ps1)
./scripts/seed-workshop-data.sh   # after creating admin + pasting security token
./scripts/check-demo-mcp.sh   # MCP: 7 checks in green
```
OpenCode open at the **root**. Backlog: `docs/workshop/whiteboard-backlog.md`.

## Time-boxed plan

| Min | Block | Show (real path) | Exercise (what each team creates) |
|----:|--------|---------------------|----------------------------------|
| 15 | **Intro + dynamics** | `AGENTS.md` (rules) | Teams by swimlane; remember the cycle |
| 30 | **1 · Commands** | `.opencode/commands/workshop-inspect-architecture.md` | `.opencode/commands/<team>-inspect.md` and run `/<team>-inspect activities` |
| 30 | **2 · Skills** | `.opencode/skills/ghostfolio-domain-analysis/SKILL.md` | `.opencode/skills/<team>-commit-style/SKILL.md` and ask it to load |
| 40 | **3 · Agents** | `.opencode/agents/ghostfolio-architect.md` (`edit: deny`) vs `frontend-angular-agent.md` (`edit: ask`) | `.opencode/agents/test-writer-agent.md` (or `jira-card-writer.md`) and invoke `@their-agent` |
| 30 | **4 · MCPs** | `opencode.json` (block `mcp`) + `tools/mcp/ghostfolio-demo-data-mcp/src/index.mjs` | Add tool `count_activities_by_type` in `data.mjs`+`index.mjs` and `./scripts/check-demo-mcp.sh` |
| rest | **Wrap-up / free** | `docs/workshop/whiteboard-backlog.md` | Pick a card + full cycle + final demo |

## Minimal formats (show on the fly)
- **Command** `.opencode/commands/<n>.md`: `--- description / agent? / subtask? ---` + body (`$ARGUMENTS`, `@file`, `` !`cmd` ``).
- **Skill** `.opencode/skills/<n>/SKILL.md`: `--- name (=folder) / description ---` + instructions.
- **Agent** `.opencode/agents/<n>.md`: `--- description / mode (subagent|primary) / permission: {edit, bash} ---` + system prompt.
- **MCP** in `opencode.json`: `"<n>": { "type": "local", "command": ["node", ".../src/index.mjs"], "enabled": true }`.

## OpenCode commands for the final demo
```text
/workshop-inspect-architecture <topic>
/workshop-analyze-demo-portfolio          → summary with figures from the MCP (Trade Republic AAPL 26.2%…; 5 anomalies)
/workshop-review-financial-safety <text>  → PASS (describes, does not advise)
/workshop-prepare-team-handoff <ID>
```

## Rules (repeat) and fallbacks
- Do not touch `.env` / `prisma/schema.prisma` / `docker/`. Demo data **read-only**. **No** personalised financial advice.
- OpenCode does not see something → repo root, folders in **plural**, restart after touching `opencode.json`.
- Ghostfolio does not start → the MCP demo **does not need it** (reads CSV). Team stuck → branch `workshop/solutions` + `@workshop-facilitator-agent`.
