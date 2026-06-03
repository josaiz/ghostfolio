# Ghostfolio — Architecture notes for agents (workshop)

> A brief, practical map for OpenCode agents to work on Ghostfolio without getting lost or inventing paths.
> All paths on this page are **verified** against the repo on the solutions branch.

## Stack

- **Monorepo Nx** (`nx.json`, `nx 22.x`). Default project: `api`.
- **Backend**: NestJS 11 → `apps/api/`.
- **Frontend**: Angular 21 + Angular Material + Bootstrap utilities → `apps/client/`.
- **Shared libraries**: `libs/common/` (interfaces, DTOs, enums, helpers) and `libs/ui/` (reusable UI components).
- **Data**: PostgreSQL + Prisma 7 → `prisma/schema.prisma`. Redis for queues/cache.
- **Node** `>=22.18.0`. ESM available (workshop tooling uses `.mjs`).
- Local startup: Docker build from source (`scripts/start.sh|.ps1`, `scripts/rebuild.sh|.ps1`). App at `http://localhost:3333`.

## 1. Main backend — `apps/api/`

NestJS modules per feature in `apps/api/src/app/<feature>/` (`*.module.ts`, `*.controller.ts`, `*.service.ts`).
Registered in `apps/api/src/app/app.module.ts`.

Verified relevant modules:

- `account/` → accounts. `GET /api/v1/account`, `POST /api/v1/account`, `DELETE /api/v1/account/:id`.
- `activities/` → activities (`Order` model). `GET/POST /api/v1/activities`, `DELETE /api/v1/activities[/:id]`.
- `import/` → import. `POST /api/v1/import?dryRun=true|false`.
- `portfolio/` → portfolio calculations, performance, holdings.
- `auth/`, `user/` → authentication via *security token* (`POST /api/v1/auth/anonymous` → JWT).
- `health/` → `GET /api/v1/health`.
- `endpoints/<feature>/` → more recent convention for new endpoints (e.g. `endpoints/ai/`, `endpoints/watchlist/`).

> For a new insights feature, the natural pattern is **`apps/api/src/app/endpoints/portfolio-insights/`**
> (module + controller + service) registered in `app.module.ts`. This is the pattern followed by recent modules.

## 2. Main frontend — `apps/client/`

- Pages in `apps/client/src/app/pages/<page>/` (includes `home/`, `portfolio/`, `demo/`, `accounts/`).
- Components in `apps/client/src/app/components/<component>/` (e.g. `home-overview/`, `home-holdings/`,
  `portfolio-summary/`, `home-summary/`).
- Reusable UI components in `libs/ui/src/lib/<component>/` (includes `assistant/`, `chart/`, `activities-table/`).
- Client services in `apps/client/src/app/services/`.

> For a "Portfolio Insights" widget the natural pattern is a new component in
> `apps/client/src/app/components/portfolio-insights/`, consumed from the `home` or `portfolio` page, and
> built on patterns from `home-overview`/`portfolio-summary`.

## 3. Data layer / Prisma — `prisma/schema.prisma`

Key models (verified in `docs/workshop/data-seed-notes.md`):

- **`Account`**: `id`, `userId`, `name`, `currency`, `balance`, `comment`, `isExcluded`, `platformId`.
- **`Order`** (= activity/transaction): `id`, `userId`, `accountId`, `comment`, `currency`, `date`, `fee`,
  `quantity`, `type` (`BUY`/`SELL`/`DIVIDEND`/`FEE`/`INTEREST`/`LIABILITY`), `unitPrice`, `symbolProfileId`.
- **`SymbolProfile`**: `dataSource`, `symbol`, `currency`, `name`, `assetClass`, `assetSubClass`.
- **`Tag`**, **`User`** (no local email/password; uses hashed `accessToken`).

Shared DTOs: `libs/common/src/lib/dtos/create-account.dto.ts`, `.../create-order.dto.ts`.

## 4. Workshop demo data (source of truth for insights)

```text
data/workshop/import/
  ghostfolio-workshop-main.csv                          # 54 activities, 3 accounts (clean dataset)
  myinvestor-core-etf.csv / trade-republic-growth.csv / crypto-exchange.csv
  ghostfolio-workshop-anomalies-do-not-import-main.csv  # 6 rows with labelled anomalies (DO NOT import)
```

CSV header: `Date,Code,Name,Action,Currency,Price,Quantity,Fee,DataSource,Account,Comment`.

Accounts and risk profile of the dataset (useful for insights):

- **MyInvestor Core ETF** (EUR): global ETFs (VWCE.DE), S&P500 (SXR8.DE), small cap, bonds, EM, Europe. Diversified.
- **Trade Republic Growth** (USD): NVDA, AAPL, MSFT, GOOGL, AMZN, ASML.AS → **clear tech concentration**.
- **Crypto Exchange** (USD): BTC, ETH → **high volatility**.

Anomalies labelled in the anomalies CSV: `exact-duplicate`, `high-fee`, `currency-mismatch`,
`price-outlier`, `oversell-risk`.

> Existing reusable helper: `tools/workshop/lib/workshop-data.mjs` (robust CSV parser `parseCsvFile`,
> `DATASET_FILES` definition, `WORKSHOP_DEMO_DATA` marker, API helpers). The demo MCP reuses it.

## 5. Docker / build / data scripts

```text
scripts/start.sh|.ps1     scripts/stop.sh|.ps1     scripts/rebuild.sh|.ps1   scripts/reset.sh|.ps1
scripts/check.sh|.ps1     scripts/logs.sh|.ps1
scripts/seed-workshop-data.sh|.ps1                 scripts/reset-workshop-data.sh|.ps1
```

The seed uses the Ghostfolio **HTTP API** (does not write directly to PostgreSQL) and marks each activity with
`WORKSHOP_DEMO_DATA` to be idempotent. (See `docs/workshop/data-seed-notes.md`.)

## 6. Tests

- Jest per Nx project. `npm run test:api`, `npm run test:common`, `npm run test:ui`.
- Lint: `npm run lint`. Format: `npm run format` / `format:check` (Prettier + import sort).
- Unit tests alongside code: `*.spec.ts`.

## 7. Where "Portfolio Insights Assistant" fits

- **Deterministic insights calculation** (concentration by account/symbol, simple anomalies) → can live as a
  backend service (`endpoints/portfolio-insights/`) **or** as demo MCP logic (read-only over CSV).
- **Visualisation** → `portfolio-insights` component in the client.
- **Data** → demo dataset in `data/workshop/import/` (stable and reproducible, does not touch real data).
- **Safety** → language review to ensure insights are **not** personalised financial advice.

The solutions branch implements the **read-only via MCP** path as the functional happy path (see
`reference-implementation.md`); frontend/backend are delivered as **technical plans** generated by the commands.

## 8. What NOT to touch during the session

- `.env`, `.env.dev`, `.env.example` and any secrets.
- `prisma/schema.prisma` and `prisma/migrations/` (changing the schema breaks startup/seed).
- `docker/`, `Dockerfile`, startup/reset `scripts/` (would break the local setup).
- Real data from any user. We only work with the demo dataset marked `WORKSHOP_DEMO_DATA`.
- Large cross-cutting changes (global refactors, upgrading dependency versions, touching `nx.json`/`tsconfig.base.json`).
- The anomalies CSV is **not** imported into the main demo portfolio.

## 9. Golden rules for agents

1. Investigate and plan before editing. Prefer plans over large changes.
2. Small, localised changes; respect existing patterns (find an analogous module/component and copy it).
3. `git status` + `git diff` before and after.
4. Demo data in **read-only** mode except for the official seed.
5. No personalised financial advice in texts, prompts, or responses.
