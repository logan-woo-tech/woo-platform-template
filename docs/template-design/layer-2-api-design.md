# Layer 2: API Design

**Status:** Proposed (Phase 2)
**Frame:** B
**Hard constraints applied:** No z.union/z.discriminatedUnion in AI outputs, OpenAPI auto-gen

---

## API architecture

**Choice: tRPC v11 vanilla client**

Reasoning: Type-safe end-to-end, no separate schema maintenance, integrates với Next.js App Router.

**Auto-generate OpenAPI** từ tRPC procedures via `trpc-openapi` for:
- B2B API documentation (future)
- Mobile client SDK generation
- Compliance documentation

## Folder structure

```
apps/web/src/server/
├── trpc/
│   ├── context.ts              # Request context (auth, db)
│   ├── trpc.ts                 # tRPC instance, middleware
│   ├── routers/
│   │   ├── _app.ts             # Root router
│   │   ├── auth.ts             # Auth procedures
│   │   ├── user.ts             # User procedures
│   │   ├── ai.ts               # AI echo, demo procedures
│   │   └── health.ts           # Health check
│   └── procedures/
│       ├── public.ts           # Public procedure builder
│       ├── authenticated.ts    # Authenticated procedure builder
│       └── admin.ts            # Admin-only procedure builder
└── api/
    └── trpc/
        └── [trpc]/route.ts     # tRPC HTTP handler
```

## Procedure types

```typescript
// Public — no auth required
publicProcedure
  .input(z.object({ ... }))
  .query/mutation(({ input }) => { ... })

// Authenticated — requires valid session
authenticatedProcedure
  .input(z.object({ ... }))
  .query/mutation(({ input, ctx }) => {
    // ctx.user available
  })

// Admin — requires admin role
adminProcedure
  .input(z.object({ ... }))
  .query/mutation(({ input, ctx }) => {
    // ctx.user with admin role
  })
```

## Error handling

Standard tRPC error codes:
- `BAD_REQUEST` (400) — Invalid input
- `UNAUTHORIZED` (401) — Not authenticated
- `FORBIDDEN` (403) — Authenticated but no permission
- `NOT_FOUND` (404) — Resource doesn't exist
- `CONFLICT` (409) — State conflict
- `INTERNAL_SERVER_ERROR` (500) — Server fault

Error response format:
```typescript
{
  error: {
    code: 'UNAUTHORIZED',
    message: 'User-friendly message',
    cause?: { ... } // Dev-only details
  }
}
```

## Initial procedures (template)

**Health check:**
```typescript
healthRouter.status: query() => {
  status: 'ok' | 'degraded' | 'down',
  version: string,
  dependencies: {
    db: 'ok' | 'down',
    ai: 'ok' | 'down'
  }
}
```

**Auth:**
```typescript
authRouter.me: authenticatedProcedure.query() => User | null
authRouter.signOut: authenticatedProcedure.mutation()
```

**User:**
```typescript
userRouter.getProfile: authenticatedProcedure.query() => Profile
userRouter.updateProfile: authenticatedProcedure.mutation(input)
```

**AI demo:**
```typescript
aiRouter.echo: authenticatedProcedure
  .input(z.object({ message: z.string() }))
  .mutation(async ({ input }) => {
    // Demonstrate AI integration
    // Falls back to template response if AI unavailable
  })
```

## Validation

**Zod schemas trong `packages/types`:**
- Single source of truth
- Reused server + client
- Type inference via `z.infer<typeof schema>`

**Hard constraint:** Never use `z.union()` or `z.discriminatedUnion()` in AI output schemas. Cause issues with Anthropic SDK structured output. Use flat schemas with optional fields instead.

## OpenAPI generation

Auto-generated at build time:
- File: `apps/web/openapi.json`
- Served at `/api/openapi.json`
- Swagger UI at `/api/docs` (authenticated only)

## Versioning strategy

**For v0.1-v1.0:** Single API version, no explicit versioning.

**For v2.0+ (when public API):**
- URL versioning: `/api/v1/`, `/api/v2/`
- Headers for variant selection
- Document in ADR when needed

**Don't over-engineer versioning v0.1.** Add when concrete need.

## Rate limiting

**v0.1:** None (Vercel native protection sufficient)
**v1.0+:** Implement when public API exposed
**Tooling:** Upstash Redis or similar when needed

## Pagination

When endpoints return lists:
```typescript
input: z.object({
  cursor: z.string().nullish(),
  limit: z.number().int().min(1).max(100).default(20)
})

output: z.object({
  items: z.array(itemSchema),
  nextCursor: z.string().nullable()
})
```

Cursor-based pagination (not offset-based) for stability.

## Decision summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API style | tRPC v11 | Type safety, no schema duplication |
| OpenAPI | Auto-gen via trpc-openapi | B2B + mobile SDK ready |
| Auth | 3 procedure types | Clear permission boundaries |
| Versioning | None v0.1 | Premature optimization |
| Rate limiting | None v0.1 | Defer until public API |
| Pagination | Cursor-based | Stability over UX simplicity |

---

*End of layer-2-api-design.md*
