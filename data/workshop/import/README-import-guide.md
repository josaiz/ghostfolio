# Ghostfolio Workshop Dataset — Import Guide

This folder contains synthetic transactions for the **Innovation Night Ghostfolio Agentic Workshop**.

## Files

- `ghostfolio-workshop-main.csv` — combined clean dataset with 54 activities across 3 accounts.
- `myinvestor-core-etf.csv` — ETF/core portfolio only (22 rows).
- `trade-republic-growth.csv` — growth stocks only (21 rows).
- `crypto-exchange.csv` — crypto sleeve only (11 rows).
- `ghostfolio-workshop-anomalies-do-not-import-main.csv` — intentionally suspicious records for later AI/anomaly-detection exercises. Do **not** import this into the main demo account unless you want polluted data.

## Recommended accounts to create in Ghostfolio first

Create these accounts manually before importing. Use exactly these names if you want to use the `Account` column in the combined CSV:

1. `MyInvestor Core ETF` — long-term EUR ETF account.
2. `Trade Republic Growth` — concentrated growth stock account with USD and EUR assets.
3. `Crypto Exchange` — BTC/ETH sleeve.
4. Optional: `Import Sandbox` — only for the anomaly file.

## Recommended import flow

### Safer flow

Import each account file separately and select the matching account in Ghostfolio:

1. Import `myinvestor-core-etf.csv` into `MyInvestor Core ETF`.
2. Import `trade-republic-growth.csv` into `Trade Republic Growth`.
3. Import `crypto-exchange.csv` into `Crypto Exchange`.

### Faster flow

Import `ghostfolio-workshop-main.csv` once. This works if your Ghostfolio version maps the `Account` column to existing account names.

## CSV format used

The files use this header:

```csv
Date,Code,Name,Action,Currency,Price,Quantity,Fee,DataSource,Account,Comment
```

This matches commonly referenced Ghostfolio activity import columns such as `Date`, `Code`, `DataSource`, `Currency`, `Price`, `Quantity`, `Action`, `Fee`, and `Account`.

## Scenario coverage

The dataset is designed to be useful later for an AI-assisted feature such as `Portfolio AI Assistant`:

- DCA into a global ETF core (`VWCE.DE`).
- US concentration via S&P 500 and large-cap tech.
- Regional diversification via Europe and Emerging Markets.
- Bond sleeve for lower-risk allocation.
- Dividend income rows for Europe ETF, Apple, and Microsoft.
- Partial sells and rebalancing events.
- Crypto volatility with BTC/ETH buys and partial sells.
- Mixed-currency activity (EUR and USD).
- Fees on trades.
- Separate anomaly CSV for duplicate detection, high-fee detection, price outlier, currency mismatch, and oversell risk.

## Notes

- These are synthetic transactions, not investment advice.
- Prices are plausible demo prices, not audited historical data.
- If your self-hosted Ghostfolio complains about missing exchange rates, go to the Admin/Market Data area and gather historical market data for the relevant currency pairs.
- If a symbol fails validation, try importing that account file alone first and verify the `DataSource` and `Code` values in Ghostfolio's search.
