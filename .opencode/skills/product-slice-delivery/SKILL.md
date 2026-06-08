---
name: product-slice-delivery
description: Deliver a MINIMAL and safe end-to-end product slice in Ghostfolio (the workshop happy path). How to limit scope, touch the fewest files, validate, and document the change. Use it with /workshop-implement-small-product-slice.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Product Slice Delivery (workshop)

How to turn a card into a demonstrable happy path **without breaking anything**.

## Principles
1. **The smallest thing that demonstrates value.** If it can be demonstrated without touching `apps/`, even better (via MCP + command).
2. **Read-only by default.** The reference happy path is: MCP `ghostfolio-demo-data` +
   `/workshop-analyze-demo-portfolio` + `/workshop-review-financial-safety`. It does not touch Ghostfolio code.
3. **If `apps/` must be touched**, delegate to `frontend-angular-agent`/`backend-nestjs-agent`, copy an existing pattern,
   and ask for human confirmation first.

## Procedure
1. Run `git status` to see the starting point.
2. Short plan: what is delivered, which files, how it is tested. Confirm whether it touches functional code.
3. Implement the minimum. No real LLM. No new dependencies unless justified.
4. Test the happy path with exact commands (repeatable by anyone).
5. Run visible texts through `financial-safety-review`.
6. Run `git diff` and explain the change. Document it in `docs/workshop/generated/<ID>-slice.md`.

## Definition of Done
- [ ] The happy path can be run and seen, with reproducible steps.
- [ ] Minimal and localized changes; build/local setup intact.
- [ ] No touching `.env`, `prisma/schema.prisma`, `docker/`, `nx.json`.
- [ ] Safety review PASS.
- [ ] Documented. `git status`/`git diff` reviewed. No commit/push.

## When to Use / Not Use
- Use it for INT-01 and for any "show it end-to-end" request.
- Do not use it for pure investigation or planning (use the `-inspect-`/`-plan-` commands).

## Limit
- If a change grows or becomes risky: stop, split it up, and ask for human review.
