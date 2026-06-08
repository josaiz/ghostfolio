---
name: nestjs-api-development
description: How to add small NestJS endpoints/services IN THIS repo (Ghostfolio) while respecting contracts and patterns. Find existing modules, follow the endpoints/<feature>/ convention, define DTOs, and validate. For general patterns, rely on nestjs-best-practices.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# NestJS Backend Development in Ghostfolio (workshop)

How to extend **this** repo's backend with minimal risk. For general NestJS patterns, also load the generic
`nestjs-best-practices` skill.

## Backend Map (verified)
- API: `apps/api/` (NestJS 11). Default Nx project: `api`.
- Feature modules in `apps/api/src/app/<feature>/` (`*.module.ts`, `*.controller.ts`, `*.service.ts`),
  registered in `apps/api/src/app/app.module.ts`.
- Recent convention for new endpoints: `apps/api/src/app/endpoints/<feature>/`.
- Examples to imitate: `account/`, `activities/`, `portfolio/`, `endpoints/watchlist/`.
- Shared DTOs/interfaces: `libs/common/src/lib/dtos/` and `libs/common/src/lib/interfaces/`.

## Method (contract first, minimal changes)
1. **Contract before code**: define the response interface/DTO in `libs/common/src/lib/...`
   (e.g. `PortfolioInsights`). This lets frontend and backend share the type.
2. **Find the simplest analogous module** (look at a small controller+service) and replicate it.
3. **Create the feature** in `endpoints/<feature>/` (module + controller + service) and **register it** in `app.module.ts`.
4. **Deterministic data**: read the demo dataset or reuse existing services. **Never use a real LLM** or non-reproducible
   calculations.
5. **Security**: use existing guards/permissions as neighboring controllers do. Do not open unauthenticated endpoints if neighbors require auth.
6. **Validate**: `npm run test:api`, `npm run lint`. Add a minimal `*.spec.ts` if you touch logic.

## When to Use This Skill
- BE-01 (mock insights endpoint), BE-02 (concentration service), and exposing DATA-* calculations.

## When NOT to Use It
- For UI (frontend) or for the MCP. For changing the data schema (forbidden).

## Quality Checklist
- [ ] Contract (DTO/interface) defined in `libs/common` and reused.
- [ ] Feature in `endpoints/<feature>/` registered in `app.module.ts`.
- [ ] Few files; pattern copied from an existing module.
- [ ] Guards/permissions are consistent with neighboring modules.
- [ ] Deterministic response; no real LLM; no personalized financial advice.
- [ ] `npm run test:api` and `npm run lint` pass. `git status`/`git diff`; no commit/push.

## Safety Limits
- Do not touch `prisma/schema.prisma` or migrations. No `.env`, `docker/`, `nx.json`. Ask for human review in shared modules.
