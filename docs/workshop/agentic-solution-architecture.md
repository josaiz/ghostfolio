# Arquitectura de la solución agentic — Portfolio Insights Assistant

Cómo encajan commands, agents, skills y el MCP para resolver **tareas de producto reales** sobre Ghostfolio,
de forma gobernada y repetible con OpenCode.

## 1. Product epic que resolvemos

**Portfolio Insights Assistant**: una mejora de Ghostfolio que, sobre el portfolio demo, (a) muestra un resumen,
(b) detecta concentración por cuenta/símbolo, (c) detecta anomalías simples en datos importados, (d) presenta
insights básicos, (e) consulta datos demo por un MCP read-only y (f) garantiza que no da consejo financiero personalizado.

No usamos un LLM real para los cálculos: los insights son **deterministas y reproducibles**. El valor del workshop
no es "pedir código a la IA", sino **construir un sistema de desarrollo agéntico** que implemente esta mejora.

## 2. Commands (`.opencode/commands/`)

| Command | Para qué | Agente |
|---------|----------|--------|
| `/workshop-inspect-architecture` | Investigar arquitectura y mapear (FND-01). | ghostfolio-architect |
| `/workshop-plan-frontend-card` | Plan de un widget/vista frontend (FE-*). | frontend-angular-agent |
| `/workshop-plan-backend-card` | Plan de un endpoint/servicio (BE-*). | backend-nestjs-agent |
| `/workshop-plan-mcp-card` | Plan de una tool MCP (MCP-*). | mcp-builder-agent |
| `/workshop-analyze-demo-portfolio` | Insights descriptivos del portfolio demo (DATA-01/INT-01). | portfolio-domain-agent |
| `/workshop-implement-small-product-slice` | Implementar una happy path mínima (INT-01). | (agente activo) |
| `/workshop-review-financial-safety` | Gate de seguridad financiera (SAFE-02). | financial-safety-reviewer |
| `/workshop-prepare-team-handoff` | Handoff entre equipos (INT-02). | workshop-facilitator-agent |
| `/workshop-demo-runbook` | Runbook de la demo (INT-01). | workshop-facilitator-agent |

## 3. Agents (`.opencode/agents/`)

- `ghostfolio-architect` — investiga arquitectura (read-only).
- `frontend-angular-agent` — frontend Angular/Nx.
- `backend-nestjs-agent` — endpoints/servicios NestJS.
- `prisma-data-agent` — datos/Prisma (read-only).
- `mcp-builder-agent` — MCP local read-only.
- `portfolio-domain-agent` — dominio/insights del portfolio demo.
- `financial-safety-reviewer` — límites financieros (read-only).
- `workshop-facilitator-agent` — facilitación/handoffs (primary).

## 4. Skills (`.opencode/skills/`)

`ghostfolio-domain-analysis`, `angular-nx-development`, `nestjs-api-development`, `prisma-readonly-data-access`,
`mcp-server-authoring`, `financial-safety-review`, `workshop-task-design`, `product-slice-delivery`.

Además, OpenCode descubre las skills genéricas ya presentes en el repo: `.agents/skills/angular-developer` y
`.agents/skills/nestjs-best-practices`. Las nuestras las **referencian** (saber genérico → cómo aplicarlo en Ghostfolio).

## 5. MCP (`tools/mcp/ghostfolio-demo-data-mcp/`)

Servidor MCP local **read-only**, zero-dependency, registrado en `opencode.json` como `ghostfolio-demo-data`.
Lee los CSV demo de `data/workshop/import/`. Tools: `list_demo_accounts`, `get_demo_portfolio_summary`,
`list_demo_activities`, `detect_demo_anomalies`, `get_account_summary`, `get_symbol_exposure`, `get_recent_activities`.

## 6. Cómo cada componente resuelve tareas de producto

- **Command** = el "cómo trabajar" repetible de una tarjeta (investigar/planificar/implementar/revisar).
- **Agent** = el "quién", con permisos acotados a su función (los de investigación no editan).
- **Skill** = el "qué saber" del repo y del dominio, para aplicar patrones reales.
- **MCP** = el "con qué datos", de forma estable y read-only, sin prompts sueltos.

El conjunto convierte "haz un widget de insights" en un flujo gobernado: mapear → planificar con patrones reales →
obtener datos del MCP → revisar safety → handoff.

## 7. Qué construye cada equipo

- **Frontend**: FE-01/02/03 — widget/vista/botón de insights (plan o código mínimo).
- **Backend**: BE-01/02 — endpoint mock + servicio de concentración (plan o código mínimo).
- **Datos/Dominio**: FND-02, DATA-01/02 — contrato de insights y reglas de concentración/anomalías.
- **MCP/Plataforma**: MCP-01/02/03 — servidor y tools read-only (estúdialo y extiéndelo).
- **Safety**: SAFE-01/02 — guía de límites y gate de revisión (revisan a los demás).
- **Integración/Facilitación**: INT-01/02 — happy path demostrable y handoffs.

## 8. Rama base vs rama de soluciones

- **Rama base** (la que ven los participantes al empezar): Ghostfolio funcionando en local con datos demo, los
  scripts de arranque/seed y el dataset. **Sin** `.opencode/`, **sin** MCP, **sin** docs de workshop agentic.
- **Rama de soluciones** (`workshop/solutions`, esta): añade `opencode.json`, `AGENTS.md`, `.opencode/` (agents,
  commands, skills), el MCP `ghostfolio-demo-data`, los scripts `*-demo-mcp.*` y toda la doc de `docs/workshop/`.
  Es la **solución de referencia**: los equipos pueden inspirarse, usar los componentes y extenderlos.

El facilitador decide si los equipos parten de la rama base (y reconstruyen) o de la rama de soluciones (y extienden).
Ver `facilitator-guide.md`.

## 9. Cómo se ejecuta la demo (resumen; detalle en `solution-runbook.md`)

1. Arrancar Ghostfolio: `./scripts/start.sh` (o `.ps1`). Sembrar datos si hace falta: `./scripts/seed-workshop-data.sh`.
2. Verificar el MCP: `./scripts/check-demo-mcp.sh` (o `.ps1`) → 7 comprobaciones en verde.
3. En OpenCode, ejecutar `/workshop-analyze-demo-portfolio` → insights con cifras del MCP.
4. Ejecutar `/workshop-review-financial-safety` sobre esos insights → PASS.
5. (Opcional) `/workshop-plan-frontend-card FE-01` para ver un plan de widget.

## 10. Restricciones de seguridad

- No tocar `.env`, `prisma/schema.prisma`, `prisma/migrations/`, `docker/`, `nx.json`.
- No datos reales: solo dataset demo. MCP estrictamente read-only.
- Nada de asesoramiento financiero personalizado (gate `financial-safety-reviewer`).
- Cambios pequeños; `git status`/`git diff` alrededor; sin commit/push salvo petición explícita.
- Sin LLM real en los cálculos de insights.

## 11. Piezas read-only

- MCP `ghostfolio-demo-data` y todas sus tools.
- Agentes `ghostfolio-architect`, `prisma-data-agent`, `portfolio-domain-agent`, `financial-safety-reviewer`
  (`edit: deny`).
- El dataset demo se trata como read-only salvo el seed oficial.

---

## Diagrama de flujo (tarea de producto → componentes)

```text
FE-01  Widget Portfolio Insights
  -> /workshop-plan-frontend-card FE-01
    -> frontend-angular-agent
      -> skill: angular-nx-development (+ angular-developer)
      -> consume: contrato de FND-02 / MCP get_demo_portfolio_summary
      -> output: plan de implementación (ficheros a crear/editar)
      -> gate: /workshop-review-financial-safety (texto de UI)

BE-01  Endpoint mock de insights
  -> /workshop-plan-backend-card BE-01
    -> backend-nestjs-agent
      -> skill: nestjs-api-development (+ nestjs-best-practices)
      -> output: plan (DTO en libs/common, endpoint endpoints/portfolio-insights/)

MCP-02  Demo portfolio summary
  -> /workshop-plan-mcp-card MCP-02
    -> mcp-builder-agent
      -> skill: mcp-server-authoring
      -> MCP: ghostfolio-demo-data
        -> tool: get_demo_portfolio_summary  (read-only, datos CSV demo)

DATA-01  Reglas de concentración
  -> /workshop-analyze-demo-portfolio
    -> portfolio-domain-agent
      -> skill: ghostfolio-domain-analysis
      -> datos: MCP get_demo_portfolio_summary / get_symbol_exposure
      -> output: reglas con cifras reales (descriptivas)

SAFE-02  Financial safety review
  -> /workshop-review-financial-safety
    -> financial-safety-reviewer
      -> skill: financial-safety-review
      -> output: PASS/FAIL + hallazgos + reescritura segura

INT-01  Happy path (Portfolio Insights Demo)
  -> /workshop-implement-small-product-slice INT-01
      -> skill: product-slice-delivery
      -> usa MCP + /workshop-analyze-demo-portfolio + gate de safety
      -> output: demo reproducible (sin tocar apps/)
  -> /workshop-prepare-team-handoff INT-01
      -> workshop-facilitator-agent -> handoff
```
