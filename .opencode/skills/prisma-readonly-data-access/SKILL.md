---
name: prisma-readonly-data-access
description: Access Ghostfolio data safely in READ-ONLY mode. Understand the Prisma schema, prefer existing services/APIs or the demo CSV MCP, and never modify schema or data. Use it when designing queries or choosing the data source.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Read-Only Data Access in Ghostfolio (workshop)

How to read data without risk. Rule number one: **do not modify the schema or the data**.

## Models (in `prisma/schema.prisma`)
- `Account` (`id`, `userId`, `name`, `currency`, `balance`, `comment`, `isExcluded`, `platformId`).
- `Order` = activity (`type`, `date`, `quantity`, `unitPrice`, `fee`, `currency`, `accountId`, `symbolProfileId`).
- `SymbolProfile` (`symbol`, `name`, `dataSource`, `assetClass`, `assetSubClass`).
- `Tag`, `User` (without local email/password; hashed `accessToken`).

## Data Source Hierarchy (most to least preferred in the workshop)
1. **MCP `ghostfolio-demo-data`** (reads demo CSV, read-only, reproducible) -> first choice for demo insights.
2. **Existing HTTP API** (`GET /api/v1/account`, `GET /api/v1/activities`) with security-token JWT -> for live data.
3. **Existing Prisma services** (`account.service.ts`, `activities.service.ts`) if you work inside the backend.
4. Direct Prisma access, **read-only** (`findMany`/`findUnique`/`aggregate`/`count`), as a last resort.

Never: write-oriented `create`/`update`/`delete`/`upsert`/`executeRaw`, nor `prisma migrate`/`db push`.

## Useful Read-Only Query Patterns
- Holdings by account: group `Order` by `accountId` + `symbol`, sum `quantity` with a sign based on `type`.
- Exposure by symbol: cost = `Σ(BUY qty·price) − Σ(SELL qty·price)`.
- Anomalies: work on the anomalies CSV (not imported) through the MCP.

## When to Use This Skill
- BE-02, DATA-01/02, and whenever you need to decide "where do I get this data without breaking anything?"

## When NOT to Use It
- To create endpoints (that is `nestjs-api-development`) or reason about meaning (that is `ghostfolio-domain-analysis`).

## Quality Checklist
- [ ] The operation is strictly read-only.
- [ ] The most reproducible source (CSV/MCP) was chosen when possible.
- [ ] `schema.prisma` and migrations are not touched.
- [ ] Demo dataset only; no real user data.
- [ ] Invested cost is distinguished from market value.

## Safety Limits
- Any need to write/migrate -> **reject** and propose a read-only alternative or the official seed path.
- Do not print secrets or connection strings. Do not touch `.env`.
