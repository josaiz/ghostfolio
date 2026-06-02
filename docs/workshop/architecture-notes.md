# Ghostfolio — Notas de arquitectura para agentes (workshop)

> Mapa breve y práctico para que los agentes de OpenCode trabajen sobre Ghostfolio sin perderse ni inventar rutas.
> Todas las rutas de esta página están **verificadas** contra el repo en la rama de soluciones.

## Stack

- **Monorepo Nx** (`nx.json`, `nx 22.x`). Proyecto por defecto: `api`.
- **Backend**: NestJS 11 → `apps/api/`.
- **Frontend**: Angular 21 + Angular Material + Bootstrap utilities → `apps/client/`.
- **Librerías compartidas**: `libs/common/` (interfaces, DTOs, enums, helpers) y `libs/ui/` (componentes UI reutilizables).
- **Datos**: PostgreSQL + Prisma 7 → `prisma/schema.prisma`. Redis para colas/caché.
- **Node** `>=22.18.0`. ESM disponible (el tooling de workshop usa `.mjs`).
- Arranque local: Docker build desde código (`scripts/start.sh|.ps1`, `scripts/rebuild.sh|.ps1`). App en `http://localhost:3333`.

## 1. Backend principal — `apps/api/`

Módulos NestJS por feature en `apps/api/src/app/<feature>/` (`*.module.ts`, `*.controller.ts`, `*.service.ts`).
Registrados en `apps/api/src/app/app.module.ts`.

Módulos relevantes verificados:

- `account/` → cuentas. `GET /api/v1/account`, `POST /api/v1/account`, `DELETE /api/v1/account/:id`.
- `activities/` → actividades (modelo `Order`). `GET/POST /api/v1/activities`, `DELETE /api/v1/activities[/:id]`.
- `import/` → importación. `POST /api/v1/import?dryRun=true|false`.
- `portfolio/` → cálculos de portfolio, performance, holdings.
- `auth/`, `user/` → autenticación por *security token* (`POST /api/v1/auth/anonymous` → JWT).
- `health/` → `GET /api/v1/health`.
- `endpoints/<feature>/` → convención más reciente para endpoints nuevos (p. ej. `endpoints/ai/`, `endpoints/watchlist/`).

> Para una feature nueva de insights, el patrón natural es **`apps/api/src/app/endpoints/portfolio-insights/`**
> (module + controller + service) registrado en `app.module.ts`. Es el patrón que siguen módulos recientes.

## 2. Frontend principal — `apps/client/`

- Páginas en `apps/client/src/app/pages/<page>/` (incluye `home/`, `portfolio/`, `demo/`, `accounts/`).
- Componentes en `apps/client/src/app/components/<component>/` (p. ej. `home-overview/`, `home-holdings/`,
  `portfolio-summary/`, `home-summary/`).
- Componentes UI reutilizables en `libs/ui/src/lib/<component>/` (existe incluso `assistant/`, `chart/`, `activities-table/`).
- Servicios cliente en `apps/client/src/app/services/`.

> Para un widget "Portfolio Insights" el patrón natural es un componente nuevo en
> `apps/client/src/app/components/portfolio-insights/`, consumido desde la página `home` o `portfolio`, y
> apoyado en patrones de `home-overview`/`portfolio-summary`.

## 3. Capa de datos / Prisma — `prisma/schema.prisma`

Modelos clave (verificados en `docs/workshop/data-seed-notes.md`):

- **`Account`**: `id`, `userId`, `name`, `currency`, `balance`, `comment`, `isExcluded`, `platformId`.
- **`Order`** (= actividad/transacción): `id`, `userId`, `accountId`, `comment`, `currency`, `date`, `fee`,
  `quantity`, `type` (`BUY`/`SELL`/`DIVIDEND`/`FEE`/`INTEREST`/`LIABILITY`), `unitPrice`, `symbolProfileId`.
- **`SymbolProfile`**: `dataSource`, `symbol`, `currency`, `name`, `assetClass`, `assetSubClass`.
- **`Tag`**, **`User`** (sin email/password local; usa `accessToken` hasheado).

DTOs compartidos: `libs/common/src/lib/dtos/create-account.dto.ts`, `.../create-order.dto.ts`.

## 4. Datos demo del workshop (fuente de verdad para insights)

```text
data/workshop/import/
  ghostfolio-workshop-main.csv                          # 54 actividades, 3 cuentas (dataset limpio)
  myinvestor-core-etf.csv / trade-republic-growth.csv / crypto-exchange.csv
  ghostfolio-workshop-anomalies-do-not-import-main.csv  # 6 filas con anomalías etiquetadas (NO importar)
```

Cabecera CSV: `Date,Code,Name,Action,Currency,Price,Quantity,Fee,DataSource,Account,Comment`.

Cuentas y perfil de riesgo del dataset (útil para insights):

- **MyInvestor Core ETF** (EUR): ETFs globales (VWCE.DE), S&P500 (SXR8.DE), small cap, bonos, EM, Europa. Diversificado.
- **Trade Republic Growth** (USD): NVDA, AAPL, MSFT, GOOGL, AMZN, ASML.AS → **concentración tech evidente**.
- **Crypto Exchange** (USD): BTC, ETH → **volatilidad alta**.

Anomalías etiquetadas en el CSV de anomalías: `exact-duplicate`, `high-fee`, `currency-mismatch`,
`price-outlier`, `oversell-risk`.

> Helper reutilizable ya existente: `tools/workshop/lib/workshop-data.mjs` (parser CSV robusto `parseCsvFile`,
> definición de `DATASET_FILES`, marcador `WORKSHOP_DEMO_DATA`, helpers de API). El MCP de demo lo reutiliza.

## 5. Scripts de Docker / build / datos

```text
scripts/start.sh|.ps1     scripts/stop.sh|.ps1     scripts/rebuild.sh|.ps1   scripts/reset.sh|.ps1
scripts/check.sh|.ps1     scripts/logs.sh|.ps1
scripts/seed-workshop-data.sh|.ps1                 scripts/reset-workshop-data.sh|.ps1
```

El seed usa la **API HTTP** de Ghostfolio (no escribe en PostgreSQL directamente) y marca cada actividad con
`WORKSHOP_DEMO_DATA` para ser idempotente. (Ver `docs/workshop/data-seed-notes.md`.)

## 6. Tests

- Jest por proyecto Nx. `npm run test:api`, `npm run test:common`, `npm run test:ui`.
- Lint: `npm run lint`. Formato: `npm run format` / `format:check` (Prettier + import sort).
- Tests unitarios junto al código: `*.spec.ts`.

## 7. Dónde encaja "Portfolio Insights Assistant"

- **Cálculo determinista de insights** (concentración por cuenta/símbolo, anomalías simples) → puede vivir como
  servicio backend (`endpoints/portfolio-insights/`) **o** como lógica del MCP de demo (read-only sobre CSV).
- **Visualización** → componente `portfolio-insights` en el cliente.
- **Datos** → dataset demo en `data/workshop/import/` (estable y reproducible, no toca datos reales).
- **Safety** → revisión de lenguaje para que los insights **no** sean consejo financiero personalizado.

La rama de soluciones implementa el camino **read-only por MCP** como happy path funcional (ver
`reference-implementation.md`); frontend/backend se entregan como **planes técnicos** generados por los commands.

## 8. Qué NO conviene tocar durante la sesión

- `.env`, `.env.dev`, `.env.example` y cualquier secreto.
- `prisma/schema.prisma` y `prisma/migrations/` (cambiar el esquema rompe el arranque/seed).
- `docker/`, `Dockerfile`, `scripts/` de arranque/reset (romperían el setup local).
- Datos reales de cualquier usuario. Solo trabajamos con el dataset demo marcado `WORKSHOP_DEMO_DATA`.
- Cambios masivos transversales (refactors globales, subir versiones de dependencias, tocar `nx.json`/`tsconfig.base.json`).
- El CSV de anomalías **no** se importa al portfolio demo principal.

## 9. Reglas de oro para agentes

1. Investiga y planifica antes de editar. Prefiere planes a cambios grandes.
2. Cambios pequeños y localizados; respeta patrones existentes (busca un módulo/componente análogo y cópialo).
3. `git status` + `git diff` antes y después.
4. Datos demo en **read-only** salvo el seed oficial.
5. Nada de consejo financiero personalizado en textos, prompts o respuestas.
