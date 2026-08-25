-- PostgreSQL schema for durable intelligence cases and evidence.
create extension if not exists pgcrypto;
create table if not exists investigation_cases (
  id uuid primary key default gen_random_uuid(),
  target text not null,
  kind text,
  status text not null default 'collecting',
  result jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists evidence (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references investigation_cases(id) on delete cascade,
  provider text not null,
  title text not null,
  summary text not null,
  source_url text,
  observed_at timestamptz,
  retrieved_at timestamptz not null default now(),
  payload jsonb,
  content_hash text
);
create index if not exists evidence_case_idx on evidence(case_id);
create index if not exists evidence_provider_idx on evidence(provider);
create table if not exists entities (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  canonical_value text not null,
  display_name text,
  attributes jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(type, canonical_value)
);
create table if not exists case_entities (
  case_id uuid not null references investigation_cases(id) on delete cascade,
  entity_id uuid not null references entities(id) on delete cascade,
  primary key(case_id, entity_id)
);
create table if not exists relationships (
  id uuid primary key default gen_random_uuid(),
  from_entity_id uuid not null references entities(id) on delete cascade,
  to_entity_id uuid not null references entities(id) on delete cascade,
  relation_type text not null,
  confidence numeric(5,4) not null default 0,
  evidence_ids uuid[] not null default '{}'
);
create table if not exists findings (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references investigation_cases(id) on delete cascade,
  kind text not null check(kind in ('observation','correlation','inference')),
  statement text not null,
  evidence_ids uuid[] not null default '{}',
  confidence numeric(5,4) not null default 0,
  created_at timestamptz not null default now()
);
