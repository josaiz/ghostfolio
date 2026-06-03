# Participant Guide — Innovation Night (Ghostfolio + OpenCode)

Welcome. In this workshop **we develop real improvements to Ghostfolio** using an
**agentic, governed, and repeatable** way of working with OpenCode. Commands, agents, skills, and MCPs are **the means**; the goal is
a product improvement: the **Portfolio Insights Assistant**.

## 1. The most important thing

> We are not "asking AI for code". We are building an agentic development system to implement
> a product improvement. Each backlog card has a real **functional objective** and is resolved by **creating,
> improving, or using** at least one command/agent/skill/MCP.

## 2. What you will build

The shared epic is **Portfolio Insights Assistant**: summarise the demo portfolio, detect concentration by
account/symbol, detect simple anomalies, display insights and do it all **without financial advice**.

## 3. Starting Ghostfolio

Mac/Linux:
```bash
./scripts/start.sh        # arranca con Docker build desde código local (http://localhost:3333)
./scripts/check.sh        # comprobar estado
```
Windows (PowerShell):
```powershell
.\scripts\start.ps1
.\scripts\check.ps1
```
The first build takes a while. If you modify Ghostfolio code: `./scripts/rebuild.sh` (or `.ps1`).

## 4. Loading demo data (if not already loaded)

1. Open `http://localhost:3333`, create the user with *Get Started* (the first one is ADMIN) and save their **security token**.
2. Seed the demo data:
```bash
./scripts/seed-workshop-data.sh           # te pedirá el security token
# Windows: .\scripts\seed-workshop-data.ps1
```
Creates 3 demo accounts (MyInvestor Core ETF, Trade Republic Growth, Crypto Exchange) with ~54 activities.
> Note: the **MCP insights demo works even if Ghostfolio is not running**, because the MCP reads the CSV files.

## 5. Opening OpenCode

Open OpenCode at the root of the repo. It should automatically detect:
- the MCP `ghostfolio-demo-data` (`opencode.json`),
- the `/workshop-*` commands (`.opencode/commands/`),
- the agents (`.opencode/agents/`) and skills (`.opencode/skills/`).

Verify the MCP:
```bash
./scripts/check-demo-mcp.sh    # Windows: .\scripts\check-demo-mcp.ps1
```

## 6. Choosing a card from the whiteboard

1. Look at the backlog in `docs/workshop/whiteboard-backlog.md` (and on the session's Microsoft Whiteboard).
2. Pick a card from your swimlane. Read its **Functional objective**, **Product deliverable**, and **Agentic deliverable**.
3. Almost always start by understanding the terrain: `/workshop-inspect-architecture <your-topic>`.

## 7. How to work a card (the cycle)

```text
investigar  -> /workshop-inspect-architecture
planificar  -> /workshop-plan-frontend-card | -backend-card | -mcp-card | /workshop-analyze-demo-portfolio
implementar -> /workshop-implement-small-product-slice   (solo si la tarjeta lo pide; cambios mínimos)
revisar     -> /workshop-review-financial-safety
entregar    -> /workshop-prepare-team-handoff
```

- Use the **command** that matches your card; it invokes the appropriate **agent**, which loads the correct **skill**
  and, if relevant, queries the **MCP**.
- You can create or improve components: add a tool to the MCP, refine a skill, adjust a command. Document why.

## 8. Reviewing your changes with Git

```bash
git status          # qué ficheros tocaste
git diff            # el contenido exacto de los cambios
```
Do this **before and after**. Do **not** run `git commit` or `git push` unless the facilitator asks for it.

## 9. How to ask for help

- Ask the `workshop-facilitator-agent` ("What command do I use for FE-02?").
- Check `architecture-notes.md` (repo map) and `pedagogical-matrix.md` (what each card teaches).
- If something doesn't start, see `facilitator-guide.md` (fallbacks section) or ask the human facilitator.

## 10. What NOT to touch

- `.env`, `.env.dev`, `.env.example` or any secrets.
- `prisma/schema.prisma`, `prisma/migrations/`, `docker/`, `Dockerfile`, `nx.json`, `tsconfig.base.json`.
- Real data. Only the demo dataset (read-only except for the official seed).
- **Never** generate personalised financial advice. Describe, do not advise. Run your texts through
  `/workshop-review-financial-safety`.

## 11. Definition of "card done"

- [ ] Functional objective met (product deliverable: plan or minimal code).
- [ ] At least one command/agent/skill/MCP was created/improved/used.
- [ ] Safety review in PASS (if there is visible text).
- [ ] `git status`/`git diff` reviewed; no commit/push.
- [ ] Handoff prepared with `/workshop-prepare-team-handoff`.
