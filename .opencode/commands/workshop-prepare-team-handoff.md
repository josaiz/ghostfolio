---
description: Prepara el handoff de un equipo rellenando la plantilla con lo que se ha hecho en una tarjeta (INT-02).
agent: workshop-facilitator-agent
---

Prepara el documento de handoff para: **$ARGUMENTS**

Plantilla base:
@docs/workshop/team-handoff-template.md

Estado del repo:
!`git status --short`

Trabaja así:
1. Identifica la tarjeta del backlog ($1) y su objetivo funcional.
2. Rellena la plantilla con:
   - Tarjeta elegida y objetivo funcional.
   - Componentes OpenCode creados/usados (commands, agents, skills, MCP/tools).
   - Decisiones tomadas y por qué.
   - Comandos ejecutados (incluye los `/workshop-*` usados).
   - Ficheros modificados (a partir de `git status`/`git diff`).
   - Pruebas realizadas y resultado.
   - Revisión de safety (resultado de `/workshop-review-financial-safety`).
   - Dudas y siguiente paso para el equipo que reciba.
3. No inventes: si un dato no consta, escribe "pendiente".

Guarda el resultado en `docs/workshop/generated/$1-handoff.md`. No hagas commit/push.
