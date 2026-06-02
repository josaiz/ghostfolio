# OpenCode — Notas de documentación oficial (validación para el workshop)

> Documento de referencia para la rama de soluciones del **Innovation Night Ghostfolio Agentic Workshop**.
> Objetivo: dejar por escrito qué formatos de OpenCode están **validados contra documentación oficial** y
> qué decisiones son **inferencias** o convenciones del workshop, para no inventar formatos críticos.

Fecha de consulta: 2026-06-02.

---

## 1. Documentación consultada

| Tema | URL |
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

Las URLs en español (`/docs/es/...`) redirigen al contenido equivalente; se usó la versión canónica en inglés.

---

## 2. Decisión crítica resuelta: directorios singular vs plural

La documentación de OpenCode indica textualmente:

> "The `.opencode` and `~/.config/opencode` directories use **plural names** for subdirectories:
> `agents/`, `commands/`, `modes/`, `plugins/`, `skills/`, `tools/`, and `themes/`.
> **Singular names (e.g., `agent/`) are also supported for backwards compatibility.**"

- **Decisión**: usamos **plural** (`agents/`, `commands/`, `skills/`) por ser el estándar actual documentado.
- Nota: `README-workshop.md` mencionaba como "fase siguiente" rutas en singular (`.opencode/agent/`, `.opencode/command/`).
  Ambas funcionan, pero la rama de soluciones se alinea con el estándar plural. **Validado contra docs.**

---

## 3. Rutas elegidas (proyecto)

```text
.opencode/
  agents/      <agent-name>.md          # un fichero markdown por agente
  commands/    <command-name>.md        # un fichero markdown por command (se invoca con /<command-name>)
  skills/      <skill-name>/SKILL.md    # una carpeta por skill, fichero SKILL.md en mayúsculas
opencode.json                           # config del proyecto (incluye MCP servers)
AGENTS.md                               # reglas del proyecto para cualquier agente
tools/mcp/ghostfolio-demo-data-mcp/     # MCP local read-only (fuera de .opencode, es tooling de repo)
```

Skills adicionales ya existentes en el repo (no creadas por nosotros, reutilizables por OpenCode):

```text
.agents/skills/angular-developer/SKILL.md       # skill genérica de Angular (Google)
.agents/skills/nestjs-best-practices/SKILL.md    # skill genérica de NestJS
.claude/skills/...                                # copias compatibles
```

OpenCode descubre skills en `.opencode/skills/`, `.claude/skills/` y `.agents/skills/` (validado en docs de Skills).
Por eso nuestras skills de workshop conviven con las genéricas y las **referencian** en lugar de duplicarlas.

---

## 4. Frontmatter usado (validado vs inferido)

### 4.1 Agents (`.opencode/agents/<name>.md`) — **validado**

Campos oficiales disponibles: `description` (obligatorio), `mode` (`primary` | `subagent` | `all`),
`model` (`provider/model-id`), `temperature`, `top_p`, `steps`, `permission`, `disable`, `hidden`, `color`.

Formato adoptado en el workshop:

```yaml
---
description: <qué hace y cuándo invocarlo, en una frase>
mode: subagent            # subagent para especialistas; primary solo para el facilitador
temperature: 0.1          # bajo para análisis/revisión
permission:
  edit: deny              # los agentes de investigación NO editan ficheros
  bash: ask               # comandos shell requieren confirmación
  webfetch: allow
---
Cuerpo: prompt de sistema del agente.
```

- **Decisión**: omitimos `model` a propósito → cada agente **hereda el modelo por defecto** del usuario en OpenCode.
  Así no inventamos un `provider/model-id` que podría no existir en la máquina de cada participante. (Inferencia razonada.)

### 4.2 Commands (`.opencode/commands/<name>.md`) — **validado**

Campos oficiales: `description`, `agent`, `model`, `subtask`. El **cuerpo markdown es la plantilla del prompt**.

Placeholders y dinámicos (validados):

- `$ARGUMENTS` → todos los argumentos pasados al command.
- `$1`, `$2`, … → argumentos posicionales.
- `` !`comando` `` → inyecta la salida de un comando de shell en el prompt.
- `@ruta/fichero` → inyecta el contenido de un fichero en el prompt.

Formato adoptado:

```yaml
---
description: <qué resuelve este command>
agent: <agente-especialista>     # enruta al subagente adecuado
subtask: true                    # algunos commands fuerzan ejecución como subagente
---
Cuerpo del prompt, usando $ARGUMENTS / $1 y, donde aporta, !`git status` o @docs/...
```

> Nota de exactitud: un resumen automático sugería un campo `template:` obligatorio. Eso aplica a la **forma JSON**
> de definir commands dentro de `opencode.json`. En la **forma markdown** (la que usamos) la plantilla es el cuerpo
> del fichero, no un campo de frontmatter. **Validado** leyendo la página de Commands.

### 4.3 Skills (`.opencode/skills/<name>/SKILL.md`) — **validado**

- Fichero **obligatoriamente** `SKILL.md` (mayúsculas).
- `name` (obligatorio): 1–64 chars, minúsculas alfanuméricas con guiones simples (`^[a-z0-9]+(-[a-z0-9]+)*$`),
  **debe coincidir con el nombre de la carpeta**.
- `description` (obligatorio): 1–1024 chars.
- Opcionales: `license`, `compatibility`, `metadata` (mapa string→string).
- Pueden convivir ficheros/recursos junto al `SKILL.md` (p. ej. `references/`), como hace `angular-developer`.

Formato adoptado:

```yaml
---
name: <skill-name>
description: <qué conocimiento aporta y cuándo usarla>
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---
```

### 4.4 MCP en `opencode.json` — **validado**

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

Campos para servidor **local**: `type: "local"` (obligatorio), `command` (array, obligatorio),
`environment` (opcional), `enabled` (opcional), `timeout` (ms, opcional).
Para servidor **remoto**: `type: "remote"`, `url`, `headers`, `oauth`, `enabled`, `timeout`.
Las tools del MCP se exponen **prefijadas con el nombre del servidor**.

Claves de primer nivel permitidas en `opencode.json` (subconjunto relevante): `$schema`, `model`, `small_model`,
`provider`, `tools`, `agent`, `command`, `permission`, `mcp`, `plugin`, `instructions`.

### 4.5 `AGENTS.md` / reglas — **validado**

- `AGENTS.md` en la **raíz del proyecto** contiene instrucciones para el LLM en este repo.
- `opencode.json` admite `instructions: [..]` con rutas/globs a ficheros de reglas adicionales.
- OpenCode usa `CLAUDE.md` como fallback si no hay `AGENTS.md`.
- **Decisión**: creamos `AGENTS.md` breve en la raíz + referenciamos las guías del workshop vía `instructions`.

---

## 5. Permisos / herramientas definidos por agente

Categorías de permiso (validadas): `read`, `edit`, `glob`, `grep`, `list`, `bash`, `task`, `lsp`, `skill`,
`webfetch`, `websearch`. Valores: `allow` | `ask` | `deny`. `bash` admite patrones glob por comando.

Política del workshop:

| Agente | edit | bash | Notas |
|--------|------|------|-------|
| `ghostfolio-architect` | deny | ask | Solo investiga y mapea. |
| `prisma-data-agent` | deny | ask | Análisis de datos **read-only**. |
| `portfolio-domain-agent` | deny | ask | Razonamiento sobre datos demo. |
| `financial-safety-reviewer` | deny | deny | Solo revisa textos/respuestas. |
| `frontend-angular-agent` | ask | ask | Planifica; implementa solo si se pide. |
| `backend-nestjs-agent` | ask | ask | Planifica; implementa solo si se pide. |
| `mcp-builder-agent` | ask | ask | Crea/extiende MCP read-only en `tools/mcp/`. |
| `workshop-facilitator-agent` | ask | ask | `primary`; prepara materiales y handoffs. |

Todos heredan además las reglas de `AGENTS.md` (no tocar `.env`, no datos reales, cambios pequeños, etc.).

---

## 6. MCP local — formato de protocolo validado

El MCP de demo es **stdio JSON-RPC 2.0** sin dependencias externas. Reglas validadas contra la spec MCP:

- Mensajes **delimitados por saltos de línea**, sin saltos de línea embebidos, UTF-8.
- `stdout` solo lleva mensajes MCP válidos; **los logs van a `stderr`**.
- `initialize`: el servidor responde con `protocolVersion` (devolvemos la versión que pide el cliente si la
  soporta), `capabilities: { tools: {} }` y `serverInfo`.
- `notifications/initialized`: es notificación, **no** se responde.
- `tools/list` → `{ tools: [{ name, description, inputSchema }] }` (inputSchema es JSON Schema).
- `tools/call` con `{ name, arguments }` → `{ content: [{ type: "text", text }], isError? }`.
- Errores de protocolo: JSON-RPC `error` con códigos estándar (`-32601` método no encontrado, `-32602` params, etc.).

---

## 7. Diferencia práctica entre command, agent, skill, tool y MCP

| Concepto | Qué es | Cuándo se usa en el workshop |
|----------|--------|------------------------------|
| **Command** | Workflow repetible invocable con `/nombre`. Es un *prompt plantilla* con argumentos. | Encapsular "investigar / planificar / implementar / revisar" una tarjeta del backlog. |
| **Agent** | Especialista con system prompt + permisos propios. Se invoca por command o `@mention`. | Frontend, backend, datos, MCP, dominio, safety, facilitación. |
| **Skill** | Conocimiento reutilizable (`SKILL.md`) que el agente carga bajo demanda. | Patrones concretos del repo (Angular/Nx, NestJS, Prisma read-only, dominio, safety). |
| **Tool** | Herramienta nativa de OpenCode (`.opencode/tools/`, TypeScript). | No la usamos: preferimos un MCP para datos demo (más portable y reusable). |
| **MCP** | Servidor externo (proceso) que expone tools por protocolo MCP. | Consultar datos demo de Ghostfolio en modo **read-only**. |

Regla mental: **Command** = "cómo trabajar", **Agent** = "quién trabaja", **Skill** = "qué saber",
**MCP/Tool** = "con qué datos/capacidades".

---

## 8. Dudas / diferencias entre documentación e instalación

- **Singular vs plural** de `agent(s)`/`command(s)`: resuelto a favor de plural (estándar). Si una versión muy
  antigua de OpenCode solo leyera singular, basta renombrar las carpetas. *No verificado contra la versión
  exacta instalada en cada máquina del workshop* → ver checklist en `solution-runbook.md`.
- **Versión del modelo por agente**: omitida a propósito; depende del proveedor configurado por cada participante.
- **Descubrimiento de skills**: validado que OpenCode mira `.opencode/skills`, `.claude/skills` y `.agents/skills`;
  el orden de precedencia exacto no es crítico para el workshop porque los nombres no colisionan.

---

## 9. Resumen: validado vs inferido

**Validado contra documentación oficial:**
- Rutas plural de `agents/`, `commands/`, `skills/`.
- Frontmatter de agents, commands y skills.
- Estructura `mcp` en `opencode.json` para servidor local.
- `AGENTS.md` en raíz + `instructions` en `opencode.json`.
- Protocolo MCP stdio (framing, initialize, tools/list, tools/call).

**Inferencias / convenciones del workshop (no críticas):**
- Omitir `model` en agents/commands para heredar el modelo por defecto.
- Política concreta de permisos por agente (tabla de la sección 5).
- Nombres de commands/agents/skills y su mapeo a las tarjetas del backlog.
- Elegir un MCP **sin dependencias** (ver `reference-implementation.md`, sección "Por qué zero-dependency").
