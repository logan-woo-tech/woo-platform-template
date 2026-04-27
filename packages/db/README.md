# @template/db

Drizzle ORM client and schema definitions.

## Hard constraints

- **DB pool max=1** — Sequential queries only
- **Drizzle generate-only** — NEVER `db:push`
- **RLS SECURITY DEFINER** — All RLS policies use helper functions
- **FK to `(profile_id)`** — Not `(id)`

## Usage

```typescript
import { db } from '@template/db';

const result = await db.select().from(table);
```

## Migrations

Generate migrations:

```bash
pnpm db:generate
```

Apply manually via Supabase CLI (NEVER auto-apply, NEVER `db:push`).
