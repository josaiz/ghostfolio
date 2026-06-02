---
name: prisma-readonly-data-access
description: Acceder a datos de Ghostfolio de forma SOLO LECTURA y segura. Entender el schema Prisma, preferir servicios/API existentes o el MCP CSV demo, y nunca modificar esquema ni datos. Úsala al diseñar consultas o decidir la fuente de datos.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Acceso a datos read-only en Ghostfolio (workshop)

Cómo leer datos sin riesgo. La regla número uno: **no se modifica el esquema ni los datos**.

## Modelos (en `prisma/schema.prisma`)
- `Account` (`id`, `userId`, `name`, `currency`, `balance`, `comment`, `isExcluded`, `platformId`).
- `Order` = actividad (`type`, `date`, `quantity`, `unitPrice`, `fee`, `currency`, `accountId`, `symbolProfileId`).
- `SymbolProfile` (`symbol`, `name`, `dataSource`, `assetClass`, `assetSubClass`).
- `Tag`, `User` (sin email/password local; `accessToken` hasheado).

## Jerarquía de fuentes de datos (de más a menos preferente en el workshop)
1. **MCP `ghostfolio-demo-data`** (lee CSV demo, read-only, reproducible) → primera opción para insights demo.
2. **API HTTP existente** (`GET /api/v1/account`, `GET /api/v1/activities`) con JWT del security token → para datos vivos.
3. **Servicios Prisma existentes** (`account.service.ts`, `activities.service.ts`) si trabajas dentro del backend.
4. Acceso Prisma directo **solo lectura** (`findMany`/`findUnique`/`aggregate`/`count`) como último recurso.

Nunca: `create`/`update`/`delete`/`upsert`/`executeRaw` de escritura, ni `prisma migrate`/`db push`.

## Patrones de consulta read-only útiles
- Holdings por cuenta: agrupar `Order` por `accountId` + `symbol`, sumar `quantity` con signo según `type`.
- Exposición por símbolo: coste = `Σ(BUY qty·price) − Σ(SELL qty·price)`.
- Anomalías: trabajar sobre el CSV de anomalías (no importado) vía el MCP.

## Cuándo usar esta skill
- BE-02, DATA-01/02, y siempre que haya que decidir "¿de dónde saco estos datos sin romper nada?".

## Cuándo NO usarla
- Para crear endpoints (eso es `nestjs-api-development`) o razonar sobre el significado (es `ghostfolio-domain-analysis`).

## Checklist de calidad
- [ ] La operación es estrictamente de lectura.
- [ ] Se eligió la fuente más reproducible (CSV/MCP) cuando es posible.
- [ ] No se toca `schema.prisma` ni migraciones.
- [ ] Solo dataset demo; no datos reales de usuarios.
- [ ] Se distingue coste invertido de valor de mercado.

## Límites de seguridad
- Cualquier necesidad de escribir/migrar → **rechazar** y proponer alternativa read-only o vía seed oficial.
- No imprimas secretos ni cadenas de conexión. No toques `.env`.
