# 0009. Database Connection Strategy

**Status:** Accepted
**Date:** 2026-04-27

## Context

Supabase provides multiple connection methods. Serverless deployments (Vercel) require connection pooling to avoid exhausting Postgres connections (~60 limit on free tier, ~200 on Pro).

Direct connections from many concurrent serverless function instances quickly exhaust the connection limit, causing app failures.

## Considered options

1. **Direct connection only** (port 5432) — Simple but exhausts connections
2. **Pooler only** (port 6543) — Solves runtime but breaks DDL migrations
3. **Two connection strings** — Pooler for runtime, direct for migrations

## Decision

Use TWO connection strings:

- `DATABASE_URL` — Supavisor transaction pooler (port 6543) for runtime
- `DIRECT_URL` — Direct Postgres connection (port 5432) for migrations

## Rationale

### Why pooler for runtime

- Vercel functions stateless
- Many concurrent instances
- Free tier ~60 connections, easily exhausted
- Supavisor transaction-level pooling multiplexes efficiently

### Why direct for migrations

- DDL operations (CREATE TYPE, ALTER TABLE) need session
- Transaction pooler incompatible with some DDL
- Migrations infrequent — direct connection acceptable

## Implementation

`packages/db/src/client.ts` uses `DATABASE_URL` (pooler).
`packages/db/drizzle.config.ts` uses `DIRECT_URL` (direct) for migrations.

Pool `max=1` constraint still applies on client side (each function instance).
Supavisor handles multiplexing on server side.

## Consequences

### Positive

- Scales serverless workload
- Migrations work reliably
- Standard pattern for Vercel + Supabase

### Negative

- Two URLs to manage in env
- Slightly more env var complexity
- Onboarding requires understanding both URLs

## References

- Supabase connection docs
- Pool max=1 hard constraint (CLAUDE.md)
