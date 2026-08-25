# CashFlowOS API contract

Production API boundary for the web application. All endpoints are organization-scoped.

## Overview
- `GET /api/overview` — KPI cards, collection opportunity, promises due today, orders waiting, credit-risk count.
- `GET /api/customers` — customer list with outstanding, aging, payment behavior and risk score.
- `GET /api/customers/:id` — customer intelligence profile and recommendation.
- `GET /api/invoices` — invoice balances and aging.
- `POST /api/payments` — record a payment and recompute balances.
- `GET /api/promises` — pending, fulfilled and broken promises.
- `POST /api/promises` — create a promise-to-pay.
- `PATCH /api/promises/:id` — resolve/update promise status.
- `GET /api/orders` — order queue and credit decisions.
- `POST /api/orders` — create an order draft.
- `POST /api/orders/:id/credit-check` — calculate exposure and return approve/request-payment/hold recommendation.
- `POST /api/orders/:id/decision` — owner approves, requests payment or holds.
- `GET /api/collection/queue` — AI/rules-ranked collection opportunities.
- `POST /api/collection/drafts` — create a personalized follow-up draft with evidence.
- `POST /api/imports/receivables` — validate/import CSV or Excel receivables.
- `POST /api/whatsapp/webhook` — receive WhatsApp Business messages after provider verification.
- `POST /api/whatsapp/send` — send an approved outbound message through the configured provider.

## Safety rules
1. AI may recommend and draft; it must not automatically send collection messages or approve credit without an explicit organization policy.
2. Every recommendation stores evidence references and a generated-at timestamp.
3. Payment amounts are immutable ledger records; corrections are compensating entries, not destructive edits.
4. All tenant-owned records must be filtered by `organization_id`.
