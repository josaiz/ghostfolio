---
description: Analyzes the demo portfolio using the read-only MCP and produces descriptive insights (concentration, diversification, anomalies). Does not provide financial advice.
agent: portfolio-domain-agent
subtask: true
---

Analyze the demo portfolio and generate descriptive insights. Optional focus: **$ARGUMENTS**

Work like this:
1. Load the `ghostfolio-domain-analysis` skill.
2. Get the data **only from the MCP** `ghostfolio-demo-data`:
   - `list_demo_accounts` to see the accounts.
   - `get_demo_portfolio_summary` for totals and account/symbol exposure.
   - `detect_demo_anomalies` for anomalies from the anomalies dataset.
   Do not invent figures: every figure must come from the MCP.
3. Produce **descriptive and measurable** insights, for example:
   - "The *Trade Republic Growth* account has N% concentration in technology (NVDA/AAPL/MSFT/GOOGL/AMZN)."
   - "The *Crypto Exchange* account represents M% of the total invested amount."
   - "K anomalies of type ... are detected."
4. **Forbidden**: recommending buy/sell/hold actions or predicting prices. Educational observations only.

Expected output: a markdown summary with the MCP figures. If an ID is provided (e.g. `INT-01`), save it in
`docs/workshop/generated/<ID>-portfolio-insights.md`. Before showing it, remember to run the text through
`/workshop-review-financial-safety`.
