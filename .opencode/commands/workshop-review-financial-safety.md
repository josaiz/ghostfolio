---
description: Reviews a text, prompt, endpoint, or response to avoid personalized financial advice. Returns PASS/FAIL. E.g. /workshop-review-financial-safety SAFE-02
agent: financial-safety-reviewer
subtask: true
---

Review the financial safety of: **$ARGUMENTS**

The content to review can be:
- text pasted directly as an argument,
- a file path (then read it), e.g. `docs/workshop/generated/INT-01-portfolio-insights.md`,
- or the output of a previous command as indicated.

Work as follows:
1. Load the `financial-safety-review` skill.
2. Apply the checklist: buy/sell/hold recommendation, "you should", profitability promises,
   price prediction, advisor simulation, personalization to an individual.
3. Return exactly:
   - **Verdict**: PASS or FAIL.
   - **Findings**: list with exact quote + reason (empty if PASS).
   - **Safe rewrite**: equivalent descriptive/educational version.
   - **Checklist** marked point by point.

Do not edit the original content; only report. If given a card ID, save the report in
`docs/workshop/generated/<ID>-safety-review.md`.
