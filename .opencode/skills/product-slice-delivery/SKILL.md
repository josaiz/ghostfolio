---
name: product-slice-delivery
description: Entregar una porción de producto end-to-end MÍNIMA y segura en Ghostfolio (la happy path del workshop). Cómo acotar el alcance, tocar el menor número de ficheros, validar y documentar el cambio. Úsala con /workshop-implement-small-product-slice.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Entrega de una porción de producto (workshop)

Cómo convertir una tarjeta en una happy path demostrable **sin romper nada**.

## Principios
1. **Lo más pequeño que demuestre el valor.** Si se puede demostrar sin tocar `apps/`, mejor (vía MCP + command).
2. **Read-only por defecto.** La happy path de referencia es: MCP `ghostfolio-demo-data` +
   `/workshop-analyze-demo-portfolio` + `/workshop-review-financial-safety`. No toca código de Ghostfolio.
3. **Si hay que tocar `apps/`**, delega en `frontend-angular-agent`/`backend-nestjs-agent`, copia un patrón existente,
   y pide confirmación humana antes.

## Procedimiento
1. `git status` para ver el punto de partida.
2. Plan corto: qué se entrega, qué ficheros, cómo se prueba. Confirmar si toca código funcional.
3. Implementar el mínimo. Sin LLM real. Sin dependencias nuevas salvo justificación.
4. Probar la happy path con comandos exactos (que cualquiera pueda repetir).
5. Pasar textos visibles por `financial-safety-review`.
6. `git diff` y explicar el cambio. Documentar en `docs/workshop/generated/<ID>-slice.md`.

## Definición de "hecho"
- [ ] La happy path se puede ejecutar y ver, con pasos reproducibles.
- [ ] Cambios mínimos y localizados; build/local setup intactos.
- [ ] Sin tocar `.env`, `prisma/schema.prisma`, `docker/`, `nx.json`.
- [ ] Revisión de safety PASS.
- [ ] Documentado. `git status`/`git diff` revisados. Sin commit/push.

## Cuándo usar / no usar
- Úsala para INT-01 y para cualquier "demuéstralo de punta a punta".
- No la uses para investigación o planificación pura (usa los commands `-inspect-`/`-plan-`).

## Límite
- Ante un cambio que crezca o se vuelva arriesgado: para, divide, y pide revisión humana.
