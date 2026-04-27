---
name: api-route-conventions
description: Next.js App Router conventions for API routes
---

## File structure

```
apps/web/src/app/api/
  health/route.ts          ← /api/health
  trpc/[trpc]/route.ts     ← /api/trpc/...
  feature-name/route.ts    ← /api/feature-name
```

## Naming rules

- Use **kebab-case** for folder names
- **AVOID `_` prefix** — Next.js treats as private (not routed)
- File MUST be named `route.ts` (not `index.ts`, not `feature.ts`)
- Each route folder = one route segment

## Route handler pattern

```typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // ...
  return NextResponse.json({ ... });
}

export async function POST(request: Request) {
  const body = await request.json();
  // ...
}
```

## Authentication pattern

Use tRPC procedures for authenticated endpoints:

```typescript
// apps/web/src/server/trpc/routers/feature.ts
import { authenticatedProcedure, router } from '../trpc';

export const featureRouter = router({
  doThing: authenticatedProcedure
    .input(...)
    .mutation(async ({ input, ctx }) => {
      // ctx.user available
    }),
});
```

Plain route handlers (`route.ts`) for:

- Public endpoints (health checks)
- Webhooks
- File uploads

## Environment variables

For monorepo + Next.js:

- `.env.local` MUST be in `apps/web/` (not just root)
- Use symlink: `ln -sf ../../.env.local apps/web/.env.local`
- Don't commit symlink (gitignored)
