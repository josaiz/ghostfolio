# Session Script — Innovation Night (OpenCode + Ghostfolio)

> **Document to guide the session.** It is self-contained: it explains what
> OpenCode is and its 4 main components, how to start the project, and how the
> practical part on the Whiteboard unfolds.


**Goal.** For the team to learn how to work in an **agentic, governed, and repeatable** way with OpenCode, developing
**real** improvements on Ghostfolio. OpenCode's components are **the means**; the product is the end.

**Anchor idea (repeat often):** *Command = how to work · Agent = who works · Skill = what to know · MCP = what data to use.*

---

## Suggested Agenda (≈2 h)

| Block | Time | Content |
|-------|------|---------|
| 1. Opening | 5 min | Why OpenCode and what we take away. |
| 2. Concepts | 25–30 min | The 4 components: Commands, Skills, Agents, MCPs (with real repo examples). |
| 3. Setup + pre-flight | 15 min | Start the project and verify everyone is ready. |
| 4. Team assignment + the Whiteboard | 10 min | Explain the 3 columns and assign swimlanes. |
| 5. Board work | 60 min | Resolve *PROPOSED TASKS* and then *USE YOUR IMAGINATION*. |
| 6. Demo + wrap-up | 15 min | Show the happy path and recap. |

---

## Part A — Concepts (what to explain at the start)

> Tip: after explaining each component, **show it live** by opening its file or running the example command.
> No long theory needed; seeing it in the repo makes it clear.

### 1. Introduction to OpenCode
**Idea.** It is an AI-powered coding agent that lives in the terminal, **but governed by the repository itself**.

**How to explain it.** Instead of each person writing loose prompts in a chat, we define **in versioned repo files** *how* to work with AI. This way the whole team shares the same way of working, it is
**repeatable**, and can be **reviewed in a pull request** like any other code. OpenCode has 4 components:
**Commands, Skills, Agents, and MCPs.** Everything lives in `.opencode/` and `opencode.json`.

**Why it matters (for the tech lead):** repeatability, traceability, and control over how the team uses AI.

### 2. Commands
**Idea.** A **repeatable workflow** invoked with `/name`.

**How to explain it.** It is a *prompt template* saved in the repo, with arguments. Instead of re-explaining every time
"investigate the architecture for X", you type `/workshop-inspect-architecture X`. It standardises tasks (investigate,
plan, implement, review).
- **Where it lives:** `.opencode/commands/<name>.md`.
- **Examples (already in the repo):** `/workshop-analyze-demo-portfolio`, `/workshop-plan-backend-card`, `/workshop-implement-frontend-slice`.

### 3. Skills
**Idea.** **Reusable knowledge** that the agent loads **on demand**.

**How to explain it.** They are like "project best-practice manuals" (patterns, checklists, constraints) that the AI reads
**only when the task needs it**. They prevent reinvention: you give it the real patterns of *this* repo. If the command is
*how to work*, the skill is *what to know*.
- **Where it lives:** `.opencode/skills/<name>/SKILL.md`.
- **Examples:** `ghostfolio-domain-analysis` (reason about the portfolio), `nestjs-api-development` (how to add an endpoint here).

### 4. Agents
**Idea.** **Specialists** with their own role and **permissions**.

**How to explain it.** Each agent has its system prompt and permissions: the backend one **can edit**, the security one
**reads only**. They are invoked with `@name` or from a command. The **common rules** for the repo (don't touch `.env`, no real data, no financial advice…) are in `AGENTS.md`, which applies to all.
- **Where it lives:** `.opencode/agents/<name>.md` (+ `AGENTS.md` at the root).
- **Examples:** `backend-nestjs-agent`, `frontend-angular-agent`, `financial-safety-reviewer`.

**Why it matters (for the tech lead):** per-agent permissions are **real governance** — the AI cannot do more than we allow.

### 5. MCPs (Model Context Protocol)
**Idea.** A **connector** to external data or tools via a standard protocol.

**How to explain it.** An MCP is a process that exposes **tools** to OpenCode. Ours gives **read-only** access to demo
data, so agents query **real product data** without touching the database or **making up numbers**.
- **Where it is configured:** `opencode.json`; the code is in `tools/mcp/ghostfolio-demo-data-mcp/`.
- **Example:** MCP `ghostfolio-demo-data` with tools such as `get_demo_portfolio_summary` and `detect_demo_anomalies`.

**Why it matters (for the tech lead):** governed, read-only data → fewer hallucinations, no risk on real data.

---

## Part B — Session Dynamics

### 3. Prerequisites and setup (very simple)

**Prerequisites** (on each machine):
- **Git** installed.
- **Docker** installed and **Docker Desktop running**.
- Complementary: **OpenCode** installed + an **AI model** configured; **Node ≥ 22** (used by the MCP and the scripts).

**Starting the project** — 3 scripts (Mac/Linux `.sh` · Windows `.ps1`):

1. **Start Ghostfolio** (Docker, from the repo code):
   ```bash
   ./scripts/start.sh          # Windows:  .\scripts\start.ps1
   ```
   Available at `http://localhost:3333`. The first run takes a while (builds the image).

2. **Load demo data**: in the web app, create the user with *Get Started* (the first one becomes admin) and **copy their security token**; then:
   ```bash
   ./scripts/seed-workshop-data.sh    # Windows:  .\scripts\seed-workshop-data.ps1
   ```
   Creates 3 demo accounts (~54 activities).

3. **Rebuild after changing code** (required to **see** frontend/backend changes):
   ```bash
   ./scripts/rebuild.sh        # Windows:  .\scripts\rebuild.ps1
   ```

> In one sentence: **`start`** = launch · **`seed`** = load demo data · **`rebuild`** = see your code changes.
> Editing `.opencode/` or the MCP **does not** require `rebuild`; only touching the app code (`apps/`) does.

### 3.1 Pre-flight (quick check, everyone at once)
- [ ] OpenCode installed and **AI model configured** (test: the agent responds to a "hello").
- [ ] Repo cloned on the **session start branch** (comes with tasks resolved as *examples*; the proposed ones are not).
- [ ] **Docker running** and Ghostfolio responding (`./scripts/check.sh`).
- [ ] **Demo data loaded** (`seed-workshop-data`).
- [ ] **MCP is green**: `./scripts/check-demo-mcp.sh` (Windows `.ps1`) → 7 checks OK.

### 4. Team assignment
Suggestion: small teams aligned with the board swimlanes (**Foundation, Frontend, Backend, DATA, MCP, Safety,
Integration**). Each team picks a card from the *PROPOSED TASKS* column in their swimlane.

### 5. The Whiteboard
The board has **3 columns** and the **7 swimlanes** above:

- **EXAMPLES** — Tasks **already resolved**: they come with their commands, agents, skills, and the MCP created. They are the **template** that
  teams look at to learn the pattern before building.
- **PROPOSED TASKS** — Tasks **to resolve**. On the start branch they **don't** include the finished components → here teams
  **actually implement** (the *Portfolio Insights* feature: an endpoint and a widget), copying the analogous example.
- **USE YOUR IMAGINATION** — When done, **propose their own tasks**. Guardrails: each proposal must
  **create or use at least one OpenCode component** and follow the rules (demo data, no real data, no financial advice). To design them well, use the `workshop-task-design` skill.

**How to resolve a card** (mini-guide for teams):
```text
1. Look at the analogous EXAMPLE (same swimlane) to see the pattern.
2. Plan with its command:   /workshop-plan-backend-card    |  /workshop-plan-frontend-card
3. Implement:               /workshop-implement-backend-slice  |  /workshop-implement-frontend-slice
4. Verify:                  compile (build) and, to see it, ./scripts/rebuild.sh
5. Security review:         /workshop-review-financial-safety
6. Handoff:                 /workshop-prepare-team-handoff
```

**Full example (the session feature).** A **Backend** team picks `P2-BE-02`: they look at an already-done endpoint in
*EXAMPLES*, run `/workshop-implement-backend-slice P2-BE-02`, the `backend-nestjs-agent` reads the technical contract
(`portfolio-insights-feature.md`) and creates the `GET /api/v1/portfolio-insights` endpoint; validates with `build` and sees it with
`rebuild`. In parallel, a **Frontend** team picks `P2-FE-02` and builds the *Portfolio Insights* widget on the Home page, which
consumes that endpoint. Result: a visible panel with account concentration and demo portfolio anomalies.

**Facilitator checkpoints:**
- **CP1 (halfway):** "Show me the plan and the command that generated it." → there should be a clear product objective.
- **CP2:** "Run your change or your tool. What do you see? Does it pass the security review?" → ask for `git status` / `git diff`.
- **Final:** the happy path runs end to end.

### 6. Demo + wrap-up
- **Demo:** the *Portfolio Insights* widget visible on Home/Analytics (concentration + anomalies), or
  `/workshop-analyze-demo-portfolio` showing MCP figures, passing the security review.
- **Wrap-up:** remind everyone we created/used commands, skills, agents, and an MCP — but the goal was to **improve
  Ghostfolio in a governed and repeatable way**. That is agentic work.

---

## Notes for the tech lead (logistics and governance)

- **Start branch.** A branch is prepared with Phase 1 as *examples* and the *PROPOSED TASKS* **unresolved**, so
  teams actually build. The full solution stays as an *answer key* on the solutions branch.
- **Docker `rebuild` time.** Seeing a frontend/backend change requires rebuilding the image (several minutes).
  Recommendation: **don't have everyone rebuild at once**; it is enough to validate that it **compiles**, and rebuild 1–2 teams as a showcase.
- **Time budget.** In 2–2.5 h it is not realistic for all teams to both implement **and** rebuild; present
  FE/BE as a full demo and treat the rest (MCP, Safety, Integration) as shorter tasks or plans.
- **Security and governance.** The tooling does **not** touch real data or secrets, does **not** run `git commit`/`push`, avoids personalised financial advice (gated by `financial-safety-reviewer`), and produces small, reviewable changes with
  `git diff`. The demo data MCP is **read-only**.

## Supplementary material (in the repo)
- `docs/workshop/whiteboard-backlog.md` and `whiteboard-backlog-phase2.md` — the cards (EXAMPLES and PROPOSED).
- `docs/workshop/portfolio-insights-feature.md` — technical contract for the feature being implemented.
- `docs/workshop/facilitator-guide.md` — facilitation support (checkpoints, fallbacks).
- `docs/workshop/pedagogical-matrix.md` — task → learning objective mapping.
