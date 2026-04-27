# Runbook: Setup Supabase Project

**Last updated:** 2026-04-27

## When to use

Setting up Supabase for new project instantiated from template.

## Pre-conditions

- Supabase account (https://supabase.com — free tier available)
- Project instantiated từ template

## Procedure

### Step 1: Create Supabase project

1. Open https://supabase.com/dashboard
2. Create new organization (free)
3. Create new project:
   - Project name: `your-project-dev`
   - Database password: Generate strong, save securely
   - Region: closest to your users (Singapore for SEA)
   - Plan: Free (sufficient for v0.1)
   - Security:
     - Enable Data API
     - Disable "Automatically expose new tables" (manual control)
     - Disable "Enable automatic RLS" (handled in migrations)

Wait ~2 min for provisioning.

### Step 2: Get credentials

**Settings → API:**

- Copy Project URL
- Copy anon public key
- Copy service_role secret key (keep secure)

**Settings → Database → Connection string:**

- Copy "Transaction pooler" string (port 6543) → `DATABASE_URL`
- Copy "Direct connection" string (port 5432) → `DIRECT_URL`

Both với same password.

### Step 3: Update .env.local

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Database — pooler for runtime, direct for migrations
DATABASE_URL=postgresql://postgres.xxxxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

### Step 4: Apply migrations

Open Supabase dashboard → SQL Editor → New query.

Paste contents of `packages/db/migrations/0000_*.sql` — Run.

Verify success: Database → Tables shows `user_roles`, `ai_call_log`.

### Step 5: Verify connection

```bash
pnpm dev
curl http://localhost:3000/api/health
```

Should return:

```json
{
  "status": "ok",
  "dependencies": {
    "db": "ok",
    "ai": "ok"
  }
}
```

If `db: down`:

- Check DATABASE_URL format (port 6543 for pooler)
- Check password URL-encoded if has special chars
- Check Supabase project active (free tier auto-pauses after inactivity)

## Common issues

| Issue                            | Fix                                                  |
| -------------------------------- | ---------------------------------------------------- |
| Connection timeout               | Project paused (free tier), resume from dashboard    |
| Permission denied on auth schema | Use Supabase Studio SQL Editor (runs as superuser)   |
| pgcrypto missing                 | Run `CREATE EXTENSION IF NOT EXISTS pgcrypto;` first |
