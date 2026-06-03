# P2-FE-02 — Frontend slice: Portfolio Insights widget

## Delivered

- Added a standalone `gf-portfolio-insights` widget under `apps/client/src/app/components/portfolio-insights/`.
- Added `DataService.fetchPortfolioInsights()` to consume `GET /api/v1/portfolio-insights`.
- Mounted the widget in `home-overview` below the existing portfolio performance block.

## Data and safety

- Data source: deterministic workshop endpoint `/api/v1/portfolio-insights`.
- Visible text is descriptive and educational: no buy/sell/hold/rebalance instructions, no predictions, and no personalised financial advice.

## Validate

```bash
npx nx run client:build:development-en
npm run lint
```

Safety review: PASS for the visible copy in this slice.

Attempted validation in this workspace:

- `npx nx run client:build:development-en` failed because Nx modules are not installed in the workspace (`Could not find Nx modules... Have you run npm/yarn install?`).
- `npm run lint` failed for the same dependency issue (`nx: command not found`).
- Financial safety review: PASS.
