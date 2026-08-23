# Persistence

The API supports durable PostgreSQL persistence through `DATABASE_URL`.

At startup, the API creates the required case/evidence tables if they do not exist. When `DATABASE_URL` is absent, the service intentionally falls back to the in-process store so local development remains usable.

## Production configuration

Set `DATABASE_URL` to the private connection string for the application's PostgreSQL database. Do not commit credentials. Render or another deployment provider should inject the secret as an environment variable.

Persisted records include investigation target, status, provider result, evidence, source list, findings, timestamps, and provider evidence payloads. Evidence is keyed to its case and retained independently for future graph/reporting layers.
