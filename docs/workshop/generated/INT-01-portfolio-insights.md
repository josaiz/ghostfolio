# INT-01 — Portfolio Insights (demo)

> **Example output** from `/workshop-analyze-demo-portfolio` (agent `portfolio-domain-agent` + skill
> `ghostfolio-domain-analysis`). All figures come from the MCP `ghostfolio-demo-data` (read-only).
> **Descriptive and educational** information, not financial advice. Synthetic workshop data.

## General summary (from `get_demo_portfolio_summary`)
- **3 accounts**, **54 activities**, **14 symbols** in the demo dataset.
- Metric used: *nominal invested cost* = Σ(BUY qty·price) − Σ(SELL qty·price). No currency conversion or
  current market value (cost share **within each account**).

## Concentration by account

**MyInvestor Core ETF** (EUR) — nominal cost ≈ 17,326 €. Relatively diversified distribution:
- VWCE.DE 39.5% · IS3N.DE 20.5% · SXR8.DE 16.3% · EUNA.DE 16.0% · EXSA.DE 5.9% · IUSN.DE 1.8%.
- Observation: global core portfolio with bonds (EUNA.DE) and emerging markets (IS3N.DE).

**Trade Republic Growth** (EUR/USD) — nominal cost ≈ 9,674. Concentration in technology:
- AAPL 26.2% · MSFT 21.8% · NVDA 19.7% · ASML.AS 14.8% · GOOGL 12.4% · AMZN 5.1%.
- Observation: the **3 largest positions account for 67.7%** of the account cost; mixed currencies (ASML.AS in EUR).

**Crypto Exchange** (USD) — nominal cost ≈ 8,682. Two assets:
- BTC-USD 60.8% · ETH-USD 39.2%.
- Observation: wide range of BTC entry prices (43,500 → 108,000 USD between 2024 and 2026).

## Detected anomalies (from `detect_demo_anomalies`, source=anomalies)
5 findings in the anomaly sandbox (deterministic detection; **does not** use the CSV labels):

| Severity | Type | Account | Symbol | Date | Detail |
|----------|------|---------|--------|------|--------|
| high | oversell-risk | Import Sandbox | MSFT | 2026-01-05 | Sale of 20 leaves net position negative (−20). |
| medium | exact-duplicate | Import Sandbox | VWCE.DE | 2025-07-15 | 2 identical activities (rows 2,3). |
| medium | currency-mismatch | Import Sandbox | AAPL | 2025-10-18 | Currency EUR differs from the usual USD for AAPL. |
| medium | price-outlier | Import Sandbox | BTC-USD | 2025-11-01 | Price 30,000 USD outside the reference range [43,500, 108,000]. |
| low | high-fee | Import Sandbox | AAPL | 2025-10-02 | Fee 65 = 26.5% of the amount (245 USD). |

On the clean dataset (`source=main`) the detector returns **0 anomalies** (demonstrates specificity).

## Disclaimer
These observations describe the demo dataset. They do **not** constitute a recommendation to buy/sell/hold nor
a price prediction. Before displaying this content in a product, run it through `/workshop-review-financial-safety`
(see `INT-01-safety-review.md`).
