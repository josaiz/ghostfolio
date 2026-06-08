# Technical Contract — Portfolio Insights (Phase 2)

> **Single source of truth** for Phase 2 tasks (P2-BE-01/02 and P2-FE-01/02) and for the commands
> `/workshop-implement-backend-slice` and `/workshop-implement-frontend-slice`. Backend and frontend implement **against
> this contract** to avoid diverging. This is **planning/definition**: the code is written when executing the impl tasks.

Product objective: a deterministic endpoint that returns demo portfolio insights and a UI widget that
displays them. No LLM. No personalised financial advice (description only).

## 1. Endpoint

- **Route**: `GET /api/v1/portfolio-insights`
- **Access**: **public** (no guard), same as the `@Get()` root of `apps/api/src/app/endpoints/benchmarks/`.
  (The `/api/v1` prefix is inherited from `setGlobalPrefix('api')` + `enableVersioning` in `apps/api/src/main.ts`; copy the
  `@Controller(...)` decorator from an existing endpoint to inherit it.)
- **Data source**: **deterministic constant payload** defined in the service. **Do not** read CSV or DB at runtime
  (the CSVs in `data/workshop/import/` **are not** included in the Docker image).

## 2. Data contract (libs/common)

`libs/common/src/lib/interfaces/portfolio-insights.interface.ts` (NEW):
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
```

`libs/common/src/lib/interfaces/responses/portfolio-insights-response.interface.ts` (NEW):
```ts
import type { PortfolioInsights } from '../portfolio-insights.interface';

export interface PortfolioInsightsResponse {
  insights: PortfolioInsights;
}
```

Export in the barrel `libs/common/src/lib/interfaces/index.ts` (EDIT, +2 import lines + 2 in the `export` block),
following the pattern of `BenchmarkResponse` (which lives in `./responses/...`).

## 3. Deterministic payload (real figures from the demo dataset)

The service always returns this (consistent with `/workshop-analyze-demo-portfolio` and Phase 1):
```json
{
  "insights": {
    "disclaimer": "Descriptive and educational information, not financial advice. Workshop demo data.",
    "source": "data/workshop/import/ghostfolio-workshop-main.csv",
    "accounts": [
      { "name": "MyInvestor Core ETF", "currencies": ["EUR"], "topConcentration": { "symbol": "VWCE.DE", "costSharePct": 39.5 } },
      { "name": "Trade Republic Growth", "currencies": ["EUR", "USD"], "topConcentration": { "symbol": "AAPL", "costSharePct": 26.2 } },
      { "name": "Crypto Exchange", "currencies": ["USD"], "topConcentration": { "symbol": "BTC-USD", "costSharePct": 60.8 } }
    ],
    "anomalies": [
      { "type": "oversell-risk", "severity": "high", "count": 1 },
      { "type": "exact-duplicate", "severity": "medium", "count": 1 },
      { "type": "currency-mismatch", "severity": "medium", "count": 1 },
      { "type": "price-outlier", "severity": "medium", "count": 1 },
      { "type": "high-fee", "severity": "low", "count": 1 }
    ]
  }
}
```

## 4. Backend — files to create (pattern `endpoints/benchmarks/`)

```
apps/api/src/app/endpoints/portfolio-insights/
  portfolio-insights.service.ts      # @Injectable() pure; getInsights(): PortfolioInsights (constant payload)
  portfolio-insights.controller.ts   # @Controller('portfolio-insights'); @Get() public -> { insights }
  portfolio-insights.module.ts       # @Module({ controllers:[...], providers:[PortfolioInsightsService] })
  portfolio-insights.service.spec.ts # (optional) "should be defined" + 3 accounts
```
Backend wiring (EDIT): `apps/api/src/app/app.module.ts` → `import { PortfolioInsightsModule } from './endpoints/portfolio-insights/portfolio-insights.module';` and add `PortfolioInsightsModule,` to the `imports:` array.

Controller skeleton:
```ts
import { Controller, Get } from '@nestjs/common';
import type { PortfolioInsightsResponse } from '@ghostfolio/common/interfaces';
import { PortfolioInsightsService } from './portfolio-insights.service';

@Controller('portfolio-insights')
export class PortfolioInsightsController {
  public constructor(private readonly service: PortfolioInsightsService) {}

  @Get()
  public getPortfolioInsights(): PortfolioInsightsResponse {
    return { insights: this.service.getInsights() };
  }
}
```

## 5. Frontend — files to create (pattern `components/home-overview/`)

```
apps/client/src/app/components/portfolio-insights/
  portfolio-insights.component.ts    # standalone, OnPush, selector 'gf-portfolio-insights', inject(DataService)
  portfolio-insights.html            # PLAIN text (no $localize): accounts + topConcentration + anomalies + disclaimer
  portfolio-insights.scss
```
- Data: add to `libs/ui/src/lib/services/data.service.ts` (EDIT) the method
  `fetchPortfolioInsights() { return this.http.get<PortfolioInsightsResponse>('/api/v1/portfolio-insights'); }`
  and `PortfolioInsightsResponse` to the import from `@ghostfolio/common/interfaces`. (The token is added by `auth.interceptor.ts`.)
- **Inline mounting** (EDIT): in `apps/client/src/app/components/home-overview/home-overview.component.ts` import
  `GfPortfolioInsightsComponent` and add it to the `imports` array; in `home-overview.html`, inside the `@else`
  block (the dashboard one with data), add `<gf-portfolio-insights />` after the `overview-container` row.

Component skeleton:
```ts
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '@ghostfolio/ui/services';
import type { PortfolioInsights } from '@ghostfolio/common/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
  selector: 'gf-portfolio-insights',
  styleUrls: ['./portfolio-insights.scss'],
  templateUrl: './portfolio-insights.html'
})
export class GfPortfolioInsightsComponent implements OnInit {
  protected readonly insights = signal<PortfolioInsights | null>(null);
  private readonly dataService = inject(DataService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit() {
    this.dataService
      .fetchPortfolioInsights()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ insights }) => this.insights.set(insights));
  }
}
```

## 6. Gotchas (decisions that prevent breaking the build)

- **CSV is not in Docker** → the service uses a **constant** payload, it does not read files at runtime.
- **i18n** → the widget uses **plain text** (no `$localize`/`i18n`). ESLint does not require it and this way `build:production`
  (which localises 12 languages, and is what Docker runs) does not require touching the `.xlf` files.
- **Routes** → do not hard-code `/api/v1`; copy the `@Controller` decorator from an existing endpoint.
- **nx boundaries** → import interfaces from the barrel `@ghostfolio/common/interfaces` (that is why `index.ts` is edited).
- **No financial advice** → the widget texts are descriptive (shares, number of anomalies); run them through `/workshop-review-financial-safety`.

## 7. End-to-end verification (when executing the impl tasks)

```bash
npx nx run api:build --configuration=development        # API compiles with the endpoint
npx nx run client:build:development-en                  # client compiles with the component
npm run build:production                                # simulates Docker/i18n (no changes to .xlf)
npm run format && npm run lint                          # quality / pre-commit green
./scripts/rebuild.sh                                    # Docker; http://localhost:3333 -> login -> Home/Analytics
curl -s http://localhost:3333/api/v1/portfolio-insights # deterministic JSON (3 accounts + 5 anomalies)
```
Criterion: the "Portfolio Insights" widget is visible in Home/Analytics and the endpoint returns the JSON from section 3.
No `git commit`/`push`.
