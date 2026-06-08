---
name: financial-safety-review
description: Review texts, prompts, endpoints, and insight feature responses so they do NOT contain personalized financial advice. Provides the checklist, examples, and PASS/FAIL verdict format.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Financial Safety Review (workshop)

Product boundary: **describe and inform; never advise a person what to do with their money.**
The data is synthetic and educational.

## Checklist (one FAIL on any point = overall FAIL)
1. **Action recommendation**: Does it say or imply buy/sell/hold/rebalance? -> FAIL.
2. **Personalization**: Does it address "you" and say what to do with *your* portfolio? -> FAIL.
3. **Prediction**: Does it predict prices, returns, or that something "will rise/fall"? -> FAIL.
4. **Promise**: Does it promise gains, "optimal" outcomes, or the "best investment"? -> FAIL.
5. **Advisor simulation**: Does it present itself as a financial advisor or give "advice"? -> FAIL.
6. **Suitability**: Does it judge whether an asset is "good/bad" for someone? -> FAIL.
7. **Disclaimer**: For visible outputs, does it make clear that it is informational and not advice? (recommended).

Allowed (PASS): **descriptive and measurable** observations about the dataset.

## Examples
- FAIL: "Your portfolio is highly concentrated in tech, so you should diversify." -> FAIL (recommendation + personalization).
- PASS: "The *Trade Republic Growth* account has its largest position in AAPL (26.2% of cost), followed by MSFT (21.8%) and NVDA (19.7%)."
- FAIL: "BTC will probably rise, so this is a good moment to buy." -> FAIL (prediction + recommendation).
- PASS: "The *Crypto Exchange* account shows high entry-price variation between 2024 and 2026 (43.5k -> 108k USD for BTC)."

## Output Format (always the same)
```
Verdict: PASS | FAIL
Findings:
  - "<exact quote>" -> <which checklist point it violates and why>
Safe rewrite:
  <equivalent descriptive version>
Checklist:
  1..7 -> OK/observation
```

## When to Use This Skill
- SAFE-01 (boundary guide), SAFE-02 (review a response), and as a **gate** before any visible output (FE/MCP/INT).

## When NOT to Use It
- To review bugs/technical correctness (that is code review).

## Safety Limits
- Do not soften a real FAIL. The rewrite must keep the information while removing the action/prediction/personalization.
