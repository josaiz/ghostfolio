# Workshop Data Seed Notes

## Chosen strategy

Option A was chosen: use the existing Ghostfolio HTTP API.

No functional Ghostfolio code is modified and no data is written directly to PostgreSQL. The tooling calls the existing endpoints with a JWT obtained from the Ghostfolio security token flow.

## Data models

The main models are in `prisma/schema.prisma`:

- `Account`: user account. Relevant fields: `id`, `userId`, `name`, `currency`, `balance`, `comment`, `isExcluded`, `platformId`.
- `Order`: activity/transaction. Ghostfolio uses `Order` as the activity model. Relevant fields: `id`, `userId`, `accountId`, `comment`, `currency`, `date`, `fee`, `quantity`, `type`, `unitPrice`, `symbolProfileId`.
- `SymbolProfile`: asset associated with an activity. Relevant fields: `dataSource`, `symbol`, `currency`, `name`, `assetClass`, `assetSubClass`.
- `Tag`: optional tag connected to activities.
- `User`: user. Does not contain local email/password; contains hashed `accessToken` for anonymous/security token authentication, `provider` and `role`.

## Accounts

Account creation and lookup uses:

- `apps/api/src/app/account/account.controller.ts`
- `apps/api/src/app/account/account.service.ts`

Relevant endpoints:

- `GET /api/v1/account`: lists accounts for the authenticated user.
- `POST /api/v1/account`: creates an account. Requires `createAccount` permission.
- `DELETE /api/v1/account/:id`: deletes an account only if it has no activities. Requires `deleteAccount` permission.

DTO:

- `libs/common/src/lib/dtos/create-account.dto.ts`

## Activities

Activity management uses:

- `apps/api/src/app/activities/activities.controller.ts`
- `apps/api/src/app/activities/activities.service.ts`

Relevant endpoints:

- `GET /api/v1/activities`: lists activities for the authenticated user.
- `POST /api/v1/activities`: creates a single activity. Requires `createActivity` permission.
- `DELETE /api/v1/activities/:id`: deletes a specific activity. Requires `deleteActivity` permission.
- `DELETE /api/v1/activities`: deletes filtered activities, for example by account, symbol or tags.

DTO:

- `libs/common/src/lib/dtos/create-order.dto.ts`

## CSV Import

The UI does not send a raw CSV file to the backend. The client parses the CSV with PapaParse in:

- `apps/client/src/app/services/import-activities.service.ts`
- `apps/client/src/app/pages/portfolio/activities/import-activities-dialog/import-activities-dialog.component.ts`

It then transforms each row into a `CreateOrderDto` and calls:

- `POST /api/v1/import?dryRun=true`
- `POST /api/v1/import?dryRun=false`

The import backend is in:

- `apps/api/src/app/import/import.controller.ts`
- `apps/api/src/app/import/import.service.ts`

The `POST /api/v1/import` endpoint requires `createActivity` and `createAccount` permissions. It accepts a JSON with:

```json
{
  "accounts": [],
  "activities": [],
  "assetProfiles": [],
  "tags": []
}
```

## Authentication

Ghostfolio does not have a local email/password login in the inspected model. The authentication available for scripts is via security token:

- `POST /api/v1/auth/anonymous`
- body: `{ "accessToken": "<security-token>" }`
- response: `{ "authToken": "<jwt>" }`

That JWT is used as:

```text
Authorization: Bearer <jwt>
```

The security token is managed in:

- `apps/api/src/app/auth/auth.controller.ts`
- `apps/api/src/app/auth/auth.service.ts`
- `apps/api/src/app/user/user.controller.ts`
- `apps/api/src/app/user/user.service.ts`

The registration UI shows the security token only once. If lost, it can be regenerated from the UI, but that invalidates the previous token.

## Dataset

The dataset exists in:

```text
data/workshop/import/
```

The seed uses by default:

- `myinvestor-core-etf.csv` -> `MyInvestor Core ETF`
- `trade-republic-growth.csv` -> `Trade Republic Growth`
- `crypto-exchange.csv` -> `Crypto Exchange`

For this version of Ghostfolio, the import validator does not accept
crypto tickers from Yahoo with a hyphen (`BTC-USD`, `ETH-USD`). The seed
tooling normalises them in the import payload to `BTCUSD` and `ETHUSD`, without modifying
the dataset CSV files.

Not imported by default:

- `ghostfolio-workshop-anomalies-do-not-import-main.csv`

That CSV is reserved for later anomaly detection phases.

## Idempotency

The seed marks each imported activity in `comment` with:

```text
WORKSHOP_DEMO_DATA file=<csv> row=<row>
```

Before importing, the script lists existing activities and skips any that already have that marker. It also compares a defensive tuple:

```text
accountId | date | symbol | type | quantity | unitPrice | fee
```

This prevents duplicates if the seed is run twice.

## Safe reset

The reset only deletes activities whose `comment` contains:

```text
WORKSHOP_DEMO_DATA
```

It then attempts to delete the demo accounts only if:

- the name matches one of the three demo accounts;
- the account was created by the seed, detected by the marker in `Account.comment`;
- the account has no activities left after deleting the demo activities.

If a demo account existed beforehand and was not created by the seed, the reset does not delete it.

## Limitations

- Email/password cannot be implemented because this version of Ghostfolio does not expose that type of local login.
- The script prompts for the security token or uses temporary variables: `GHOSTFOLIO_ACCESS_TOKEN`, `GHOSTFOLIO_SECURITY_TOKEN`, `GHOSTFOLIO_AUTH_TOKEN` or, for compatibility with the prompt, `GHOSTFOLIO_ADMIN_PASSWORD` treated as a security token.
- If any symbol fails Ghostfolio's data provider validation, the import endpoint will report it and the seed will fail before performing the actual import thanks to `dryRun`.
