# Guión de sesión — Innovation Night (OpenCode + Ghostfolio)

> **Documento para presentar guiar la sesión.** Es autosuficiente: explica qué es
> OpenCode y sus 4 piezas principales, cómo arrancar el proyecto, y cómo se desarrolla la parte práctica sobre el Whiteboard.


**Objetivo.** Que el equipo aprenda a trabajar de forma **agéntica, gobernada y repetible** con OpenCode, desarrollando
mejoras **reales** sobre Ghostfolio. Los componentes de OpenCode son **el medio**; el fin es el producto.

**Idea ancla (repetir a menudo):** *Command = cómo trabajar · Agent = quién trabaja · Skill = qué saber · MCP = con qué datos.*

---

## Agenda orientativa (≈2 h)

| Bloque | Tiempo | Contenido |
|--------|--------|-----------|
| 1. Apertura | 5 min | Por qué OpenCode y qué nos llevamos. |
| 2. Conceptos | 25–30 min | Las 4 piezas: Comandos, Skills, Agentes, MCPs (con ejemplos reales del repo). |
| 3. Puesta en marcha + pre-flight | 15 min | Arrancar el proyecto y verificar que todos están listos. |
| 4. Reparto de equipos + el Whiteboard | 10 min | Explicar las 3 columnas y repartir swimlanes. |
| 5. Trabajo en el board | 60 min | Resolver *PROPOSED TASKS* y luego *USE YOUR IMAGINATION*. |
| 6. Demo + cierre | 15 min | Enseñar la happy path y recapitular. |

---

## Parte A — Conceptos (qué se explica al empezar)

> Consejo: tras explicar cada pieza, **enséñala en vivo** abriendo su fichero o ejecutando el comando de ejemplo.
> No hace falta teoría larga; con verlo en el repo se entiende.

### 1. Introducción a OpenCode
**Idea.** Es un agente de codificación con IA que vive en la terminal, **pero gobernado por el propio repositorio**.

**Para explicarlo.** En lugar de que cada persona escriba prompts sueltos en un chat, definimos **en ficheros
versionados del repo** *cómo* se trabaja con la IA. Así todo el equipo comparte la misma forma de trabajar, es
**repetible**, y se puede **revisar en un pull request** como cualquier otro código. OpenCode tiene 4 piezas:
**Comandos, Skills, Agentes y MCPs.** Todo vive en `.opencode/` y `opencode.json`.

**Por qué importa (para el responsable):** repetibilidad, trazabilidad y control de cómo el equipo usa la IA.

### 2. Comandos
**Idea.** Un **flujo de trabajo repetible** que se invoca con `/nombre`.

**Para explicarlo.** Es un *prompt plantilla* guardado en el repo, con argumentos. En vez de reexplicar cada vez
"investiga la arquitectura para X", escribes `/workshop-inspect-architecture X`. Estandariza las tareas (investigar,
planificar, implementar, revisar).
- **Dónde vive:** `.opencode/commands/<nombre>.md`.
- **Ejemplos (ya en el repo):** `/workshop-analyze-demo-portfolio`, `/workshop-plan-backend-card`, `/workshop-implement-frontend-slice`.

### 3. Skills
**Idea.** **Conocimiento reutilizable** que el agente carga **bajo demanda**.

**Para explicarlo.** Son como "manuales de buenas prácticas del proyecto" (patrones, checklists, límites) que la IA lee
**solo cuando la tarea lo necesita**. Evitan que reinvente: le das los patrones reales de *este* repo. Si el comando es
*cómo trabajar*, la skill es *qué saber*.
- **Dónde vive:** `.opencode/skills/<nombre>/SKILL.md`.
- **Ejemplos:** `ghostfolio-domain-analysis` (razonar sobre el portfolio), `nestjs-api-development` (cómo añadir un endpoint aquí).

### 4. Agentes
**Idea.** **Especialistas** con un rol y **permisos** propios.

**Para explicarlo.** Cada agente tiene su system prompt y sus permisos: el de backend **puede editar**, el de seguridad
**solo lee**. Se invocan con `@nombre` o desde un comando. Las **reglas comunes** del repo (no tocar `.env`, no datos
reales, no asesoramiento financiero…) están en `AGENTS.md`, que aplica a todos.
- **Dónde vive:** `.opencode/agents/<nombre>.md` (+ `AGENTS.md` en la raíz).
- **Ejemplos:** `backend-nestjs-agent`, `frontend-angular-agent`, `financial-safety-reviewer`.

**Por qué importa (para el responsable):** los permisos por agente son **gobierno real** — la IA no puede hacer más de lo que le permitimos.

### 5. MCPs (Model Context Protocol)
**Idea.** Un **conector** a datos o herramientas externas vía un protocolo estándar.

**Para explicarlo.** Un MCP es un proceso que expone **tools** a OpenCode. El nuestro da acceso de **solo lectura** a los
datos demo, así los agentes consultan **datos reales del producto** sin tocar la base de datos ni **inventarse cifras**.
- **Dónde se configura:** `opencode.json`; el código en `tools/mcp/ghostfolio-demo-data-mcp/`.
- **Ejemplo:** MCP `ghostfolio-demo-data` con tools como `get_demo_portfolio_summary` y `detect_demo_anomalies`.

**Por qué importa (para el responsable):** datos gobernados y read-only → menos alucinaciones, sin riesgo sobre datos reales.

---

## Parte B — Dinámica de la sesión

### 3. Prerequisitos y puesta en marcha (muy sencillo)

**Prerequisitos** (en cada máquina):
- **Git** instalado.
- **Docker** instalado y **Docker Desktop arrancado**.
- Complementarios: **OpenCode** instalado + un **modelo de IA** configurado; **Node ≥ 22** (lo usan el MCP y los scripts).

**Arrancar el proyecto** — 3 scripts (Mac/Linux `.sh` · Windows `.ps1`):

1. **Arrancar Ghostfolio** (Docker, desde el código del repo):
   ```bash
   ./scripts/start.sh          # Windows:  .\scripts\start.ps1
   ```
   Queda en `http://localhost:3333`. La primera vez tarda (construye la imagen).

2. **Cargar datos demo**: en la web, crea el usuario con *Get Started* (el primero es admin) y **copia su security token**; luego:
   ```bash
   ./scripts/seed-workshop-data.sh    # Windows:  .\scripts\seed-workshop-data.ps1
   ```
   Crea 3 cuentas demo (~54 actividades).

3. **Reconstruir tras cambiar código** (necesario para **ver** lo implementado en frontend/backend):
   ```bash
   ./scripts/rebuild.sh        # Windows:  .\scripts\rebuild.ps1
   ```

> En una frase: **`start`** = arrancar · **`seed`** = meter datos demo · **`rebuild`** = ver tus cambios de código.
> Editar `.opencode/` o el MCP **no** necesita `rebuild`; solo tocar el código de la app (`apps/`) lo requiere.

### 3.1 Pre-flight (verificación rápida, todos a la vez)
- [ ] OpenCode instalado y **modelo de IA configurado** (prueba: que el agente responda a un "hola").
- [ ] Repo clonado en la **rama de inicio de la sesión** (trae las tareas resueltas como *examples*; las propuestas, no).
- [ ] **Docker arrancado** y Ghostfolio respondiendo (`./scripts/check.sh`).
- [ ] **Datos demo cargados** (`seed-workshop-data`).
- [ ] **MCP en verde**: `./scripts/check-demo-mcp.sh` (Windows `.ps1`) → 7 comprobaciones OK.

### 4. Reparto de equipos
Sugerencia: equipos pequeños alineados con los swimlanes del board (**Foundation, Frontend, Backend, DATA, MCP, Safety,
Integration**). Cada equipo elige una tarjeta de la columna *PROPOSED TASKS* de su swimlane.

### 5. El Whiteboard
El tablero tiene **3 columnas** y los **7 swimlanes** anteriores:

- **EXAMPLES** — Tareas **ya resueltas**: traen sus comandos, agentes, skills y el MCP creados. Son la **plantilla** que
  los equipos miran para aprender el patrón antes de construir.
- **PROPOSED TASKS** — Tareas **a resolver**. En la rama de inicio **no** traen los componentes hechos → aquí los equipos
  **implementan de verdad** (la feature *Portfolio Insights*: un endpoint y un widget), copiando el ejemplo análogo.
- **USE YOUR IMAGINATION** — Cuando terminen, **proponen sus propias tareas**. Guardarraíles: cada propuesta debe
  **crear o usar al menos un componente OpenCode** y respetar las reglas (datos demo, sin datos reales, sin asesoramiento
  financiero). Para diseñarlas bien, la skill `workshop-task-design`.

**Cómo se resuelve una tarjeta** (mini-guía para los equipos):
```text
1. Mira el EXAMPLE análogo (misma swimlane) para ver el patrón.
2. Planifica con su comando:   /workshop-plan-backend-card    |  /workshop-plan-frontend-card
3. Implementa:                 /workshop-implement-backend-slice  |  /workshop-implement-frontend-slice
4. Verifica:                   compila (build) y, para verlo, ./scripts/rebuild.sh
5. Revisa seguridad:           /workshop-review-financial-safety
6. Handoff:                    /workshop-prepare-team-handoff
```

**Ejemplo completo (la feature de la sesión).** Un equipo de **Backend** coge `P2-BE-02`: mira un endpoint ya hecho de
*EXAMPLES*, lanza `/workshop-implement-backend-slice P2-BE-02`, el agente `backend-nestjs-agent` lee el contrato técnico
(`portfolio-insights-feature.md`) y crea el endpoint `GET /api/v1/portfolio-insights`; valida con `build` y lo ve con
`rebuild`. En paralelo, un equipo de **Frontend** coge `P2-FE-02` y monta el widget *Portfolio Insights* en la Home, que
consume ese endpoint. Resultado: un panel visible con la concentración por cuenta y las anomalías del portfolio demo.

**Checkpoints del facilitador:**
- **CP1 (a mitad):** "Enséñame el plan y el comando que lo generó." → debe haber un objetivo de producto claro.
- **CP2:** "Ejecuta tu cambio o tu tool. ¿Qué se ve? ¿Pasa el review de seguridad?" → pide `git status` / `git diff`.
- **Final:** la happy path corre de principio a fin.

### 6. Demo + cierre
- **Demo:** el widget *Portfolio Insights* visible en Home/Analytics (concentración + anomalías), o
  `/workshop-analyze-demo-portfolio` mostrando las cifras del MCP, pasando el review de seguridad.
- **Cierre:** recuerda que hemos creado/usado comandos, skills, agentes y un MCP — pero el objetivo era **mejorar
  Ghostfolio de forma gobernada y repetible**. Eso es trabajar de forma agéntica.

---

## Notas para el responsable de tecnología (logística y gobierno)

- **Rama de inicio.** Se prepara una rama con la Fase 1 como *examples* y las *PROPOSED TASKS* **sin** resolver, para que
  los equipos construyan de verdad. La solución completa queda como *answer key* en la rama de soluciones.
- **Tiempo de `rebuild` de Docker.** Ver un cambio de frontend/backend exige reconstruir la imagen (varios minutos).
  Recomendación: que **no reconstruyan todos a la vez**; basta con validar que **compila**, y reconstruir 1–2 equipos como showcase.
- **Presupuesto de tiempo.** En 2–2.5 h no es realista que todos los equipos implementen **y** reconstruyan; plantear
  FE/BE completos como demostración y el resto (MCP, Safety, Integration) como tareas más cortas o planes.
- **Seguridad y gobierno.** El tooling **no** toca datos reales ni secretos, **no** hace `git commit`/`push`, evita el
  asesoramiento financiero personalizado (gate `financial-safety-reviewer`) y produce cambios pequeños y revisables con
  `git diff`. El MCP de datos demo es **solo lectura**.

## Material complementario (en el repo)
- `docs/workshop/whiteboard-backlog.md` y `whiteboard-backlog-phase2.md` — las tarjetas (EXAMPLES y PROPOSED).
- `docs/workshop/portfolio-insights-feature.md` — contrato técnico de la feature que se implementa.
- `docs/workshop/facilitator-guide.md` — apoyo a la facilitación (checkpoints, fallbacks).
- `docs/workshop/pedagogical-matrix.md` — mapeo tarea → qué se aprende.
