# P2-FE-01 — Frontend plan: “Portfolio Insights” widget

## Backlog card

Card located in `docs/workshop/whiteboard-backlog-phase2.md` as **P2-FE-01 — Plan: widget Portfolio Insights**.

Functional goal: show a visible panel with deterministic demo portfolio insights: concentration by account/symbol and a simple anomaly summary. This is descriptive UI only; it must not provide personalised financial advice.

## Current repo state checked before planning

`git status --short` shows existing backend/common work in progress:

- `apps/api/src/app/app.module.ts`
- `apps/api/src/app/endpoints/portfolio-insights/`
- `libs/common/src/lib/interfaces/index.ts`
- `libs/common/src/lib/interfaces/portfolio-insights.interface.ts`
- `libs/common/src/lib/interfaces/responses/portfolio-insights-response.interface.ts`
- `docs/workshop/generated/P2-BE-01-backend-plan.md`
- `docs/workshop/generated/P2-BE-02-slice.md`

This frontend plan assumes that backend/common work is either completed or replaced by an equivalent deterministic mock. Do not overwrite unrelated in-progress changes.

## Angular/Nx pattern to follow

Primary analogue: `apps/client/src/app/components/home-overview/`

- Standalone Angular component with `@Component({ changeDetection: ChangeDetectionStrategy.OnPush, imports: [...], selector: 'gf-home-overview' })`.
- Uses `signal`, `computed`, `inject(DataService)`, `inject(DestroyRef)` and `takeUntilDestroyed` for API subscriptions.
- Consumes typed interfaces from `@ghostfolio/common/interfaces` and shared UI services from `@ghostfolio/ui/services`.
- Mounted on the home root route via `apps/client/src/app/pages/home/home-page.routes.ts`.

Secondary analogue: `apps/client/src/app/components/portfolio-summary/`

- Compact, row-based summary widget with Bootstrap utilities and small component-local SCSS.
- Uses `gf-value` for formatted numeric/percentage values where useful.

The new widget should copy these patterns: standalone component, `OnPush`, no new dependencies, local SCSS, and plain text UI copy. Do not add `$localize` or `i18n` markers for this workshop slice because the Phase 2 contract avoids touching translation files.

## Component to create

Create:

```text
apps/client/src/app/components/portfolio-insights/
  portfolio-insights.component.ts
  portfolio-insights.html
  portfolio-insights.scss
```

Component name and selector:

- Class: `GfPortfolioInsightsComponent`
- Selector: `gf-portfolio-insights`

Recommended imports:

- Angular: `ChangeDetectionStrategy`, `Component`, `DestroyRef`, `inject`, `signal`.
- RxJS interop: `takeUntilDestroyed`.
- UI/Material already in repo: `MatButtonModule` only if a retry action is implemented; otherwise prefer plain Bootstrap utility classes and existing `GfValueComponent` for percentages.
- Shared contract: `PortfolioInsightsResponse` from `@ghostfolio/common/interfaces`.

## Inputs / outputs

Preferred FE-01 implementation: a small “smart” widget that fetches its own deterministic data.

- Inputs: none.
- Outputs: none.
- Internal signal state:
  - `insights = signal<PortfolioInsightsResponse | null>(null)`
  - `isLoading = signal(true)`
  - `error = signal<string | null>(null)`

Rationale: `home-overview` already fetches its own portfolio performance from `DataService`; following that pattern keeps the host change minimal and avoids threading data through the home page.

Optional future variant, if the team wants a purely presentational component:

- `@Input() insights: PortfolioInsightsResponse | null`
- `@Input() isLoading = false`
- `@Output() retry = new EventEmitter<void>()`

Do not implement the presentational split for FE-01 unless scope grows; it adds files/host wiring.

## Data contract consumed

Primary data source: deterministic P2-BE-02 endpoint.

- Method: `GET`
- URL: `/api/v1/portfolio-insights`
- Client method to add: `DataService.fetchPortfolioInsights(): Observable<PortfolioInsightsResponse>`
- No real LLM, no external API, no user-specific calculation.

Expected response contract, aligned with `docs/workshop/portfolio-insights-feature.md` and the P2-BE-02 implementation:

```ts
export interface PortfolioInsights {
  disclaimer: string;
  source: string;
  accounts: {
    name: string;
    currencies: string[];
    topConcentration: { symbol: string; costSharePct: number };
  }[];
  anomalies: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    count: number;
  }[];
}

export interface PortfolioInsightsResponse {
  insights: PortfolioInsights;
}
```

Important display fields for FE-01:

- `insights.accounts.length`
- `insights.accounts[].name`
- `insights.accounts[].topConcentration.symbol`
- `insights.accounts[].topConcentration.costSharePct`
- `insights.anomalies.length`
- `insights.anomalies[].type`, `severity`, `count`
- `insights.disclaimer`

Fallback if P2-BE-02 is not implemented when FE-01 is built: keep a local deterministic mock constant inside `portfolio-insights.component.ts` typed as `PortfolioInsightsResponse`, with the exact shape from `docs/workshop/portfolio-insights-feature.md`. Mark it clearly as workshop demo data. Prefer the endpoint once available.

## Host / mount point / navigation

Mount the widget on the existing Home overview screen, not as a new global route.

Edit:

```text
apps/client/src/app/components/home-overview/home-overview.component.ts
apps/client/src/app/components/home-overview/home-overview.html
```

Planned host change:

- Import `GfPortfolioInsightsComponent` into `GfHomeOverviewComponent.imports`.
- Render `<gf-portfolio-insights />` in `home-overview.html` below the existing `<gf-portfolio-performance />` block, visible only in the normal overview branch (not in the first-run “Welcome to Ghostfolio” introduction branch).

Navigation:

- Existing path: Home tab / overview root.
- Existing route: `apps/client/src/app/pages/home/home-page.routes.ts`, child path `''` renders `GfHomeOverviewComponent`.
- No new tab, no global routing changes, no changes to `internalRoutes`.

Why this mount point: it satisfies “visible widget” with the fewest frontend edits and follows the `home-overview` pattern from the card hint.

## Proposed UI content and layout

Compact panel:

1. Header: “Portfolio Insights”
2. Subheader/disclaimer: “Demo data only. Descriptive observations, not financial advice.”
3. Summary row: “3 accounts · 5 anomaly types”
4. Concentration section with up to three account rows:
   - “MyInvestor Core ETF: largest nominal cost share is VWCE.DE (39.5%).”
   - “Trade Republic Growth: largest nominal cost share is AAPL (26.2%).”
   - “Crypto Exchange: largest nominal cost share is BTC-USD (60.8%).”
5. Anomalies section:
   - “Demo anomaly scan: 5 anomaly types across the workshop scenarios.”
6. Compact anomaly rows from `insights.anomalies`, capped to avoid a long panel.

All percentages should be displayed as descriptive figures. Avoid terms like “should”, “buy”, “sell”, “hold”, “rebalance”, “recommended”, or predictions.

## UI texts proposed for safety review

These texts must be passed through `/workshop-review-financial-safety` before implementation/demo:

- “Portfolio Insights”
- “Demo data only. Descriptive observations, not financial advice.”
- “Largest nominal cost share”
- “The account {accountName} has {symbol} as its largest nominal cost share ({percentage}%).”
- “Demo anomaly scan: {count} anomaly types across the workshop anomaly scenarios.”
- “Generated from deterministic workshop data.”
- “Unable to load demo insights. Please try again.”

Expected safety stance: descriptive and educational; no personalised action, no suitability judgement, no prediction.

## Minimal files to create/edit

Create:

| Path | Why |
| --- | --- |
| `apps/client/src/app/components/portfolio-insights/portfolio-insights.component.ts` | Standalone widget, fetches deterministic insights, manages loading/error signals. |
| `apps/client/src/app/components/portfolio-insights/portfolio-insights.html` | Compact summary panel with account count, concentration and anomaly count. |
| `apps/client/src/app/components/portfolio-insights/portfolio-insights.scss` | Local layout only; no global theming. |

Edit:

| Path | Why |
| --- | --- |
| `libs/ui/src/lib/services/data.service.ts` | Add `fetchPortfolioInsights()` using `HttpClient.get<PortfolioInsightsResponse>('/api/v1/portfolio-insights')`. |
| `apps/client/src/app/components/home-overview/home-overview.component.ts` | Import `GfPortfolioInsightsComponent` into the standalone component imports. |
| `apps/client/src/app/components/home-overview/home-overview.html` | Mount `<gf-portfolio-insights />` below the performance summary in the overview branch. |

Conditional only if the P2-BE-02/common contract is not already present:

| Path | Why |
| --- | --- |
| `libs/common/src/lib/interfaces/responses/portfolio-insights-response.interface.ts` | Shared response type. Prefer P2-BE-02 to own this. |
| `libs/common/src/lib/interfaces/index.ts` | Export the shared response type. Prefer P2-BE-02 to own this. |

Do not edit:

- `nx.json`
- `tsconfig.base.json`
- global routing/theming
- `.env*`
- Prisma schema/migrations
- Docker/startup scripts

## Implementation outline, if requested later

1. Confirm backend/common contract status and avoid duplicating in-progress P2-BE-02 files.
2. Add `PortfolioInsightsResponse` import to `DataService` and implement `fetchPortfolioInsights()` near other read-only fetch methods.
3. Create `GfPortfolioInsightsComponent` with `OnPush`, signals and `takeUntilDestroyed`.
4. Template: use `@if`/`@for`, Bootstrap utilities, optional `gf-value` for percentages.
5. Add the component to `GfHomeOverviewComponent.imports` and render it in the non-introduction branch.
6. Run financial safety review on UI text before demo.

## Validation steps

After implementation:

```bash
npm run lint
npx nx run client:build:development-en
```

If the project uses a different client build target locally, run the equivalent Nx client build listed by `nx show project client`.

Manual visual review:

- Start the app and navigate to the Home overview screen.
- Confirm the widget appears below the existing performance summary.
- Confirm loading, success and API-error states are readable.
- Confirm figures match the deterministic BE/MCP values exposed by the endpoint: `3` accounts and `5` anomaly types.
- Confirm the panel remains compact on mobile.
- Run `/workshop-review-financial-safety` on the final visible texts and require PASS.

## Risks and mitigations

- **Risk: financial advice wording.** Use evidence-only copy and safety review before demo.
- **Risk: endpoint not ready.** Use a typed deterministic mock only as a temporary fallback; keep the same `PortfolioInsightsResponse` shape.
- **Risk: over-scoping into a new route/tab.** Mount inside `home-overview`; do not change `internalRoutes`.
- **Risk: conflicting backend/common in-progress files.** Inspect `git status` and existing common interfaces before editing.

## Decision summary

Plan: create `apps/client/src/app/components/portfolio-insights/` and mount it inside `GfHomeOverviewComponent`. Consume `/api/v1/portfolio-insights` through `DataService.fetchPortfolioInsights()` using the shared `PortfolioInsightsResponse` contract. Keep UI descriptive, deterministic and local to the Home overview.
