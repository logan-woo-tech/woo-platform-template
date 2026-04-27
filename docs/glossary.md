# Glossary

Project-specific terms and concepts.

## Technical terms

### ADR (Architecture Decision Record)

Documents architectural decisions với context, options considered, decision, rationale, và consequences. Located trong `docs/decisions/`. Once Accepted, immutable — supersede via new ADR.

### Cross-schema FK

Foreign key reference between tables in different Postgres schemas (e.g., `public.user_roles` referencing `auth.users`). Drizzle ORM doesn't support natively — done via raw SQL trong migrations.

### Degraded mode

Fallback behavior when primary path fails. Implemented via `withFallback()` helper trong `@template/ai`. Mandatory for every AI feature.

### Drizzle ORM

TypeScript ORM for SQL databases. Used với generate-only migration pattern. NEVER `db:push` (forbidden by hard constraint).

### Frame B

Speed-optimized execution mode where Claude makes decisions based on best practices + hard constraints, accepting some rework risk in exchange for velocity.

### Pool max=1

Database connection pool size constraint. Each function instance opens 1 connection. Supavisor pooler multiplexes on server side. Prevents connection exhaustion in serverless.

### RLS (Row-Level Security)

Postgres feature for fine-grained access control at row level. Critical for multi-tenant apps. Always enabled per table với SECURITY DEFINER helper functions.

### SECURITY DEFINER

Postgres function attribute making function run với privileges of function creator (not caller). Used trong helper functions to bypass RLS for permission checks. Required pattern (KI-010).

### Skill (Claude Code)

Reusable instruction file in `.claude/skills/`. Provides Claude Code với specific guidance for common tasks.

### Subagent (Claude Code)

Specialized Claude Code instance with isolated context, defined trong `.claude/agents/`. Used for specific tasks like plan review.

### Supavisor

Supabase's connection pooler. Listens on port 6543, multiplexes many client connections to fewer database connections. Used cho runtime via `DATABASE_URL`.

### tRPC

Type-safe RPC framework. Used cho API layer with auto-generated TypeScript types end-to-end. Procedures organized trong `apps/web/src/server/trpc/routers/`.

### Use case (AI)

Identifier passed to `callAI()` for tracking và model selection. Format: `{feature}_v{N}` (e.g., `welcome_message_v1`). Versioned for evolution.

### withFallback

Helper function trong `@template/ai` enforcing degraded mode pattern. Takes primary async function + fallback function. If primary throws, returns fallback result.

## Add terms here

When term used 2+ times trong repo, add definition here.
