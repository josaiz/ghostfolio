# Session Script — Innovation Night (OpenCode + Ghostfolio)

> **Sticky Fingers** format: hands-on and collaborative, 2–2.5 h, teams working on a backlog. **Not** theory
> or slides. This script is for you (facilitator): "what you say" out loud, "what you show" (real repo paths)
> and the "exercise" that teams replicate locally.

**Goal**: teams learn to **structure in code** the 4 elements of OpenCode — **Commands, Skills,
Agents and MCPs** — developing a real improvement on Ghostfolio (*Portfolio Insights Assistant*).

**Timing**: Intro 15' · Block 1 Commands 30' · Block 2 Skills 30' · Block 3 Agents 40' · Block 4 MCPs 30' ·
Close/Free Work (remainder). Total core ≈ 2 h 25.

**Golden rule you repeat in every block**: *the OpenCode component is the means; the end is the product improvement.*

---

## Pre-session (facilitator checklist, 10 min before)

- Every team with the repo on the **`workshop/solutions`** branch (brings all components as a template to copy).
  *Alternative for advanced groups*: `workshop/agentic-base` (clean) and they build from scratch.
- Docker Desktop running. Node ≥ 22 (`node -v`). OpenCode installed and opened at the **root** of the repo.
- Start Ghostfolio: `./scripts/start.sh` (Win: `.\scripts\start.ps1`) → `http://localhost:3333`. Create admin + `./scripts/seed-workshop-data.sh`.
- Verify the MCP: `./scripts/check-demo-mcp.sh` (Win `.ps1`) → **7 checks green**.
- Backlog projected (Whiteboard) and `docs/workshop/whiteboard-backlog.md` open.

> **Key clarification about Docker** (say this at the start): *Ghostfolio* runs in Docker; *OpenCode and the MCP* run on your
> machine (Node) reading the repo. **Editing `.opencode/` or the MCP does NOT require rebuilding Docker.** Only if you touch Ghostfolio
> code in `apps/` do you run `./scripts/rebuild.sh`.

---

## Introduction and Group Dynamics (15 min)

**What you say (5'):**
- "Today I'm not teaching you OpenCode with slides: we're going to use it to actually improve Ghostfolio."
- "OpenCode has 4 pieces. Phrase to remember them: **Command = how to work · Agent = who works · Skill = what to
  know · MCP = what data/capabilities.**"
- "You'll work in teams on a backlog. Each card is a product task that gets solved by creating or using
  one of these pieces."

**Ground rules (3') — show them in `AGENTS.md`:**
- Do not touch `.env`, `prisma/schema.prisma`, `docker/`, `nx.json`. Demo data is **read-only**.
- No **personalized financial advice** (describe, don't advise).
- Small changes; `git status` / `git diff` before and after. Work on your branch.

**Dynamics and teams (7'):**
- Form 4–6 teams by swimlane (Frontend, Backend, Data/Domain, MCP, Safety, Integration).
- Everyone does the same "warm-up" in each block (guided exercise) and then picks a card from the Whiteboard.
- Show the cycle in one phrase: **investigate → plan → implement → review → handoff** (each phase has its command).

---

## Block 1 — Familiarization with OpenCode and Commands (30 min)

**Concept, out loud (5'):**
- "A **command** is a repeatable workflow: a versioned *prompt template* in the repo that you invoke with `/name`.
  Instead of rewriting the prompt each time, you save it, share it and parameterize it."

**What you show (8') — real paths:**
- Folder: `.opencode/commands/`. Open two examples:
  - `.opencode/commands/workshop-inspect-architecture.md`
  - `.opencode/commands/workshop-analyze-demo-portfolio.md`
- Point out the **format** (minimum): frontmatter + body = template.

```markdown
---
description: Qué hace este command (se ve en el menú de OpenCode)
agent: nombre-del-agente        # opcional: enruta a un especialista
subtask: true                   # opcional: ejecútalo como subagente
---
Cuerpo = el prompt. Usa $ARGUMENTS (todo) o $1 (posicional),
@docs/ruta/fichero.md  (inyecta el fichero) y  !`git status`  (inyecta salida de shell).
```
- In OpenCode, type `/workshop-` and show that the 9 commands appear in autocomplete. Launch
  `/workshop-inspect-architecture portfolio insights` to see it in action.

**Exercise — script step (15'):**
1. Create `.opencode/commands/<team>-inspect.md` (e.g. `team1-inspect.md`):
```markdown
---
description: Investiga un tema del repo y devuelve un mini-mapa de ficheros.
agent: ghostfolio-architect
subtask: true
---
Investiga y resume el tema: $ARGUMENTS.
Lista los ficheros reales implicados (rutas verificadas) y el patrón a seguir. No edites nada.
```
2. In OpenCode, run `/<team>-inspect activities` and check the output.
3. (Bonus) Add `@docs/workshop/architecture-notes.md` to the body so the command reads that context.

**Checkpoint (2'):** one team shows their command appearing in `/` and executing. *No Docker rebuild needed.*

---

## Block 2 — Skills (30 min)

**Concept, out loud (5'):**
- "A **skill** is reusable knowledge that the agent **loads on demand**. If the command is *how to work*,
  the skill is *what to know*: project patterns, checklists, limits."
- "OpenCode discovers them automatically in `.opencode/skills/`, `.claude/skills/` and `.agents/skills/`."

**What you show (8') — real paths:**
- Ours (specific): `.opencode/skills/ghostfolio-domain-analysis/SKILL.md`,
  `.opencode/skills/mcp-server-authoring/SKILL.md`.
- The generic ones already in the repo: `.agents/skills/angular-developer/SKILL.md`,
  `.agents/skills/nestjs-best-practices/SKILL.md`.
- **Format** (minimum). Important: the file is `SKILL.md` (uppercase) and `name` = folder name.

```markdown
---
name: nombre-igual-que-la-carpeta      # minúsculas-con-guiones
description: Qué sabe y cuándo usarla (esto decide cuándo se carga)
---
# Instrucciones concretas
- Cuándo usarla / cuándo NO usarla
- Checklist de calidad
- Límites de seguridad
```

**Exercise — script step (15'):**
1. Create the folder and file `.opencode/skills/<team>-commit-style/SKILL.md`:
```markdown
---
name: <equipo>-commit-style
description: Estilo de mensajes de commit del equipo. Úsala al redactar un commit.
---
# Estilo de commit del equipo
- Título en imperativo, < 72 caracteres.
- Cuerpo: qué y por qué, no el cómo.
- Referencia la tarjeta (p. ej. FE-01) cuando aplique.
```
2. In OpenCode ask the assistant: *"draft a commit following the skill `<team>-commit-style`"* and watch it load.
3. (Bonus) Open `ghostfolio-domain-analysis/SKILL.md` and copy its structure (when to use / checklist / limits) into yours.

**Checkpoint (2'):** one team shows the agent **loading** their skill when asked.

---

## Block 3 — Creating Custom Agents (40 min)

**Concept, out loud (7'):**
- "An **agent** is a specialist: a *system prompt* + its own **permissions**. You invoke it with `@name` or from a command."
- "The **global rules** of the repo for all agents are in `AGENTS.md` (root). It's the 'clean rules repo'
  we start from."
- "Two key things in the frontmatter: `mode` (`primary` or `subagent`) and `permission` (what it can touch). A
  *research* agent goes with `edit: deny`; an *implementation* one with `edit: ask`."

**What you show (8') — real paths:**
- `AGENTS.md` (project rules) and the `.opencode/agents/` folder.
- Compare two: `.opencode/agents/ghostfolio-architect.md` (read-only, `edit: deny`) vs
  `.opencode/agents/frontend-angular-agent.md` (`edit: ask`).
- **Format** (minimum):

```markdown
---
description: Qué hace y cuándo invocarlo (una frase)
mode: subagent              # subagent = especialista; primary = asistente principal
temperature: 0.2
permission:
  edit: deny                # deny | ask | allow   (deny para agentes de solo análisis)
  bash: ask
---
Eres un especialista en X. Qué haces, cuándo usarte, cuándo NO, y tus límites de seguridad.
```

**Exercise — script step (20'):** each team creates **their own agent**. Choose one:

*Option A — testing* `.opencode/agents/test-writer-agent.md`:
```markdown
---
description: Escribe tests Jest pequeños para servicios/utilidades existentes de Ghostfolio. No cambia lógica de producción.
mode: subagent
temperature: 0.2
permission:
  edit: ask
  bash: ask
---
Eres un especialista en tests. Busca el `*.spec.ts` vecino y sigue su patrón.
Cubre solo lo pedido, sin tocar la lógica de producción. Valida con `npm run test:api`.
No toques `.env` ni el schema. Pide revisión antes de cambios grandes.
```

*Option B — Jira* `.opencode/agents/jira-card-writer.md` (read-only, drafts tickets):
```markdown
---
description: Redacta tickets de Jira (título, descripción, criterios de aceptación) a partir de una tarjeta o un handoff. Solo redacta, no ejecuta.
mode: subagent
temperature: 0.3
permission:
  edit: deny
  bash: deny
---
Eres un redactor de tickets. Dado un objetivo, produce: título, contexto, criterios de aceptación y tareas.
Tono claro y accionable. No inventes datos; si falta algo, escribe "pendiente".
```
Steps: (1) create the file; (2) in OpenCode invoke it with `@test-writer-agent` (or `@jira-card-writer`) and give it a
small real task from the repo; (3) observe that it respects its permissions.

**Checkpoint (5'):** two teams do `@their-agent` live with a minimal request. *No Docker rebuild.*

---

## Block 4 — MCP Integration (30 min)

**Concept, out loud (6'):**
- "An **MCP** (Model Context Protocol) is an *external server* that exposes **tools** to OpenCode via a standard protocol.
  It's used to give agents **governed and reusable data or capabilities** — not loose prompts."
- "Ours, `ghostfolio-demo-data`, reads the demo CSVs in **read-only**, is **zero-dependency** and starts on its own."

**What you show (8') — real paths:**
- Registration in `opencode.json` (root):
```json
{
  "mcp": {
    "ghostfolio-demo-data": {
      "type": "local",
      "command": ["node", "tools/mcp/ghostfolio-demo-data-mcp/src/index.mjs"],
      "enabled": true
    }
  }
}
```
- The server and the data layer: `tools/mcp/ghostfolio-demo-data-mcp/src/index.mjs` (array `TOOLS`) and `src/data.mjs`.
- Verify live: `./scripts/check-demo-mcp.sh` → 7 green. Call a tool from OpenCode (`get_demo_portfolio_summary`).
- Pattern of a tool (in `src/index.mjs`): `{ name, description, inputSchema, handler }`.

**Exercise — script step (12'):** each team adds **one new read-only tool** following the pattern.
1. In `tools/mcp/ghostfolio-demo-data-mcp/src/data.mjs` add a pure function:
```js
export function countActivitiesByType() {
  const counts = {};
  for (const a of loadActivities()) counts[a.type] = (counts[a.type] || 0) + 1;
  return { disclaimer: DISCLAIMER, counts };
}
```
2. In `src/index.mjs` import it and add an entry to the `TOOLS` array:
```js
{
  name: 'count_activities_by_type',
  description: 'Cuenta actividades demo por tipo (BUY/SELL/DIVIDEND/...). Read-only.',
  inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  handler: () => countActivitiesByType()
}
```
3. Verify: `./scripts/check-demo-mcp.sh` (Win `.ps1`). Restart OpenCode and call `count_activities_by_type`.

**Checkpoint (4'):** smoke test green + one team calls their new tool. *The MCP runs in Node, not in Docker.*

---

## Close and Free Team Work (rest of the time)

**Free work:** each team picks a card from the Whiteboard (`docs/workshop/whiteboard-backlog.md`) and applies the
full cycle with what they learned:
```text
/workshop-inspect-architecture <tema>     → entender
/workshop-plan-frontend|backend|mcp-card <ID>  → planificar
(implementar slice mínimo si la tarjeta lo pide)
/workshop-analyze-demo-portfolio          → datos del MCP
/workshop-review-financial-safety <texto> → gate de safety
/workshop-prepare-team-handoff <ID>       → handoff
```

**Final demo (happy path, 5'):** launch `/workshop-analyze-demo-portfolio` (shows the summary with MCP figures: e.g.
Trade Republic AAPL 26.2% / MSFT 21.8% / NVDA 19.7%; 5 anomalies) and run it through `/workshop-review-financial-safety` → PASS.

**Close (final message):** "We've created commands, skills, agents and an MCP tool — but the goal was to **improve
Ghostfolio in a governed and repeatable way**. That is working agentic."

---

## Path cheat sheet (for you, during the session)

| Piece | Where | Format |
|------|-------|---------|
| Command | `.opencode/commands/<name>.md` | frontmatter (`description`, `agent?`) + template body (`$ARGUMENTS`, `@file`, `` !`cmd` ``) |
| Skill | `.opencode/skills/<name>/SKILL.md` | frontmatter (`name`=folder, `description`) + instructions |
| Agent | `.opencode/agents/<name>.md` | frontmatter (`description`, `mode`, `permission`) + system prompt |
| Rules | `AGENTS.md` (root) | markdown project rules |
| MCP (registration) | `opencode.json` → `mcp` | `type: local`, `command`, `enabled` |
| MCP (code) | `tools/mcp/ghostfolio-demo-data-mcp/src/` | `index.mjs` (TOOLS) + `data.mjs` (read-only data) |
| Verify MCP | `./scripts/check-demo-mcp.sh` / `.ps1` | smoke test (7 checks) |
| Backlog | `docs/workshop/whiteboard-backlog.md` | cards by swimlane |

## Quick fallbacks

- **OpenCode doesn't see the components** → confirm repo root, folders in plural (`agents/`, `commands/`, `skills/`),
  restart OpenCode after touching `opencode.json`.
- **The MCP doesn't appear** → `./scripts/check-demo-mcp.sh`; check `opencode.json` and that `node` exists.
- **Ghostfolio won't start** → the insights demo via MCP **doesn't need it** (reads CSV). Continue with OpenCode + MCP.
- **A team is blocked** → have them use `workshop/solutions` as reference and the agent `@workshop-facilitator-agent`.
