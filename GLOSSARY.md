# Ghostfolio Workshop Glossary

Terms specific to the workshop setup and the tools it depends on.

## Terms

**Security Token**
A short opaque string Ghostfolio generates when a user registers. Used to authenticate API calls — it is the durable identity for a user. Passed to `POST /api/v1/auth/anonymous` to obtain a JWT. Set as `GHOSTFOLIO_ACCESS_TOKEN` when running seed scripts.

**JWT (authToken)**
A short-lived JSON Web Token returned by the anonymous auth endpoint. Sent as `Authorization: Bearer <token>` on every API request. Generated from the security token — do not confuse the two.

**ACCESS_TOKEN_SALT**
An environment variable used internally by Ghostfolio to hash security tokens before storing them in the database. Set automatically by `start.sh`. Never share it.

**JWT_SECRET_KEY**
An environment variable used to sign JWT tokens. Set automatically by `start.sh`. Never share it.

**docker-compose.build.yml**
The Docker Compose file used in this workshop. Builds the Ghostfolio image from local source code instead of pulling the official Docker Hub image. Enables local code changes to be rebuilt and tested.

**ADMIN role**
The first user to register via the Ghostfolio UI automatically receives this role. Required for loading demo data and calling management API endpoints.

**WORKSHOP_DEMO_DATA**
A tag written into the `comment` field of every activity imported by the seed script. Allows the reset script to identify and delete only workshop demo data, leaving real user data untouched.

**seed-workshop-data.sh**
A script that authenticates as the admin user and imports three demo portfolios (MyInvestor Core ETF, Trade Republic Growth, Crypto Exchange) via the Ghostfolio HTTP API.

**Nx workspace**
The monorepo build tool used in Ghostfolio. Orchestrates building the NestJS backend and Angular frontend. Responsible for the long compile output seen during `./scripts/start.sh`.

**Prisma**
The ORM used by Ghostfolio to manage the PostgreSQL schema and run migrations. `prisma migrate deploy` runs automatically inside the Docker entrypoint on startup.
