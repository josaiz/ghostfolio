---
description: Implementa una happy path mínima de extremo a extremo para una tarjeta de integración (p. ej. INT-01), con el menor cambio posible y revisión de safety.
---

Implementa una porción de producto **mínima** y demostrable para: **$ARGUMENTS**

Estado actual del repo:
!`git status --short`

Backlog (localiza la tarjeta $1):
@docs/workshop/whiteboard-backlog.md

Reglas de implementación (estrictas):
1. Carga la skill `product-slice-delivery`.
2. **Primero un plan corto** (qué ficheros, por qué) y pide confirmación si el cambio toca código funcional de Ghostfolio.
3. Cambia el **mínimo** número de ficheros. Respeta patrones existentes. Sin LLM real. Sin consejo financiero personalizado.
4. La happy path por defecto del workshop es **read-only por MCP** (`ghostfolio-demo-data`) + el command
   `/workshop-analyze-demo-portfolio`, sin tocar `apps/`. Solo toca `apps/api` o `apps/client` si la tarjeta lo pide
   y tras confirmación humana, delegando en `frontend-angular-agent` / `backend-nestjs-agent`.
5. **Prohibido** tocar `.env`, `prisma/schema.prisma`, `prisma/migrations/`, `docker/`, `nx.json`.

Al terminar:
- Muestra `git diff` de lo cambiado y explícalo.
- Indica cómo probar la happy path (comandos exactos).
- Pasa cualquier texto visible por `/workshop-review-financial-safety`.
- Documenta el cambio en `docs/workshop/generated/$1-slice.md`.
- **No** hagas `git commit` ni `git push`.
