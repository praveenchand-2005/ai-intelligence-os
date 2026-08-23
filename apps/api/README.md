# API application

Authenticated API and orchestration boundary for cases, investigations, evidence, provider adapters, graph operations, AI agents and monitoring.

## Development

```bash
npm install
npm test --workspace @aio/api
npm start --workspace @aio/api
```

The service uses `DATABASE_URL` when present and falls back to memory when it is absent. Never commit database credentials.
