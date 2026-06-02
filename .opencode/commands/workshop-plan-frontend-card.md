---
description: Produce un plan de implementación frontend (Angular/Nx) para una tarjeta FE del backlog. P. ej. /workshop-plan-frontend-card FE-01
agent: frontend-angular-agent
subtask: true
---

Planifica la implementación frontend para la tarjeta: **$ARGUMENTS**

Backlog (localiza la tarjeta $1):
@docs/workshop/whiteboard-backlog.md

Trabaja así:
1. Carga la skill `angular-nx-development` (y `angular-developer` para mecánica de Angular).
2. Identifica un componente análogo real en `apps/client/src/app/components/` o `libs/ui/` y síguelo.
3. Entrega un **plan**, no código (salvo que se pida explícitamente implementar):
   - Componente/vista a crear y **ruta exacta** (p. ej. `apps/client/src/app/components/portfolio-insights/`).
   - Inputs/outputs y **contrato de datos** que consume (mock determinista o endpoint).
   - Dónde se monta (página/host) y cómo se navega hasta él.
   - Pasos de validación: `npm run lint`, build del cliente, revisión visual.
   - Textos de UI propuestos (que luego pasarán por `/workshop-review-financial-safety`).
4. Indica qué ficheros se crearían/editarían y por qué (mínimo posible).

Guarda el plan en `docs/workshop/generated/$1-frontend-plan.md`.
Recuerda: `git status` antes, `git diff` después si implementas. No commit/push.
