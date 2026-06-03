# INT-01 — Financial Safety Review

> **Example output** from `/workshop-review-financial-safety docs/workshop/generated/INT-01-portfolio-insights.md`
> (agent `financial-safety-reviewer` + skill `financial-safety-review`). Reference for teams.

**Reviewed content:** `docs/workshop/generated/INT-01-portfolio-insights.md`

## Verdict: PASS

## Findings
- None. The content is descriptive and measurable; it does not recommend actions, does not personalise, and does not predict prices.

## Checklist
1. Action recommendation (buy/sell/hold/rebalance) → **OK**: does not appear.
2. Personalisation ("you" with what to do with your portfolio) → **OK**: refers to demo accounts, not the user.
3. Prediction (prices, returns, "will rise/fall") → **OK**: only historical ranges from the dataset.
4. Promise ("optimal", "best investment", gains) → **OK**: does not appear.
5. Advisor simulation / "advice" → **OK**: descriptive report tone.
6. Suitability ("good/bad" for someone) → **OK**: only metrics (allocations, number of anomalies).
7. Informational disclaimer present → **OK**: includes "not financial advice" and "synthetic data".

## Safe Rewrite
Not required (PASS). Keep the disclaimer visible when this content is displayed in the UI (FE-01/FE-03).

## Note
If a future text were to say, e.g., "the account is highly concentrated, diversification is advisable", that would be a **FAIL**
(recommendation). The safe version would be: "the account concentrates 67.7% of its cost in 3 symbols" — describes without advising.
