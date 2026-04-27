# 0007. Supabase Auth

**Status:** Accepted
**Date:** 2026-04-27

## Decision

Supabase Auth for authentication (vs Auth.js, Clerk, custom).

## Rationale

- Tight integration với Supabase Postgres (RLS uses auth.uid())
- Built-in email verification, magic links, OAuth
- Generous free tier
- HTTPOnly cookies via @supabase/ssr
- Server Component compatible

## Trade-offs

### Pro

- Single vendor (auth + DB + storage)
- Battle-tested
- Free tier generous

### Con

- Vendor lock-in (migration painful)
- Less customizable than custom solution
- UI components limited
