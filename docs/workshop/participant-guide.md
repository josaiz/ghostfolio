# Guía del participante — Innovation Night (Ghostfolio + OpenCode)

Bienvenido/a. En este workshop **desarrollamos mejoras reales sobre Ghostfolio** usando una forma de trabajo
**agéntica, gobernada y repetible** con OpenCode. Los commands, agents, skills y MCPs son **el medio**; el fin es
una mejora de producto: el **Portfolio Insights Assistant**.

## 1. Lo más importante

> No estamos "pidiéndole código a la IA". Estamos construyendo un sistema de desarrollo agéntico para implementar
> una mejora de producto. Cada tarjeta del backlog tiene un **objetivo funcional** real y se resuelve **creando,
> mejorando o usando** al menos un command/agent/skill/MCP.

## 2. Qué vas a construir

El epic común es **Portfolio Insights Assistant**: resumir el portfolio demo, detectar concentración por
cuenta/símbolo, detectar anomalías simples, mostrar insights y hacerlo **sin asesoramiento financiero**.

## 3. Arrancar Ghostfolio

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
La primera build tarda. Si modificas código de Ghostfolio: `./scripts/rebuild.sh` (o `.ps1`).

## 4. Cargar datos demo (si aún no están)

1. Abre `http://localhost:3333`, crea el usuario con *Get Started* (el primero es ADMIN) y guarda su **security token**.
2. Siembra los datos demo:
```bash
./scripts/seed-workshop-data.sh           # te pedirá el security token
# Windows: .\scripts\seed-workshop-data.ps1
```
Crea 3 cuentas demo (MyInvestor Core ETF, Trade Republic Growth, Crypto Exchange) con ~54 actividades.
> Nota: la **demo de insights por MCP funciona aunque Ghostfolio no esté levantado**, porque el MCP lee los CSV.

## 5. Abrir OpenCode

Abre OpenCode en la raíz del repo. Debería detectar automáticamente:
- el MCP `ghostfolio-demo-data` (`opencode.json`),
- los commands `/workshop-*` (`.opencode/commands/`),
- los agentes (`.opencode/agents/`) y skills (`.opencode/skills/`).

Verifica el MCP:
```bash
./scripts/check-demo-mcp.sh    # Windows: .\scripts\check-demo-mcp.ps1
```

## 6. Elegir una tarjeta del whiteboard

1. Mira el backlog en `docs/workshop/whiteboard-backlog.md` (y en el Microsoft Whiteboard de la sesión).
2. Elige una tarjeta de tu swimlane. Lee su **Objetivo funcional**, **Entregable de producto** y **Entregable agentic**.
3. Empieza casi siempre por entender el terreno: `/workshop-inspect-architecture <tu-tema>`.

## 7. Cómo trabajar una tarjeta (el ciclo)

```text
investigar  -> /workshop-inspect-architecture
planificar  -> /workshop-plan-frontend-card | -backend-card | -mcp-card | /workshop-analyze-demo-portfolio
implementar -> /workshop-implement-small-product-slice   (solo si la tarjeta lo pide; cambios mínimos)
revisar     -> /workshop-review-financial-safety
entregar    -> /workshop-prepare-team-handoff
```

- Usa el **command** que corresponde a tu tarjeta; éste invoca al **agente** adecuado, que carga la **skill** correcta
  y, si aporta, consulta el **MCP**.
- Puedes crear o mejorar componentes: añade una tool al MCP, afina una skill, ajusta un command. Documenta por qué.

## 8. Revisar tus cambios con Git

```bash
git status          # qué ficheros tocaste
git diff            # el contenido exacto de los cambios
```
Hazlo **antes y después**. **No** hagas `git commit` ni `git push` salvo que el facilitador lo pida.

## 9. Cómo pedir ayuda

- Pregunta al `workshop-facilitator-agent` ("¿qué command uso para FE-02?").
- Consulta `architecture-notes.md` (mapa del repo) y la `pedagogical-matrix.md` (qué aprende cada tarjeta).
- Si algo no arranca, mira el `facilitator-guide.md` (sección fallbacks) o pide ayuda al facilitador humano.

## 10. Qué NO tocar

- `.env`, `.env.dev`, `.env.example` ni secretos.
- `prisma/schema.prisma`, `prisma/migrations/`, `docker/`, `Dockerfile`, `nx.json`, `tsconfig.base.json`.
- Datos reales. Solo el dataset demo (read-only salvo el seed oficial).
- **Nunca** generes asesoramiento financiero personalizado. Describe, no aconsejes. Pasa tus textos por
  `/workshop-review-financial-safety`.

## 11. Definición de "tarjeta terminada"

- [ ] Objetivo funcional cumplido (entregable de producto: plan o código mínimo).
- [ ] Se creó/mejoró/usó al menos un command/agent/skill/MCP.
- [ ] Revisión de safety en PASS (si hay texto visible).
- [ ] `git status`/`git diff` revisados; sin commit/push.
- [ ] Handoff preparado con `/workshop-prepare-team-handoff`.
