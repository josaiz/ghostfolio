# FE-01 — Implementation plan: "Portfolio Insights" widget

> **Example output** from `/workshop-plan-frontend-card FE-01` (agent `frontend-angular-agent` + skill
> `angular-nx-development`). Generated as a sample for teams: your actual output may vary. This is a **plan**,
> not applied code.

## Functional objective
Display in the UI a "Portfolio Insights" panel that summarises, in a **descriptive** way, the concentration per account/symbol
and the number of anomalies in the demo portfolio. No recommendations.

## Analogous pattern to follow (verified)
`apps/client/src/app/components/home-overview/` — Angular 21 **standalone** component:
- Files: `home-overview.component.ts` + `home-overview.html` + `home-overview.scss`.
- `@Component({ changeDetection: ChangeDetectionStrategy.OnPush, imports: [...], selector: 'gf-home-overview' })`.
- State with **signals** (`signal`, `computed`); data via `inject(DataService)` from `@ghostfolio/ui/services`;
  `takeUntilDestroyed(inject(DestroyRef))` for subscriptions; i18n with `$localize`.
- Shared interfaces from the barrel `@ghostfolio/common/interfaces`.

The widget will replicate this pattern exactly (standalone + OnPush + signals + i18n).

## Data contract (from FND-02)
Create the interface in `libs/common/src/lib/interfaces/portfolio-insights.interface.ts` and export it in
`libs/common/src/lib/interfaces/index.ts` (barrel), following the style of existing interfaces:

```ts
export interface PortfolioInsights {
  generatedAt: string;
  disclaimer: string;
  accounts: {
    name: string;
    currencies: string[];
    topConcentration: { symbol: string; costSharePct: number } | null;
  }[];
  anomalies: { type: string; severity: 'low' | 'medium' | 'high'; count: number }[];
}
```

Data source in the workshop: **deterministic mock** aligned with the MCP `get_demo_portfolio_summary` /
`detect_demo_anomalies` (or, if it exists, the BE-01 endpoint). **No real LLM.**

## Files to create/edit (minimum)
| Action | Path | Why |
|--------|------|-----|
| Create | `apps/client/src/app/components/portfolio-insights/portfolio-insights.component.ts` | Standalone component `GfPortfolioInsightsComponent`, selector `gf-portfolio-insights`. |
| Create | `apps/client/src/app/components/portfolio-insights/portfolio-insights.html` | Template: list of accounts with their top concentration + anomaly chips. |
| Create | `apps/client/src/app/components/portfolio-insights/portfolio-insights.scss` | Component styles (same approach as `home-overview.scss`). |
| Create | `libs/common/src/lib/interfaces/portfolio-insights.interface.ts` | `PortfolioInsights` contract. |
| Edit | `libs/common/src/lib/interfaces/index.ts` | Export the new interface (1 line). |
| Edit | host (e.g. the `home` page, `apps/client/src/app/pages/home/`) | Mount `<gf-portfolio-insights />` alongside the `home-*` components. **Confirm the actual host template before editing.** |

## Component skeleton (indicative, not applied)
```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
  selector: 'gf-portfolio-insights',
  styleUrls: ['./portfolio-insights.scss'],
  templateUrl: './portfolio-insights.html'
})
export class GfPortfolioInsightsComponent {
  protected readonly insights = signal<PortfolioInsights | null>(null);
  protected readonly title = $localize`Portfolio Insights`;
  protected readonly disclaimer = $localize`Información descriptiva, no asesoramiento financiero.`;
}
```

## Validation
- `npm run lint` (client) with no errors.
- Client build with no errors (e.g. `nx run client:build:development-en`).
- Visual review: the panel appears and shows allocations + anomalies.
- **Safety gate**: run the UI texts through `/workshop-review-financial-safety` → PASS.

## Risks / limits
- Do not touch routing, theming, or global dependencies. Do not add new libraries (reuse existing Angular Material).
- If the change grows (beyond these files), stop and request a human review.
- `git status` before, `git diff` after. No commit/push.

## Next step
Implement with `/workshop-implement-small-product-slice FE-01` (only if it is decided to touch `apps/`), or connect with BE-01
when the endpoint exists. Prepare handoff with `/workshop-prepare-team-handoff FE-01`.
