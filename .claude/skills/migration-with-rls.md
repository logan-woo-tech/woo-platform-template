---
name: migration-with-rls
description: Create database migration with RLS SECURITY DEFINER pattern
---

When creating new tables that need row-level security:

1. **Define table schema** in `packages/db/src/schema/`
2. **Generate Drizzle migration**: `pnpm db:generate`
3. **Append RLS section to generated SQL**:
   - Helper functions with `SECURITY DEFINER STABLE SET search_path = public`
   - `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
   - Policies using helper functions (NEVER inline EXISTS subqueries)
4. **Apply via Supabase Studio SQL Editor** (manual, NEVER `db:push`)
5. **Verify** via `SELECT tablename, rowsecurity FROM pg_tables`

## Critical anti-pattern

NEVER use inline EXISTS subqueries in policies:

```sql
-- WRONG — causes 42P17 infinite recursion
CREATE POLICY "..." USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
```

ALWAYS use SECURITY DEFINER helper:

```sql
-- RIGHT
CREATE POLICY "..." USING (public.has_role('admin'));
```

## Cross-schema FK pattern

For FK to `auth.users(id)` (Supabase Auth managed):

- Don't use Drizzle `.references()` (cross-schema not supported well)
- Add via raw SQL in migration:

```sql
ALTER TABLE my_table
  ADD CONSTRAINT my_table_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

## Reference

ADR-0004: docs/decisions/0004-rls-security-definer.md
