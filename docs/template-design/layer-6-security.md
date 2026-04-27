# Layer 6: Security

**Status:** Proposed (Phase 2)
**Frame:** B
**Hard constraints applied:** SECURITY DEFINER pattern (KI-010), FK to learner_profiles(profile_id) not (id)

---

## Auth architecture

**Supabase Auth + Postgres RLS**

JWT-based, HTTP-only cookies, server-side session management via `@supabase/ssr`.

## Auth flows

**v0.1 starter:**

1. **Email + password** (primary, familiar)
2. **Email magic link** (secondary, passwordless option)

**Defer to v1.0+:**
- OAuth (Google, GitHub)
- Multi-factor authentication
- Phone OTP

## Auth implementation

`packages/auth/src/`:

```
packages/auth/
├── src/
│   ├── client.ts               # Supabase client (browser + server)
│   ├── server.ts               # Server-side helpers
│   ├── middleware.ts           # Route protection middleware
│   ├── helpers/
│   │   ├── requireAuth.ts      # Throws if not authenticated
│   │   ├── requireRole.ts      # Throws if missing role
│   │   ├── getUser.ts          # Gets current user (nullable)
│   │   └── hasPermission.ts    # Permission check
│   ├── types.ts                # Auth types
│   └── index.ts                # Public API
└── package.json
```

## Auth helpers

```typescript
// requireAuth — throw if not authenticated
export async function requireAuth(): Promise<User> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return user;
}

// requireRole — throw if missing role
export async function requireRole(role: Role): Promise<User> {
  const user = await requireAuth();
  const userRole = await getUserRole(user.id);
  if (userRole !== role) throw new TRPCError({ code: 'FORBIDDEN' });
  return user;
}
```

## RLS pattern (CRITICAL)

**Hard constraint: ALL RLS policies use SECURITY DEFINER functions.**

Reason: Inline `EXISTS (SELECT FROM user_roles)` causes Postgres 42P17 infinite recursion.

### Pattern

```sql
-- Helper function (bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role
  FROM user_roles
  WHERE user_roles.user_id = $1
  LIMIT 1;
$$;

-- Policy uses helper function
CREATE POLICY "users_select_own_or_admin"
  ON learners FOR SELECT
  USING (
    auth.uid() = profile_id
    OR public.get_user_role(auth.uid()) = 'admin'
  );
```

**WRONG pattern (causes 42P17):**

```sql
-- DON'T DO THIS
CREATE POLICY "users_select"
  ON learners FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

## RLS conventions

1. **All tables have RLS enabled** by default
2. **Default deny** — explicit policies grant access
3. **One policy per role per operation** (SELECT, INSERT, UPDATE, DELETE)
4. **Policies use helper functions** (not inline subqueries)
5. **Test với real database** (no mocks)

## Initial schema (template)

```sql
-- 0001_users_and_roles.sql

CREATE TABLE auth_users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TYPE user_role AS ENUM ('learner', 'gv', 'lc', 'admin');

CREATE TABLE user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth_users(id),
  role user_role NOT NULL DEFAULT 'learner'
);

-- Helper functions
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role::text
  FROM user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.current_user_role() = required_role;
$$;

-- Enable RLS
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "users_select_own"
  ON auth_users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "users_select_admin"
  ON auth_users FOR SELECT
  USING (public.has_role('admin'));

-- Repeat per table...
```

## Authorization layers

**3-layer defense in depth:**

1. **Database (RLS)** — Final enforcement, can't bypass
2. **API (tRPC middleware)** — Pre-database checks
3. **UI** — Hide unauthorized actions (UX, không security)

If UI bug shows admin button to learner, RLS prevents action. Defense holds.

## Secrets management

**Environment variables:**

```bash
# .env.example (committed)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
DATABASE_URL=
NEXTAUTH_SECRET=
```

**Rules:**

1. `NEXT_PUBLIC_*` = client-side (visible in browser)
2. Other = server-side only
3. `.env.local` gitignored (never committed)
4. Vercel env vars set per environment (dev, preview, prod)
5. Service role key NEVER exposed to client

## Service role key usage

**Strict server-side only.** Used for:
- Admin operations bypassing RLS
- Migration scripts
- Webhook handlers requiring elevated access

**Pattern:**

```typescript
// packages/db/src/admin.ts (server-only)
import 'server-only'; // Throws if imported in client

import { createClient } from '@supabase/supabase-js';

export const adminDb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
```

## Audit logging

**v0.1 minimal:**
- Auth events logged (signup, signin, password change)
- Admin actions logged (when role changed)
- Stored in `audit_log` table

**Defer to v1.0+:**
- Full data access trails
- Compliance reports
- External SIEM integration

## Email verification

**Mandatory** — account inactive until email verified.

Reasoning:
- Prevents fake accounts
- Confirms communication channel
- Enables password recovery

Trade-off: signup friction. Acceptable.

## Session duration

**Default: 24 hours với refresh token rotation.**

- Active session: 1 hour access token
- Refresh token: 24 hour validity
- Auto-refresh on activity

User stays logged in for 24h of inactivity. Active users effectively unlimited.

## Password policy

- Minimum 8 characters
- At least 1 letter + 1 number
- No common passwords (top 1000 list)
- Bcrypt hashing (Supabase default)

Don't enforce special characters (UX friction, marginal security).

## Compliance posture

**v0.1:** Privacy by design, no formal compliance
**v1.0+:** GDPR-ready when EU users
**v2.1+:** Local data residency per region

For Vietnam market specifically:
- No formal data residency law (yet)
- Best practice: store in nearest region (Singapore for Supabase)
- Document in privacy policy

## Decision summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth provider | Supabase Auth | Our stack, RLS integration |
| Primary auth | Email + password | Familiar UX |
| RLS pattern | SECURITY DEFINER functions | Avoid 42P17 recursion |
| Authorization | 3-layer defense | RLS + API + UI |
| Email verification | Mandatory | Prevent fake accounts |
| Session duration | 24h with rotation | UX vs security balance |
| Service role | Server-only strict | Prevent client exposure |
| Audit logging | Minimal v0.1 | Auth events only |
| Compliance | Defer formal | Premature for v0.1 |

---

*End of layer-6-security.md*
