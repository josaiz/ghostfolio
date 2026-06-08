---
name: ghostfolio-domain-analysis
description: Reason about the Ghostfolio domain (accounts, activities/Order, symbols, holdings, concentration, and anomalies) using the workshop demo dataset. Use it to define descriptive insights and functional contracts.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Ghostfolio Domain Analysis (workshop)

Knowledge for reasoning about the demo portfolio **before** implementing or planning an insights feature.

## Mental Model (verified in the repo)

- **Account**: the user's account (`name`, `currency`, `balance`). The demo dataset has 3 accounts.
- **Order** = activity/transaction: `type` (`BUY`/`SELL`/`DIVIDEND`/`FEE`/`INTEREST`/`LIABILITY`), `date`, `quantity`,
  `unitPrice`, `fee`, `currency`, `accountId`, `symbolProfileId`.
- **SymbolProfile**: the asset (`symbol`, `name`, `dataSource`, `assetClass`, `assetSubClass`).
- A **holding** is the net position per symbol in an account: `Σ(BUY.quantity) − Σ(SELL.quantity)`.
- Approximate "invested cost" per symbol: `Σ(BUY.quantity·unitPrice) − Σ(SELL.quantity·unitPrice)` (DIVIDEND does not count as a purchase).

## Demo Dataset (source of truth)

`data/workshop/import/ghostfolio-workshop-main.csv` (54 activities, header
`Date,Code,Name,Action,Currency,Price,Quantity,Fee,DataSource,Account,Comment`):

- **MyInvestor Core ETF** (EUR): VWCE.DE, SXR8.DE, IUSN.DE, EUNA.DE, IS3N.DE, EXSA.DE -> diversified (global, S&P500, small cap, bonds, EM, Europe).
- **Trade Republic Growth** (USD): NVDA, AAPL, MSFT, GOOGL, AMZN, ASML.AS -> **clear tech concentration**.
- **Crypto Exchange** (USD): BTC, ETH -> **high volatility**.

Labelled anomalies (in `...-anomalies-do-not-import-main.csv`, NOT imported): `exact-duplicate`, `high-fee`,
`currency-mismatch`, `price-outlier`, `oversell-risk`.

## How to Get the Data (do not invent figures)

Ask the **read-only** MCP `ghostfolio-demo-data`: `list_demo_accounts`, `get_demo_portfolio_summary`,
`get_symbol_exposure`, `get_account_summary`, `list_demo_activities`, `detect_demo_anomalies`.
In the real product, this would be equivalent to `GET /api/v1/account` and `GET /api/v1/activities`.

## What Counts as a Valid "Insight" Here

An observation that is **descriptive and measurable**, never prescriptive:

- PASS: "The *Trade Republic Growth* account concentrates 67.7% of its cost in 3 symbols (AAPL 26.2%, MSFT 21.8%, NVDA 19.7%)."
- PASS: "The *Crypto Exchange* account splits its cost between BTC (60.8%) and ETH (39.2%)."
- PASS: "The detector flags 5 anomalies in the sandbox: duplicate, high fee, currency, price outlier, and oversell."
- FAIL: "You should reduce NVDA" / "Buy more bonds" / "BTC will rise" (that is advice -> safety FAIL).

> Example figures taken from the MCP (`get_demo_portfolio_summary`). If you change the dataset, request them again: never hard-code them manually.

## When to Use This Skill
- FND-02 (functional contract), DATA-01/02, `/workshop-analyze-demo-portfolio`, and when designing insights widgets/endpoints.

## When NOT to Use It
- For UI or NestJS mechanics (use `angular-nx-development` / `nestjs-api-development`).
- For real user data: only the demo dataset is used here.

## Quality Checklist
- [ ] Every figure comes from the MCP/services, not invented.
- [ ] Every insight is descriptive, measurable, and traceable to a metric.
- [ ] No text recommends buying/selling/holding or predicts prices.
- [ ] "Invested cost" is distinguished from "market value" (without current prices, work from cost).
- [ ] The insight contract is stable (clear fields) so frontend/backend can consume it.

## Safety Limits
- Synthetic and educational data. This is not advice. Run texts through `financial-safety-review`.
