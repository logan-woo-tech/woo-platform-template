# CLAUDE.md

This file provides guidance to Claude Code when working in this repo.

## Project context

This is an AI-native platform built on a 9-layer architecture template.

Built using:

- Next.js 15.5 App Router (React 19, TypeScript 5.9 strict, Tailwind 4)
- Monorepo (pnpm + Turborepo)
- Supabase (Postgres + Auth + RLS)
- Anthropic SDK (AI integration)
- tRPC v11 (API layer)
- next-intl (i18n: vi default + en)
- PostHog (analytics, opt-in)
- Vercel (hosting)

## Hard constraints (NEVER violate)

### TypeScript

- Strict mode required
- No `any` without explicit comment justification
- All AI output schemas must use **flat Zod schemas**
- NEVER use `z.union` or `z.discriminatedUnion` in AI outputs

### Database

- DB pool **max=1** — Sequential queries only
- **Drizzle generate-only** — NEVER `db:push`
- **RLS SECURITY DEFINER pattern** — NEVER inline `EXISTS` subqueries (causes 42P17 recursion)
- FK to `auth.users(id)` via raw SQL trong migrations (cross-schema)

### AI Integration

- **Anthropic SDK exact-pin** — No `^` or `~` prefixes
- **callAI() only** — Never direct SDK in feature code
- **withFallback() mandatory** — Every AI feature has 2+ layers
- **Opus reserved** for 4 approved use cases (see `packages/ai/src/models.ts`)
- **PII never to AI** — Sanitize prompts before sending
- **Every AI call logged** to `ai_call_log` table

### Security

- **Service role key SERVER-ONLY** — Never expose to client
- **Auth required** for sensitive endpoints (use authenticated/admin tRPC procedures)
- **Cookie-based consent** for analytics tracking

### File organization

- Avoid `_` prefix trong API route names (Next.js private convention)
- `.env.local` symlink: `apps/web/.env.local` → root `.env.local`

## Workflow

1. **Plan** → discuss approach with human first
2. **Write Prompt** → if delegating to subagent
3. **Review Plan** → fresh-eyes check
4. **Build** → execute, request approval at irreversible operations
5. **Test** → verify locally (compile + smoke test where applicable)
6. **Docs** → update ADRs, runbooks, conventions
7. **/clear** → reset context between phases

### Approval-First mandatory checkpoints

Pause for human approval before:

- Applying database migrations
- Deleting/renaming files outside scope
- Modifying secrets/credentials
- Force pushes
- Direct main branch operations (rare; PRs preferred)

## Communication

- **Vietnamese** for strategy/discussion
- **English** for code, commits, docs, file names
- Direct pushback và safety checks valued
- Pre-flight git check mandatory before feature branches

## Reference

- **Architecture:** `docs/template-design/` (9 layer docs)
- **ADRs:** `docs/decisions/` (locked decisions)
- **Conventions:** `docs/conventions/` (code/git/pr/docs/tests/ai)
- **Runbooks:** `docs/runbooks/` (operational procedures)
- **Skills:** `.claude/skills/` (reusable instructions)
- **Agents:** `.claude/agents/` (specialized subagents)

## Common tasks

### Add new database table

1. Read `.claude/skills/migration-with-rls.md`
2. Define schema trong `packages/db/src/schema/`
3. Generate migration: `pnpm db:generate`
4. Append RLS section using SECURITY DEFINER pattern
5. Apply via Supabase Studio SQL Editor (manual, never `db:push`)

### Add new AI feature

1. Read `.claude/skills/ai-prompt-pattern.md`
2. Create prompt: `docs/prompts/{feature}-v1.md`
3. Implement: `packages/ai/src/prompts/{feature}-v1.ts`
4. Use `callAI()` + `withFallback()` pattern
5. Add eval: `packages/ai/evals/{feature}.yaml`
6. Track via versioned `useCase` (e.g., `welcome_message_v1`)

### Add new API route

1. Read `.claude/skills/api-route-conventions.md`
2. Use kebab-case folder name (no `_` prefix)
3. Create `apps/web/src/app/api/{route}/route.ts`
4. For authenticated endpoints, use tRPC procedures instead

### Add new UI component

1. Place in `packages/ui/src/components/`
2. Use `forwardRef` for DOM-wrapping components
3. Apply Tailwind classes via `cn()` from `@template/utils`
4. Export từ `packages/ui/src/index.ts`
5. Add to playground at `/[locale]/playground` for testing
