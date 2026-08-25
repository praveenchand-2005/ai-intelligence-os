create extension if not exists pgcrypto;
create table if not exists investigation_cases (
 id uuid primary key,
 target text not null,
 status text not null,
 kind text,
 result jsonb,
 evidence jsonb not null default '[]'::jsonb,
 sources jsonb not null default '[]'::jsonb,
 findings jsonb not null default '[]'::jsonb,
 error text,
 created_at timestamptz not null,
 updated_at timestamptz not null,
 completed_at timestamptz
);
create index if not exists investigation_cases_created_idx on investigation_cases(created_at desc);
create table if not exists evidence_items (
 id text primary key,
 case_id uuid not null references investigation_cases(id) on delete cascade,
 provider text not null,
 title text not null,
 summary text not null,
 source_url text,
 observed_at timestamptz,
 retrieved_at timestamptz not null,
 payload jsonb
);
create index if not exists evidence_case_idx on evidence_items(case_id);
