# Security token flow in Ghostfolio

## Insight

Ghostfolio's local/anonymous auth does NOT use email+password. Instead:

1. A **security token** (opaque short string) is generated at registration and stored (hashed) in the database.
2. Any client — browser or script — posts that token to `POST /api/v1/auth/anonymous` to receive a short-lived **JWT** (`authToken`).
3. The JWT is then sent as `Authorization: Bearer <token>` on every subsequent API request.

The seed scripts (`seed-workshop-data.sh`) accept the security token via:
- `GHOSTFOLIO_ACCESS_TOKEN` environment variable
- `GHOSTFOLIO_AUTH_TOKEN` if you already have the JWT
- Interactive prompt (hidden input) when neither env var is set

## Why this matters for facilitators

The most common workshop support question will be: *"Where is my token?"*
- It is in the Ghostfolio UI: Account → Security → Security Token.
- Participants often copy the JWT instead of the security token. The JWT starts with `eyJ...` and expires. The security token is shorter and permanent (until the DB is reset).

## Non-obvious detail

The env var is named `GHOSTFOLIO_ACCESS_TOKEN` in the scripts but Ghostfolio's internal field is `accessToken`. These refer to the same security token, not a JWT. The naming is confusing because the JWT is sometimes also called an "access token" in OAuth terminology — Ghostfolio uses neither term consistently.
