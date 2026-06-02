---
description: Produce un plan de implementación backend (NestJS) para una tarjeta BE del backlog. P. ej. /workshop-plan-backend-card BE-01
agent: backend-nestjs-agent
subtask: true
---

Planifica la implementación backend para la tarjeta: **$ARGUMENTS**

Backlog (localiza la tarjeta $1):
@docs/workshop/whiteboard-backlog.md

Trabaja así:
1. Carga la skill `nestjs-api-development` (y `nestjs-best-practices` para patrones generales).
2. Identifica un módulo análogo real en `apps/api/src/app/` (idealmente `endpoints/<feature>/`) y síguelo.
3. Entrega un **plan**, no código (salvo que se pida implementar):
   - **Contrato de datos** primero: interface/DTO en `libs/common/src/lib/...`.
   - Endpoint propuesto (método, ruta `/api/v1/...`), module + controller + service y su registro en `app.module.ts`.
   - Origen de datos **determinista** (CSV demo o servicios existentes). **Sin LLM real.**
   - Permisos/guards necesarios y cómo se autentica.
   - Validación: `npm run test:api`, `npm run lint`.
4. Lista ficheros a crear/editar (mínimo posible) y riesgos.

Guarda el plan en `docs/workshop/generated/$1-backend-plan.md`.
Recuerda: no toques `prisma/schema.prisma`. `git status` antes, `git diff` después si implementas. No commit/push.
