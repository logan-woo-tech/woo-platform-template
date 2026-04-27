# Layer 9: Operations

**Status:** Proposed (Phase 2)
**Frame:** B

---

## Deployment platform

**Vercel** for web app. Native Next.js support, zero-config CI/CD, generous free tier.

For mobile: **Expo EAS** for builds. App store deployment manual.

## CI/CD architecture

```
PR opened/updated
  ├─→ GitHub Actions (lint, typecheck, test, build, verify)
  ├─→ Vercel preview deployment (auto)
  └─→ Status checks block merge if any fail

Merge to main
  ├─→ GitHub Actions (same checks)
  ├─→ Vercel production deployment (auto)
  └─→ Health check verification post-deploy
```

## CI workflow

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: 24
  PNPM_VERSION: 10.32.1

jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      cache-key: ${{ steps.cache-key.outputs.value }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      - uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}
      - run: pnpm install --frozen-lockfile

  lint:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - run: pnpm typecheck

  test:
    needs: setup
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      ANTHROPIC_API_KEY: ${{ secrets.TEST_ANTHROPIC_API_KEY }}
    steps:
      - run: pnpm test

  build:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - run: pnpm build

  verify-conventions:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - run: pnpm verify:locales
      - run: pnpm verify:no-db-push
      - run: pnpm verify:anthropic-pin
      - run: pnpm verify:readmes

  commitlint:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: wagoid/commitlint-github-action@v5
```

**Total time target:** <5 minutes typical run.

## Custom verification scripts

**`scripts/verify-locales.ts`:**
- Compare en.json and vi.json keys
- Fail if mismatch

**`scripts/verify-no-db-push.ts`:**
- Search for `db:push` or `drizzle-kit push` in scripts
- Fail if found (hard constraint)

**`scripts/verify-anthropic-pin.ts`:**
- Check Anthropic SDK version exact-pinned
- Fail if `^` or `~` prefix

**`scripts/verify-readmes.ts`:**
- Every package has README.md
- Fail if missing

## Vercel CD

Native GitHub integration:
- PRs → preview deployments với unique URL
- Main → production deployment
- Auto-rollback if health check fails post-deploy

Vercel project setup:
- Build command: `pnpm build`
- Output directory: `.next`
- Install command: `pnpm install --frozen-lockfile`
- Framework preset: Next.js

Environment variables per environment (Dev/Preview/Production):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `DATABASE_URL`

## Health check endpoint

`apps/web/src/app/api/health/route.ts`:

```typescript
export async function GET() {
  const start = Date.now();

  // Check DB
  let dbStatus: 'ok' | 'down' = 'ok';
  try {
    await db.execute(sql`SELECT 1`);
  } catch {
    dbStatus = 'down';
  }

  // Check AI (lightweight ping)
  let aiStatus: 'ok' | 'down' = 'ok';
  try {
    // Could call cheap endpoint or check API key validity
    if (!process.env.ANTHROPIC_API_KEY) {
      aiStatus = 'down';
    }
  } catch {
    aiStatus = 'down';
  }

  const overallStatus =
    dbStatus === 'ok' && aiStatus === 'ok' ? 'ok' :
    dbStatus === 'down' ? 'down' :
    'degraded';

  return Response.json({
    status: overallStatus,
    version: process.env.NEXT_PUBLIC_VERSION ?? 'unknown',
    dependencies: {
      db: dbStatus,
      ai: aiStatus,
    },
    response_time_ms: Date.now() - start,
  }, {
    status: overallStatus === 'ok' ? 200 : 503,
  });
}
```

## Branch protection

GitHub repo settings → main branch:

```yaml
required_status_checks:
  - lint
  - typecheck
  - test
  - build
  - verify-conventions
  - commitlint

required_pull_request_reviews:
  required_approving_review_count: 1  # When team scales
  dismiss_stale_reviews: true
  require_review_from_code_owners: false

require_conversation_resolution: true
require_linear_history: true

restrictions:
  users: []
  teams: []

include_administrators: true
allow_force_pushes: false
allow_deletions: false
```

## Database migrations

**Manual application:** Drizzle generates files, founder applies via Supabase CLI.

**Why manual:**
- Auto-apply risky for production
- Migration failures can lock database
- Manual allows verification step-by-step

**Process:**

1. Write schema change in `packages/db/src/schema/`
2. Run `pnpm db:generate` → creates migration file
3. Review migration SQL
4. Apply locally: `supabase db push`
5. Apply staging: `supabase db push --remote staging`
6. Apply production: `supabase db push --remote production`
7. Verify success
8. Document in deploy log

**Future (v1.0+):** Auto-apply with safeguards (dry-run, rollback procedure).

## Logging

**Vercel native logs sufficient cho v0.1.**

Structured JSON logging:

```typescript
// packages/utils/src/logger.ts

export const logger = {
  debug: (message: string, meta?: any) => log('debug', message, meta),
  info: (message: string, meta?: any) => log('info', message, meta),
  warn: (message: string, meta?: any) => log('warn', message, meta),
  error: (message: string, meta?: any, error?: Error) =>
    log('error', message, { ...meta, error: serializeError(error) }),
};

function log(level: string, message: string, meta?: any) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
    request_id: getCurrentRequestId(),
  };
  console.log(JSON.stringify(entry));
}
```

Vercel captures stdout, searchable trong dashboard.

**Defer external logging (DataDog, Sentry) until v1.0+.**

## Monitoring

**v0.1:**
- Vercel analytics (built-in)
- Anthropic console (AI cost)
- Supabase dashboard (DB metrics)
- Manual review weekly

**v1.0+:**
- Sentry for error tracking
- DataDog or similar for APM
- Custom dashboards
- Automated alerts

## Alerts

**v0.1 minimal:**

1. Vercel deployment failure → email
2. Health check failure post-deploy → email + auto-rollback
3. AI cost daily budget exceeded → email

**Implementation:**

GitHub Actions cron job hourly:

```yaml
name: Cost Alerts
on:
  schedule:
    - cron: '0 * * * *'

jobs:
  check-ai-cost:
    runs-on: ubuntu-latest
    steps:
      - run: |
          COST=$(curl -X POST $API_URL/api/admin/cost-check)
          if [ $COST -gt $DAILY_BUDGET ]; then
            # Send email via SendGrid or similar
          fi
```

## Runbooks

`docs/runbooks/deploy-production.md`:

```markdown
# Deploy to Production

## When to use

Deploying changes from main to production.

## Pre-conditions

- [ ] All CI checks green on main
- [ ] No active incidents
- [ ] Approval from founder (or designated approver when team scales)

## Procedure

1. Verify CI green: https://github.com/{org}/{repo}/actions
2. Verify Vercel main branch deployment status: https://vercel.com/{team}/{project}
3. Production deployment auto-triggers from main push
4. Wait for deployment complete (~3-5 min)
5. Verify health endpoint: `curl https://{domain}/api/health`
6. Check Vercel logs for errors

## Verification

- Health endpoint returns 200
- Production URL loads
- Auth flow works
- No errors trong Vercel logs first 5 min

## Rollback

If issues detected within 30 min:
1. Revert problematic commit on main
2. Auto-deploy will roll out revert

If issues detected later:
1. Open Vercel dashboard
2. Promote previous deployment to production
3. Investigate root cause
4. Fix and redeploy

## Common issues

- **Build failure:** Check Vercel build logs, missing env var typical
- **DB migration not applied:** Apply manually via Supabase CLI
- **Health check fails post-deploy:** Auto-rollback, investigate
```

## Cost monitoring

Free tier sufficient cho v0.1:
- GitHub Actions: 2,000 min/month free
- Vercel Pro: included with $20/month plan
- Supabase free tier: 500MB DB, 2GB transfer
- Anthropic: pay-per-use, budget alerts

**Estimated monthly cost v0.1:**
- Vercel: $20
- Supabase: $0 (free tier)
- Anthropic: ~$50-100 (testing + light usage)
- GitHub: $0
- **Total: ~$70-120/month**

## Decision summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting | Vercel | Next.js native |
| CI | GitHub Actions | GitHub native |
| Health check | Deep (DB + AI) | Confidence |
| Monitoring | Vercel native v0.1 | Defer external |
| DB migrations | Manual | Safety > convenience |
| Logging | Structured JSON | Searchable |
| Alerts | Minimal v0.1 | Expand as needed |
| Rollback | Auto on health fail | Quick recovery |

---

*End of layer-9-operations.md*
