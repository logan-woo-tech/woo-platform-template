# 0004. RLS Pattern: SECURITY DEFINER Functions

**Status:** Accepted
**Date:** 2026-04-27

## Context

Postgres RLS policies that reference other tables can cause infinite recursion (error 42P17). Common when checking user roles.

## Considered options

1. **SECURITY DEFINER helper functions** — Bypasses RLS for the check
2. **Inline EXISTS subqueries** — Simple but causes 42P17
3. **Application-level checks** — Removes DB safety net

## Decision

ALL RLS policies use SECURITY DEFINER helper functions. NEVER inline EXISTS subqueries.

## Rationale

- Prevents 42P17 infinite recursion
- Helper functions cacheable (STABLE marker)
- Centralized role/permission logic
- Maintains DB-level security

## Implementation

```sql
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role::text FROM user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Then use in policy:
CREATE POLICY "users_select_own_or_admin"
  ON learners FOR SELECT
  USING (auth.uid() = profile_id OR public.current_user_role() = 'admin');
```

## Anti-pattern (FORBIDDEN)

```sql
-- DON'T DO THIS — causes 42P17
CREATE POLICY "users_select_admin"
  ON learners FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
```

## Consequences

### Positive

- Eliminates infinite recursion errors
- Maintains DB-level authorization
- Performance better (function cached)

### Negative

- Slightly more setup code
- Must remember pattern for new tables

## References

- KI-010 in WOO Platform learnings
- Postgres docs on SECURITY DEFINER
