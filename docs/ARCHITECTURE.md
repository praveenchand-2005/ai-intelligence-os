# Architecture

## Monorepo direction

- `apps/web` — original investigation dashboard and workbench UI
- `apps/api` — authenticated API and orchestration boundary
- `packages/domain` — entities, cases, findings, evidence, graph and confidence contracts
- `packages/providers` — replaceable external data-provider adapters
- `packages/ai` — agent orchestration and grounded analysis contracts
- `packages/db` — schema, migrations and repositories
- `packages/ui` — reusable design-system components
- `tests` — unit, integration, contract and end-to-end tests
- `infra` — deployment and operational configuration

## Evidence model

A finding is never just model text. It is represented as:

`observation -> source -> timestamp -> normalized evidence -> correlation -> inference`

The UI must expose this chain so analysts can inspect why a conclusion exists.

## Provider layer

Providers implement stable internal contracts. Each adapter reports:

- availability
- latency
- rate-limit state
- freshness metadata
- source attribution
- normalized result
- provider error

Provider failures must degrade gracefully and must not be converted into fabricated results.

## AI layer

The orchestrator selects investigation tasks based on the case graph and evidence already collected. Agents may propose pivots, but collection and conclusions remain bounded by available evidence and provider permissions.
