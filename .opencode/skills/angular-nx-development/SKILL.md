---
name: angular-nx-development
description: How to apply Angular 21 + Nx IN THIS repo (Ghostfolio) without breaking anything. Locate analogous components, respect the Nx structure, make small changes, and validate them. For pure Angular mechanics, rely on the angular-developer skill.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Angular/Nx Frontend Development in Ghostfolio (workshop)

This is not a generic Angular guide. It explains **how to work on this repo's frontend** with minimal, safe changes.
For Angular syntax/features (signals, forms, etc.), also load the generic `angular-developer` skill.

## Frontend Map (verified)
- Client app: `apps/client/` (Angular 21 + Angular Material + Bootstrap utilities).
- Page components: `apps/client/src/app/components/<component>/` (e.g. `home-overview/`, `home-holdings/`,
  `home-summary/`, `portfolio-summary/`).
- Pages: `apps/client/src/app/pages/<page>/` (`home/`, `portfolio/`, `demo/`).
- Reusable UI components: `libs/ui/src/lib/<component>/` (includes `chart/`, `activities-table/`, `assistant/`).
- Client services: `apps/client/src/app/services/`.

## Method (copy a pattern, do not invent one)
1. **Find the analogue**: which existing component resembles what you are being asked for? For a summary widget,
   study `home-overview` or `portfolio-summary`. Read it fully before writing.
2. **Replicate its structure**: same `@Component` style, same imports, same way of receiving data (inputs/services),
   same i18n and component `.scss` style patterns. Do not introduce new libraries.
3. **Data**: consume a deterministic contract (mock or endpoint). In the workshop, **no real LLM**.
4. **Mount the component** where it belongs (`home`/`portfolio` page), following how neighboring components are mounted.
5. **Validate**: `npm run lint` and the client build. Check that shared modules were not broken.

## Generate with Nx (if appropriate)
- Use the Nx/Angular CLI instead of creating files by hand when possible (respect `nx.json` generators).
- Do not change global Nx configuration, global routing, or global theming.

## When to Use This Skill
- FE-01 (Portfolio Insights widget), FE-02 (Demo Portfolio Health view), FE-03 ("Explain demo portfolio" button).

## When NOT to Use It
- For business/calculation logic (backend or domain). For the MCP, use another skill.

## Quality Checklist
- [ ] An analogous component has been identified and followed.
- [ ] Minimal changes: few files, no cross-cutting refactor.
- [ ] No new dependencies; styles and i18n follow the repo style.
- [ ] `npm run lint` and the client build pass.
- [ ] UI texts reviewed with `financial-safety-review` (no personalized advice).
- [ ] `git status` before / `git diff` after; no commit/push.

## Safety Limits
- Do not touch `.env`, `nx.json`, `tsconfig.base.json`, or global routing/theming. Ask for human review if the change grows.
