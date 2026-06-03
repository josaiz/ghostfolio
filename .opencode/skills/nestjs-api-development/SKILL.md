---
name: nestjs-api-development
description: Cómo añadir endpoints/servicios NestJS pequeños EN ESTE repo (Ghostfolio) respetando contratos y patrones. Encontrar módulos existentes, seguir la convención endpoints/<feature>/, definir DTOs y validar. Para patrones generales, apóyate en nestjs-best-practices.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Desarrollo backend NestJS en Ghostfolio (workshop)

Cómo extender el backend de **este** repo con el mínimo riesgo. Para patrones generales de NestJS, carga además
la skill genérica `nestjs-best-practices`.

## Mapa del backend (verificado)
- API: `apps/api/` (NestJS 11). Proyecto Nx por defecto: `api`.
- Módulos por feature en `apps/api/src/app/<feature>/` (`*.module.ts`, `*.controller.ts`, `*.service.ts`),
  registrados en `apps/api/src/app/app.module.ts`.
- Convención reciente para endpoints nuevos: `apps/api/src/app/endpoints/<feature>/`.
- Ejemplos a imitar: `account/`, `activities/`, `portfolio/`, `endpoints/watchlist/`.
- DTOs/interfaces compartidos: `libs/common/src/lib/dtos/` y `libs/common/src/lib/interfaces/`.

## Método (contrato primero, cambios mínimos)
1. **Contrato antes que código**: define la interface/DTO de la respuesta en `libs/common/src/lib/...`
   (p. ej. `PortfolioInsights`). Así frontend y backend comparten tipo.
2. **Encuentra el módulo análogo** más simple (mira un controller+service pequeño) y replícalo.
3. **Crea el feature** en `endpoints/<feature>/` (module + controller + service) y **regístralo** en `app.module.ts`.
4. **Datos deterministas**: lee el dataset demo o reutiliza servicios existentes. **Nunca un LLM real** ni cálculos
   no reproducibles.
5. **Seguridad**: usa los guards/permisos existentes como en los controllers vecinos. No abras endpoints sin auth si los vecinos la exigen.
6. **Valida**: `npm run test:api`, `npm run lint`. Añade un `*.spec.ts` mínimo si tocas lógica.

## Cuándo usar esta skill
- BE-01 (endpoint mock de insights), BE-02 (servicio de concentración), y exponer cálculos de DATA-*.

## Cuándo NO usarla
- Para UI (frontend) o para el MCP. Para cambiar el esquema de datos (prohibido).

## Checklist de calidad
- [ ] Contrato (DTO/interface) definido en `libs/common` y reutilizado.
- [ ] Feature en `endpoints/<feature>/` registrado en `app.module.ts`.
- [ ] Pocos ficheros; patrón copiado de un módulo existente.
- [ ] Guards/permisos coherentes con los vecinos.
- [ ] Respuesta determinista; sin LLM real; sin consejo financiero personalizado.
- [ ] `npm run test:api` y `npm run lint` pasan. `git status`/`git diff`; sin commit/push.

## Límites de seguridad
- No toques `prisma/schema.prisma` ni migraciones. No `.env`, `docker/`, `nx.json`. Pide revisión humana en módulos compartidos.
