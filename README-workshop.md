# Innovation Night Ghostfolio Agentic Workshop

## Workshop documentation

| Resource | Description |
|----------|-------------|
| [Getting Started](https://htmlpreview.github.io/?https://raw.githubusercontent.com/josaiz/ghostfolio/refs/heads/workshop/exercises/docs/workshop/getting-started.html) | Install, run, and configure Ghostfolio step by step |
| [Workshop 101](https://htmlpreview.github.io/?https://raw.githubusercontent.com/josaiz/ghostfolio/refs/heads/workshop/exercises/docs/workshop/workshop-101.html) | Workshop purpose, OpenCode model, card cycle, and safety checklist |
| [Backlog (Kanban)](https://htmlpreview.github.io/?https://raw.githubusercontent.com/josaiz/ghostfolio/refs/heads/workshop/exercises/docs/workshop/kanban.html) | Workshop task cards, filterable by difficulty and team |

---

## Goal

This repository is a local fork of Ghostfolio prepared as the base product for an agentic programming workshop using OpenCode/OpenAgents Control.

The setup is designed so the project runs locally with Docker Desktop by building the image from the fork's source code. Any subsequent code change can then be reviewed with Git, rebuilt, and relaunched to see it working.

## What is Ghostfolio

Ghostfolio is an open-source wealth management and portfolio tracking application. It lets you manage investments, query market data, and track portfolio performance.

## Inspected files

All requested files were present:

```text
README.md
DEVELOPMENT.md
.env.example
docker/docker-compose.yml
docker/docker-compose.build.yml
```

`Dockerfile`, `docker/entrypoint.sh`, `package.json`, `nx.json`, and the folder structure were also reviewed to confirm the stack and startup behaviour.

## Detected tech stack

According to `README.md`, `DEVELOPMENT.md`, `package.json`, and `nx.json`, the project uses:

- TypeScript
- Nx workspace
- NestJS for the backend
- Angular for the frontend
- Angular Material
- Bootstrap utility classes
- PostgreSQL
- Prisma
- Redis
- Docker Compose
- Node.js `>=22.18.0` for local development without Docker

## Official image vs local build

Ghostfolio documents two ways to start with Docker Compose:

- `docker/docker-compose.yml` pulls the official image from Docker Hub: `docker.io/ghostfolio/ghostfolio:latest`.
- `docker/docker-compose.build.yml` builds the image from local source with `build: ../` and tags it as `ghostfolio/ghostfolio:local`.

For this workshop the primary mode is:

```bash
docker compose --env-file .env -f docker/docker-compose.build.yml build
docker compose --env-file .env -f docker/docker-compose.build.yml up -d
```

The `--env-file .env` flag does not break the existing compose setup. `docker/docker-compose.yml` already declares `env_file: ../.env`, and `--env-file .env` makes the variables available for interpolation while keeping the environment file explicit.

The scripts set `COMPOSE_PROJECT_NAME` to `ghostfolio_build` when `.env.example` carries the default value `ghostfolio`. This prevents accidentally reusing volumes from a previous run with the official image.

## Docker Compose services

`docker/docker-compose.yml` starts:

- `ghostfolio`: web/API application with the official image `docker.io/ghostfolio/ghostfolio:latest`, port `3333:3333`, healthcheck at `/api/v1/health`.
- `postgres`: PostgreSQL `15-alpine`, volume `postgres`.
- `redis`: Alpine Redis protected with `REDIS_PASSWORD`.

`docker/docker-compose.build.yml` starts the same services but changes `ghostfolio` to build from local source:

- `ghostfolio`: `build: ../`, local image `ghostfolio/ghostfolio:local`.
- `postgres`: extends the base service and uses the container `gf-postgres-build`.
- `redis`: extends the base service and uses the container `gf-redis-build`.

## Port and local URL

The application exposes port `3333`.

```text
http://localhost:3333
```

## Environment variables

`README.md` marks these as required:

- `ACCESS_TOKEN_SALT`
- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `POSTGRES_DB`
- `POSTGRES_PASSWORD`
- `POSTGRES_USER`
- `REDIS_HOST`
- `REDIS_PASSWORD`
- `REDIS_PORT`

Optional but useful variables include `DIRECT_URL`, `PORT`, `REDIS_DB`, and `ROOT_URL`.

The current `.env.example` contains these placeholders:

```text
<INSERT_REDIS_PASSWORD>
<INSERT_POSTGRES_PASSWORD>
<INSERT_RANDOM_STRING>
<INSERT_RANDOM_STRING>
```

The local `.env` file is created by copying `.env.example` and replacing those placeholders with random secrets. No secrets are printed in this README.

`.env` is already included in `.gitignore`, so it will not appear as a file to commit.

## Migrations and setup

In Docker mode, no manual setup command is needed after starting. `docker/entrypoint.sh` runs:

```bash
npx prisma migrate deploy
npx prisma db seed
exec node main
```

`README.md` also states that the container automatically applies database migrations at startup.

In development mode without full Docker, `DEVELOPMENT.md` uses a different flow: `docker/docker-compose.dev.yml`, `npm run database:setup`, and separate server and client processes. That is not the primary flow for this workshop.

## First admin user

`README.md` and `DEVELOPMENT.md` state that when you open the UI and create a user with _Get Started_, that first user is automatically assigned the `ADMIN` role.

## Project structure

Everything lives in a single Git repository:

```text
innovation-night-ghostfolio-agentic-workshop/
  .git/
  apps/
  docker/
  libs/
  prisma/
  scripts/
  test/
  tools/
  README-workshop.md
```

## Requirements — Mac / Linux

- Git
- Docker Desktop
- Docker Compose
- curl
- bash

## Requirements — Windows

- Git for Windows
- Docker Desktop
- WSL2 recommended
- PowerShell 7 recommended
- Web browser

## Quick start — Mac / Linux

```bash
./scripts/start.sh
```

## Quick start — Windows PowerShell

```powershell
.\scripts\start.ps1
```

## Local URL

```text
http://localhost:3333
```

## Check status — Mac / Linux

```bash
./scripts/check.sh
```

## Check status — Windows

```powershell
.\scripts\check.ps1
```

## Logs — Mac / Linux

```bash
./scripts/logs.sh
```

## Logs — Windows

```powershell
.\scripts\logs.ps1
```

## Stop — Mac / Linux

```bash
./scripts/stop.sh
```

## Stop — Windows

```powershell
.\scripts\stop.ps1
```

## Full reset — Mac / Linux

Destroys all containers, networks, and local volumes, including the local Ghostfolio database.

```bash
./scripts/reset.sh
```

Without interactive confirmation:

```bash
./scripts/reset.sh --force
```

## Full reset — Windows

Destroys all containers, networks, and local volumes, including the local Ghostfolio database.

```powershell
.\scripts\reset.ps1
```

Without interactive confirmation:

```powershell
.\scripts\reset.ps1 -Force
```

## Rebuild after changing code

This is key for the workshop: if you modify local Ghostfolio code, you must rebuild the image so Docker runs the new version.

Mac / Linux:

```bash
./scripts/rebuild.sh
```

Windows:

```powershell
.\scripts\rebuild.ps1
```

`rebuild` uses `docker/docker-compose.build.yml`, rebuilds without cache, and restarts the environment.

## Basic Git commands for reviewing changes

See which files have changed:

```bash
git status
```

See the exact content of the changes:

```bash
git diff
```

Save changes in a local commit:

```bash
git add .
git commit -m "Prepare local workshop setup"
```

Push the branch to the fork:

```bash
git push origin workshop/local-docker-build-setup
```

Do not run `git push` unless explicitly asked.

## Troubleshooting

### Port 3333 already in use

Close the process using that port or change `PORT` in `.env`. If you change the port, also update the `3333:3333` mapping in the compose file before treating it as a permanent configuration.

### Docker is not running

Open Docker Desktop and wait until it indicates Docker is ready. Then run `./scripts/start.sh` or `.\scripts\start.ps1` again.

### PostgreSQL connection error

Run the check and review logs:

```bash
./scripts/check.sh
./scripts/logs.sh
```

The `postgres` service uses the variables `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` from `.env`.

### Redis connection error

Redis starts with a mandatory password. If it fails, check that `.env` has no remaining placeholders and review the logs:

```bash
./scripts/logs.sh
```

### `.env` does not exist

Run:

```bash
./scripts/start.sh
```

The script creates `.env` from `.env.example` and generates local secrets.

### `.env` has unreplaced placeholders

Search for placeholders:

```bash
grep '<INSERT_' .env
```

If any appear, run `./scripts/start.sh` again or replace them manually with safe values.

### Ghostfolio container restarting

Run:

```bash
./scripts/check.sh
./scripts/logs.sh
```

The most common causes are an incomplete `.env`, an unhealthy PostgreSQL, or an incorrect Redis password.

### Slow first build

This is normal. The first build installs dependencies, generates Prisma, and builds the full backend and frontend. Subsequent builds reuse Docker layer cache unless you use `rebuild`, which forces `--no-cache`.

### Differences between Mac and Windows

On Mac/Linux use `.sh` scripts. On Windows use `.ps1` scripts from PowerShell. Docker Desktop must be running in both cases. WSL2 is recommended on Windows.

### Reset the local installation

Mac / Linux:

```bash
./scripts/reset.sh
```

Windows:

```powershell
.\scripts\reset.ps1
```

This deletes the local database.

### View logs

Mac / Linux:

```bash
./scripts/logs.sh
```

Windows:

```powershell
.\scripts\logs.ps1
```

## Load demo data

Before loading data, make sure:

1. Ghostfolio is running.
2. You have already created the admin user from the UI.
3. You have the admin user's security token at hand.
4. The dataset is in `data/workshop/`.

The expected dataset lives in:

```text
data/workshop/import/
```

The seed script uses these three CSV files:

```text
myinvestor-core-etf.csv
trade-republic-growth.csv
crypto-exchange.csv
```

`ghostfolio-workshop-anomalies-do-not-import-main.csv` is not imported by default.

Note: the crypto CSV keeps Yahoo tickers `BTC-USD` and `ETH-USD`, but this version of Ghostfolio validates them as `BTCUSD` and `ETHUSD`. The seed script normalises them automatically when calling the API.

Mac / Linux:

```bash
./scripts/seed-workshop-data.sh
```

Windows:

```powershell
.\scripts\seed-workshop-data.ps1
```

The script uses the existing Ghostfolio HTTP API. Since this build has no email/password login, it will prompt for the Ghostfolio security token. Alternatively, for temporary local use you can pass it directly:

```bash
GHOSTFOLIO_ACCESS_TOKEN="your-security-token" ./scripts/seed-workshop-data.sh
```

`GHOSTFOLIO_AUTH_TOKEN` is also accepted if you already have a valid JWT.

The seed creates the following accounts if they are missing:

```text
MyInvestor Core ETF
Trade Republic Growth
Crypto Exchange
```

Each imported activity is tagged in its comment field with `WORKSHOP_DEMO_DATA`, so running the seed a second time will not create duplicate activities.

## Reset demo data

The reset only deletes activities tagged `WORKSHOP_DEMO_DATA`. It does not delete the admin user or any data unrelated to the workshop.

Mac / Linux:

```bash
./scripts/reset-workshop-data.sh
```

Without confirmation:

```bash
./scripts/reset-workshop-data.sh --force
```

Windows:

```powershell
.\scripts\reset-workshop-data.ps1
```

Without confirmation:

```powershell
.\scripts\reset-workshop-data.ps1 -Force
```

Demo accounts are only deleted if they were created by the seed and are empty after removing the demo activities.

## Note for future phases

This phase only gets Ghostfolio running locally with a build from source. In a later phase the following can be added:

```text
.opencode/
  context/
  agent/
  command/
  skills/
```

A backlog for implementing AI-assisted features such as a `Portfolio AI Assistant` can also be created then.
