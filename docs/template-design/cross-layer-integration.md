# Cross-Layer Integration

**Status:** Proposed (Phase 2)
**Frame:** B

---

## Layer dependency map

```
Layer 1 (Code) ─── foundation for ──→ Everything

Layer 6 (Security) ──── enforces ────→ Layer 2 (API), Layer 5 (Data)
                  ──── stored in ────→ Layer 1 (Code), packages/auth

Layer 2 (API) ──── consumed by ─────→ Layer 3 (Design), apps
              ──── auto-generates ──→ OpenAPI (Layer 8 docs)

Layer 7 (AI) ──── secured by ───────→ Layer 6 (Security)
              ──── traced by ───────→ Layer 5 (Data)
              ──── tested by ───────→ Layer 9 (Operations CI evals)

Layer 3 (Design) ── consumed by ────→ apps (web + mobile)
                 ── tokens used by ──→ All UI

Layer 4 (i18n) ──── used by ────────→ Layer 3 (Design components)
                ── enforced by ─────→ Layer 9 (CI verify-locales)

Layer 5 (Data) ─── tracks ──────────→ All user actions
              ─── secured by ──────→ Layer 6 (no PII without consent)

Layer 8 (Knowledge) ── governs ─────→ Everything
                    ── PR template ──→ Layer 9 (CI checks)

Layer 9 (Ops) ──── deploys ──────────→ Apps
              ──── enforces ─────────→ Conventions (Layer 8)
              ──── monitors ─────────→ Layer 7 (AI cost), Layer 6 (security)
```

## Critical integrations

### Auth (L6) ↔ API (L2)

**tRPC middleware uses auth helpers:**

```typescript
// apps/web/src/server/trpc/procedures/authenticated.ts

import { requireAuth } from '@woo/auth/server';
import { protectedProcedure } from '../trpc';

export const authenticatedProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await requireAuth(ctx.req);
  return next({ ctx: { ...ctx, user } });
});
```

**RLS enforces what API allows:**

If API allows query, RLS still verifies row-level access. Defense in depth.

### Auth (L6) ↔ DB (L1 packages/db)

**Drizzle schema includes auth references:**

```typescript
// packages/db/src/schema/learners.ts

import { authUsers } from './auth-users';

export const learners = pgTable('learners', {
  profile_id: uuid('profile_id').primaryKey().references(() => authUsers.id),
  // ... other fields
});
```

**FK references `(profile_id)` not `(id)`** (hard constraint).

### AI (L7) ↔ Security (L6)

**Auth required for AI calls:**

```typescript
const aiCallProcedure = authenticatedProcedure
  .input(/* ... */)
  .mutation(async ({ input, ctx }) => {
    // ctx.user available, used for tracking
    return callAI({
      ...input,
      metadata: { userId: ctx.user.id },
    });
  });
```

**Rate limiting per user:**

Check user's recent AI usage before allowing call. Prevent abuse.

### AI (L7) ↔ Data (L5)

**Every AI call tracked:**

```typescript
async function callAI(opts: AICallOptions) {
  const result = await client.messages.create({...});

  // Track in ai_call_log table (Layer 6 schema)
  await trackAICall({...});

  // Also send PostHog event (Layer 5)
  posthog.capture({
    event: 'ai_call_completed',
    properties: {
      model: opts.model,
      use_case: opts.useCase,
      duration_ms,
      tokens: result.usage,
    },
  });

  return result;
}
```

Dual tracking: DB for cost analysis, PostHog for product analytics.

### i18n (L4) ↔ Design (L3)

**Components use translations:**

```typescript
import { useTranslations } from 'next-intl';
import { Button } from '@woo/ui';

export function SubmitButton() {
  const t = useTranslations('common.buttons');
  return <Button>{t('submit')}</Button>;
}
```

**Component design supports translation expansion** (Vietnamese ~30% longer).

### Knowledge (L8) ↔ Operations (L9)

**Conventions enforced via CI:**

| Convention (L8) | CI check (L9) |
|-----------------|---------------|
| Conventional Commits | commitlint job |
| Locale completeness | verify-locales script |
| README per package | verify-readmes script |
| ADR format | (manual review for v0.1) |
| No db:push | verify-no-db-push script |
| Anthropic exact-pin | verify-anthropic-pin script |

### Code (L1) ↔ Operations (L9)

**Build pipeline:**

```
pnpm install
  ↓
turbo run build (parallel where possible)
  ├─ packages/types build
  ├─ packages/utils build
  ├─ packages/db build (depends on types)
  ├─ packages/auth build (depends on types, db)
  ├─ packages/ui build
  ├─ packages/ai build (depends on types)
  ├─ apps/web build (depends on all packages)
  └─ apps/mobile build (depends on packages)
```

Turborepo caches outputs. Repeated builds <1 second if no changes.

## Boundary rules

### Apps don't depend on apps

`apps/web` cannot import from `apps/mobile`. They're separate.

If shared code needed → extract to `packages/`.

### Packages can depend on packages

`packages/auth` depends on `packages/types` and `packages/db`.

But: no circular dependencies. CI catches via `madge` or similar.

### Apps depend on packages

`apps/web` imports from `@woo/auth`, `@woo/ui`, etc.

Apps consume packages, not other way around.

### Forbidden imports

```typescript
// ❌ App imports from another app
import { something } from '../../mobile/...';

// ❌ Package imports from app
import { something } from '../../../apps/web/...';

// ❌ Direct file imports across package boundaries
import { something } from '../../auth/src/internal';

// ✅ Package imports from package via package name
import { something } from '@woo/auth';
```

CI enforces import boundaries via ESLint rule.

## Data flow examples

### User signup flow

```
1. User submits signup form (apps/web)
   ↓
2. Zod validates input (packages/types)
   ↓
3. tRPC procedure receives (apps/web/src/server/trpc)
   ↓
4. Supabase Auth creates user (packages/auth)
   ↓
5. Drizzle inserts profile (packages/db)
   ↓
6. RLS policy allows insert (Layer 6)
   ↓
7. PostHog tracks signup (packages/utils/analytics)
   ↓
8. AI welcome message generated (packages/ai)
   ├─ Tracks cost in ai_call_log (Layer 5)
   └─ Falls back to template if AI unavailable (degraded mode)
   ↓
9. Response sent to client
   ↓
10. Client tracks signup_completed event (Layer 5)
```

This flow exercises 7+ layers in single user action.

### AI feature flow

```
1. User triggers AI feature (apps/web)
   ↓
2. tRPC procedure receives (Layer 2)
   ↓
3. Auth middleware verifies user (Layer 6)
   ↓
4. Rate limit check (Layer 6 + Layer 7)
   ↓
5. Select model based on use case (Layer 7 ADR-014)
   ↓
6. Call Anthropic SDK (Layer 7)
   ├─ Try primary model
   ├─ Track token usage
   └─ Fall back if needed (degraded mode)
   ↓
7. Log to ai_call_log (Layer 6 schema)
   ↓
8. PostHog event (Layer 5)
   ↓
9. Response to user (formatted via Layer 3)
   ↓
10. Locale-aware text (Layer 4)
```

## Decision summary

| Integration | Pattern | Rationale |
|-------------|---------|-----------|
| Auth ↔ API | tRPC middleware | Pre-database check |
| Auth ↔ DB | Drizzle FK | Type-safe relationships |
| AI ↔ Security | Auth required | Prevent abuse |
| AI ↔ Data | Dual tracking | Cost + analytics |
| i18n ↔ Design | useTranslations hook | Standard pattern |
| Knowledge ↔ Ops | CI enforces | Convention reality |
| Code ↔ Ops | Turborepo caching | Build performance |
| Boundaries | ESLint enforced | Prevent erosion |

---

*End of cross-layer-integration.md*
