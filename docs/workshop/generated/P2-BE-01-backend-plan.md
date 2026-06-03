# P2-BE-01 — Backend plan: Mocked portfolio insights endpoint

## Scope

Backlog card located as **BE-01 — Mocked portfolio insights endpoint** in `docs/workshop/whiteboard-backlog.md`.

Goal: expose a deterministic demo summary for the frontend. This is **not** an LLM feature and must not provide personalised financial advice. The endpoint returns descriptive, educational observations over the workshop demo dataset.

## Analogue module to follow

Primary analogue: `apps/api/src/app/endpoints/watchlist/`

- `watchlist.controller.ts`: uses `@Controller('<feature>')`, `@Get()`, `AuthGuard('jwt')`, `HasPermissionGuard`, and a shared response interface from `@ghostfolio/common/interfaces`.
- `watchlist.module.ts`: small endpoint module with controller + service, registered in `apps/api/src/app/app.module.ts`.
- `watchlist.service.ts`: feature-specific service returning a typed response.

Secondary reference: `apps/api/src/app/endpoints/ai/ai.controller.ts` for the current `readAiPrompt` permission pattern. The new feature must **not** call `AiService.generateText()` or any OpenRouter/LLM code.

## Contract first: shared response interface

Create the response contract before the NestJS implementation:

`libs/common/src/lib/interfaces/responses/portfolio-insights-response.interface.ts`

```ts
export interface PortfolioInsightsResponse {
  generatedFrom: string;
  disclaimer: string;
  concentrationNote: string;
  totals: {
    accounts: number;
    activities: number;
    symbols: number;
  };
  accounts: PortfolioInsightsAccount[];
  insights: PortfolioInsight[];
  anomalies: {
    scannedActivities: number;
    findingCount: number;
    byType: Partial<Record<PortfolioInsightAnomalyType, number>>;
  };
}

export interface PortfolioInsightsAccount {
  name: string;
  currencies: string[];
  activityCount: number;
  symbolCount: number;
  totalInvestedCostNominal: number;
  investedByCurrency: Record<string, number>;
  topConcentration: {
    symbol: string;
    costSharePct: number;
  };
}

export interface PortfolioInsight {
  id: string;
  severity: 'info' | 'notice';
  title: string;
  description: string;
  evidence: string[];
}

export type PortfolioInsightAnomalyType =
  | 'exact-duplicate'
  | 'high-fee'
  | 'currency-mismatch'
  | 'price-outlier'
  | 'oversell-risk';
```

Edit `libs/common/src/lib/interfaces/index.ts` to import/export `PortfolioInsightsResponse` and related types, matching the current common interface export style.

### Example response shape

The service can return deterministic values matching the demo summary:

- totals: `3` accounts, `54` activities, `14` symbols.
- account summaries:
  - `MyInvestor Core ETF`: top concentration `VWCE.DE` at `39.5%` of nominal invested cost.
  - `Trade Republic Growth`: top concentration `AAPL` at `26.2%` of nominal invested cost; top three cost shares AAPL/MSFT/NVDA sum to `67.7%`.
  - `Crypto Exchange`: top concentration `BTC-USD` at `60.8%` of nominal invested cost.
- anomaly summary from the anomaly demo source: `5` findings, one per type (`exact-duplicate`, `high-fee`, `currency-mismatch`, `price-outlier`, `oversell-risk`).

All visible text must be descriptive, for example: “The account Trade Republic Growth has AAPL as its largest nominal cost share (26.2%).” Avoid “buy”, “sell”, “hold”, “rebalance”, “should”, or predictions.

## Endpoint proposal

- Method: `GET`
- Route: `/api/v1/portfolio-insights/demo`
- Nest controller decorator path: `@Controller('portfolio-insights')` with `@Get('demo')`
- Response type: `Promise<PortfolioInsightsResponse>`

Rationale: `portfolio-insights` is explicit and keeps the endpoint separate from production `portfolio` calculations. The `demo` suffix makes the deterministic workshop scope visible.

## Backend files and registration

Create a small endpoint module:

```text
apps/api/src/app/endpoints/portfolio-insights/
  portfolio-insights.controller.ts
  portfolio-insights.module.ts
  portfolio-insights.service.ts
  portfolio-insights.service.spec.ts   # recommended if implementation is requested
```

Register in `apps/api/src/app/app.module.ts`:

- import `PortfolioInsightsModule` from `./endpoints/portfolio-insights/portfolio-insights.module`.
- add `PortfolioInsightsModule` to the `imports` array near the other `endpoints/*` modules.

## Deterministic data origin

Preferred for BE-01: a fixed mock response in `PortfolioInsightsService` derived from the workshop demo CSV/MCP figures.

- Source reference: `data/workshop/import/ghostfolio-workshop-main.csv` for account/holding/concentration summary.
- Optional anomaly source reference: `data/workshop/import/ghostfolio-workshop-anomalies-do-not-import-main.csv` for the anomaly count/type summary.
- Validation reference: MCP tools `get_demo_portfolio_summary` and `detect_demo_anomalies`.

Do **not** call a real LLM, OpenRouter, `AiService.generateText()`, external APIs, Prisma writes, or raw SQL. For this mocked endpoint, avoid runtime CSV parsing unless the team explicitly wants a non-mock BE-02-style calculation.

## Auth, guards and permissions

Follow the authenticated endpoint pattern:

```ts
@Get('demo')
@HasPermission(permissions.readAiPrompt)
@UseGuards(AuthGuard('jwt'), HasPermissionGuard)
```

Why `readAiPrompt`: it already exists, is available to `ADMIN`, `USER`, and `DEMO` roles, and fits the workshop assistant/insights read use case without changing the shared permissions model. If the product later needs a dedicated permission (for example `readPortfolioInsights`), that should be a separate reviewed change because it touches `libs/common/src/lib/permissions.ts` and role grants.

Authentication: same JWT flow as other Ghostfolio API endpoints. Demo users authenticate through existing auth flows, then call `/api/v1/portfolio-insights/demo` with `Authorization: Bearer <jwt>`.

No impersonation support is planned for BE-01 because the response is a fixed demo summary, not user-specific data.

## Implementation outline, if requested later

1. Add the shared response interface and export it from `libs/common/src/lib/interfaces/index.ts`.
2. Add `PortfolioInsightsService.getDemoInsights(): PortfolioInsightsResponse` returning a constant object.
3. Add `PortfolioInsightsController.getDemoInsights()` using JWT + permission guards.
4. Add `PortfolioInsightsModule` with controller and provider only; no Prisma module required for a static deterministic mock.
5. Register the module in `app.module.ts`.
6. Add a minimal unit spec asserting totals, route service output, disclaimer presence, and absence of action verbs in insight descriptions.

## Validation

Run after implementation:

```bash
npm run test:api
npm run lint
```

Recommended focused checks:

- Unit test: `PortfolioInsightsService` returns exactly `3` accounts, `54` activities, `14` symbols.
- Unit test: response contains the disclaimer “información descriptiva y educativa, no asesoramiento financiero” or equivalent English copy.
- Safety check: visible strings contain no buy/sell/hold/rebalance recommendations or price predictions.
- Manual smoke: authenticated `GET /api/v1/portfolio-insights/demo` returns `200` and matches `PortfolioInsightsResponse`.

## Minimal file list

Create:

- `libs/common/src/lib/interfaces/responses/portfolio-insights-response.interface.ts`
- `apps/api/src/app/endpoints/portfolio-insights/portfolio-insights.module.ts`
- `apps/api/src/app/endpoints/portfolio-insights/portfolio-insights.controller.ts`
- `apps/api/src/app/endpoints/portfolio-insights/portfolio-insights.service.ts`
- `apps/api/src/app/endpoints/portfolio-insights/portfolio-insights.service.spec.ts` (recommended)

Edit:

- `libs/common/src/lib/interfaces/index.ts`
- `apps/api/src/app/app.module.ts`

Do not edit:

- `prisma/schema.prisma`
- `prisma/migrations/`
- `.env*`
- `docker/`, `Dockerfile`, `nx.json`, `tsconfig.base.json`

## Risks and mitigations

- **Risk: response text looks like financial advice.** Mitigation: use descriptive evidence-only wording and run the financial safety checklist before exposing text in UI.
- **Risk: adding a new permission becomes cross-cutting.** Mitigation: initially reuse `permissions.readAiPrompt`; defer a dedicated permission to a reviewed product/security change.
- **Risk: runtime CSV path breaks in Docker/build output.** Mitigation: for BE-01 keep a constant deterministic mock response; use MCP figures as validation, not runtime dependency.
- **Risk: frontend assumes this endpoint reflects real user portfolios.** Mitigation: route includes `/demo`, response includes `generatedFrom` and disclaimer.
- **Risk: LLM coupling via existing `AiModule`.** Mitigation: create a separate `portfolio-insights` module and do not import `AiModule` or AI SDK providers.

## Financial safety self-review

Veredicto: PASS

Hallazgos:

- No recommendations to buy, sell, hold, or rebalance.
- No personalised instruction to a user.
- No return, price, or performance predictions.

Checklist:

1. Recommendation of action → OK
2. Personalisation → OK
3. Prediction → OK
4. Promise → OK
5. Simulation of advisor → OK
6. Suitability judgement → OK
7. Disclaimer → OK
