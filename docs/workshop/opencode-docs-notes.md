# OpenCode — Official documentation notes (validation for the workshop)

> Reference document for the solutions branch of the **Innovation Night Ghostfolio Agentic Workshop**.
> Objective: to record in writing which OpenCode formats are **validated against official documentation** and
> which decisions are **inferences** or workshop conventions, so that critical formats are not invented.

Date consulted: 2026-06-02.

---

## 1. Documentation consulted

| Topic | URL |
|------|-----|
| Agents | https://opencode.ai/docs/agents/ |
| Commands | https://opencode.ai/docs/commands/ |
| Skills | https://opencode.ai/docs/skills/ |
| MCP servers | https://opencode.ai/docs/mcp-servers/ |
| Config (`opencode.json`) | https://opencode.ai/docs/config/ |
| Rules / `AGENTS.md` | https://opencode.ai/docs/rules/ |
| MCP — transports (stdio) | https://modelcontextprotocol.io/specification/2025-06-18/basic/transports |
| MCP — lifecycle (initialize) | https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle |
| MCP — tools (tools/list, tools/call) | https://modelcontextprotocol.io/specification/2025-06-18/server/tools |

The Spanish URLs (`/docs/es/...`) redirect to the equivalent content; the canonical English version was used.

---

## 2. Critical decision resolved: singular vs plural directories

The OpenCode documentation states verbatim:

> "The `.opencode` and `~/.config/opencode` directories use **plural names** for subdirectories:
> `agents/`, `commands/`, `modes/`, `plugins/`, `skills/`, `tools/`, and `themes/`.
> **Singular names (e.g., `agent/`) are also supported for backwards compatibility.**"

- **Decision**: we use **plural** (`agents/`, `commands/`, `skills/`) as it is the current documented standard.
- Note: `README-workshop.md` mentioned singular paths (`.opencode/agent/`, `.opencode/command/`) as a "next phase".
  Both work, but the solutions branch aligns with the plural standard. **Validated against docs.**

---

## 3. Chosen paths (project)

```text
.opencode/
  agents/      <agent-name>.md          # one markdown file per agent
  commands/    <command-name>.md        # one markdown file per command (invoked with /<command-name>)
  skills/      <skill-name>/SKILL.md    # one folder per skill, SKILL.md file in uppercase
opencode.json                           # project config (includes MCP servers)
AGENTS.md                               # project rules for any agent
tools/mcp/ghostfolio-demo-data-mcp/     # local read-only MCP (outside .opencode, it is repo tooling)
```

Additional skills already existing in the repo (not created by us, reusable by OpenCode):

```text
.agents/skills/angular-developer/SKILL.md       # generic Angular skill (Google)
.agents/skills/nestjs-best-practices/SKILL.md    # generic NestJS skill
.claude/skills/...                                # compatible copies
```

OpenCode discovers skills in `.opencode/skills/`, `.claude/skills/` and `.agents/skills/` (validated in Skills docs).
That is why our workshop skills coexist with the generic ones and **reference** them instead of duplicating them.

---

## 4. Frontmatter used (validated vs inferred)

### 4.1 Agents (`.opencode/agents/<name>.md`) — **validated**

Official available fields: `description` (required), `mode` (`primary` | `subagent` | `all`),
`model` (`provider/model-id`), `temperature`, `top_p`, `steps`, `permission`, `disable`, `hidden`, `color`.

Format adopted in the workshop:

```yaml
---
description: <what it does and when to invoke it, in one sentence>
mode: subagent            # subagent for specialists; primary only for the facilitator
temperature: 0.1          # low for analysis/review
permission:
  edit: deny              # research agents do NOT edit files
  bash: ask               # shell commands require confirmation
  webfetch: allow
---
Body: system prompt of the agent.
```

- **Decision**: we deliberately omit `model` → each agent **inherits the default model** from the user's OpenCode settings.
  This way we do not invent a `provider/model-id` that might not exist on each participant's machine. (Reasoned inference.)

### 4.2 Commands (`.opencode/commands/<name>.md`) — **validated**

Official fields: `description`, `agent`, `model`, `subtask`. The **markdown body is the prompt template**.

Placeholders and dynamic values (validated):

- `$ARGUMENTS` → all arguments passed to the command.
- `$1`, `$2`, … → positional arguments.
- `` !`command` `` → injects the output of a shell command into the prompt.
- `@path/file` → injects the content of a file into the prompt.

Adopted format:

```yaml
---
description: <what this command solves>
agent: <specialist-agent>     # routes to the appropriate subagent
subtask: true                    # some commands force execution as subagent
---
Prompt body, using $ARGUMENTS / $1 and, where helpful, !`git status` or @docs/...
```

> Accuracy note: an automatic summary suggested a required `template:` field. That applies to the **JSON form**
> of defining commands inside `opencode.json`. In the **markdown form** (the one we use) the template is the file body,
> not a frontmatter field. **Validated** by reading the Commands page.

### 4.3 Skills (`.opencode/skills/<name>/SKILL.md`) — **validated**

- File **must be** `SKILL.md` (uppercase).
- `name` (required): 1–64 chars, lowercase alphanumeric with single hyphens (`^[a-z0-9]+(-[a-z0-9]+)*$`),
  **must match the folder name**.
- `description` (required): 1–1024 chars.
- Optional: `license`, `compatibility`, `metadata` (string→string map).
- Additional files/resources can coexist alongside the `SKILL.md` (e.g. `references/`), as `angular-developer` does.

Adopted format:

```yaml
---
name: <skill-name>
description: <what knowledge it provides and when to use it>
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---
```

### 4.4 MCP in `opencode.json` — **validated**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "ghostfolio-demo-data": {
      "type": "local",
      "command": ["node", "tools/mcp/ghostfolio-demo-data-mcp/src/index.mjs"],
      "enabled": true
    }
  }
}
```

Fields for a **local** server: `type: "local"` (required), `command` (array, required),
`environment` (optional), `enabled` (optional), `timeout` (ms, optional).
For a **remote** server: `type: "remote"`, `url`, `headers`, `oauth`, `enabled`, `timeout`.
MCP tools are exposed **prefixed with the server name**.

Allowed top-level keys in `opencode.json` (relevant subset): `$schema`, `model`, `small_model`,
`provider`, `tools`, `agent`, `command`, `permission`, `mcp`, `plugin`, `instructions`.

### 4.5 `AGENTS.md` / rules — **validated**

- `AGENTS.md` at the **project root** contains instructions for the LLM in this repo.
- `opencode.json` supports `instructions: [..]` with paths/globs to additional rule files.
- OpenCode uses `CLAUDE.md` as a fallback if there is no `AGENTS.md`.
- **Decision**: we create a brief `AGENTS.md` at the root + reference the workshop guides via `instructions`.

---

## 5. Permissions / tools defined per agent

Permission categories (validated): `read`, `edit`, `glob`, `grep`, `list`, `bash`, `task`, `lsp`, `skill`,
`webfetch`, `websearch`. Values: `allow` | `ask` | `deny`. `bash` supports glob patterns per command.

Workshop policy:

| Agent | edit | bash | Notes |
|--------|------|------|-------|
| `ghostfolio-architect` | deny | ask | Investigates and maps only. |
| `prisma-data-agent` | deny | ask | **Read-only** data analysis. |
| `portfolio-domain-agent` | deny | ask | Reasoning over demo data. |
| `financial-safety-reviewer` | deny | deny | Reviews texts/responses only. |
| `frontend-angular-agent` | ask | ask | Plans; implements only if requested. |
| `backend-nestjs-agent` | ask | ask | Plans; implements only if requested. |
| `mcp-builder-agent` | ask | ask | Creates/extends read-only MCP in `tools/mcp/`. |
| `workshop-facilitator-agent` | ask | ask | `primary`; prepares materials and handoffs. |

All agents also inherit the rules from `AGENTS.md` (do not touch `.env`, no real data, small changes, etc.).

---

## 6. Local MCP — validated protocol format

The demo MCP is **stdio JSON-RPC 2.0** with no external dependencies. Rules validated against the MCP spec:

- Messages **delimited by newlines**, no embedded newlines, UTF-8.
- `stdout` carries only valid MCP messages; **logs go to `stderr`**.
- `initialize`: the server responds with `protocolVersion` (we return the version the client requests if supported),
  `capabilities: { tools: {} }` and `serverInfo`.
- `notifications/initialized`: is a notification, **no response** is sent.
- `tools/list` → `{ tools: [{ name, description, inputSchema }] }` (inputSchema is JSON Schema).
- `tools/call` with `{ name, arguments }` → `{ content: [{ type: "text", text }], isError? }`.
- Protocol errors: JSON-RPC `error` with standard codes (`-32601` method not found, `-32602` params, etc.).

---

## 7. Practical difference between command, agent, skill, tool and MCP

| Concept | What it is | When it is used in the workshop |
|----------|--------|------------------------------|
| **Command** | Repeatable workflow invocable with `/name`. It is a *prompt template* with arguments. | Encapsulate "investigate / plan / implement / review" a backlog card. |
| **Agent** | Specialist with own system prompt + permissions. Invoked by command or `@mention`. | Frontend, backend, data, MCP, domain, safety, facilitation. |
| **Skill** | Reusable knowledge (`SKILL.md`) that the agent loads on demand. | Concrete repo patterns (Angular/Nx, NestJS, Prisma read-only, domain, safety). |
| **Tool** | Native OpenCode tool (`.opencode/tools/`, TypeScript). | We do not use it: we prefer an MCP for demo data (more portable and reusable). |
| **MCP** | External server (process) that exposes tools via the MCP protocol. | Query Ghostfolio demo data in **read-only** mode. |

Mental rule: **Command** = "how to work", **Agent** = "who works", **Skill** = "what to know",
**MCP/Tool** = "with what data/capabilities".

---

## 8. Uncertainties / differences between documentation and installation

- **Singular vs plural** of `agent(s)`/`command(s)`: resolved in favour of plural (standard). If a very old
  version of OpenCode only read singular, it is enough to rename the folders. *Not verified against the exact
  version installed on each workshop machine* → see checklist in `solution-runbook.md`.
- **Model version per agent**: intentionally omitted; depends on the provider configured by each participant.
- **Skill discovery**: validated that OpenCode looks in `.opencode/skills`, `.claude/skills` and `.agents/skills`;
  the exact precedence order is not critical for the workshop because the names do not collide.

---

## 9. Summary: validated vs inferred

**Validated against official documentation:**
- Plural paths for `agents/`, `commands/`, `skills/`.
- Frontmatter for agents, commands and skills.
- `mcp` structure in `opencode.json` for a local server.
- `AGENTS.md` at root + `instructions` in `opencode.json`.
- MCP stdio protocol (framing, initialize, tools/list, tools/call).

**Inferences / workshop conventions (non-critical):**
- Omitting `model` in agents/commands to inherit the default model.
- Concrete permission policy per agent (table in section 5).
- Names of commands/agents/skills and their mapping to backlog cards.
- Choosing an MCP **without dependencies** (see `reference-implementation.md`, section "Why zero-dependency").
