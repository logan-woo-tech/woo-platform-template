# 0013. Template Instantiation Strategy

**Status:** Accepted
**Date:** 2026-04-27

## Context

Template ready cho instantiation by future projects. Need clear path để minimize friction when starting new projects.

## Decision

**Interactive setup script** at `scripts/setup.ts` automates customization:

- Replace package scope (@template → @your-org)
- Customize project name, brand colors
- Generate .env.local from .env.example
- Symlink env files cho monorepo + Next.js compatibility

**Manual steps documented** trong `docs/runbooks/`:

- Supabase setup
- Branch protection
- Deploy procedures

**Template stays as base**: Users clone, run `pnpm setup`, edit credentials.

## Rationale

- Setup script reduces 30+ manual replacements to single command
- Runbooks document one-time setup (Supabase, Vercel)
- README và CLAUDE.md updated post-setup với project specifics
- Symlink pattern handles monorepo + Next.js .env.local quirk

## Consequences

### Positive

- Fast project bootstrap (~10 min from clone to working dev server)
- Documented setup path
- Repeatable across projects
- Setup script idempotent (can re-run)

### Negative

- Setup script needs maintenance khi template evolves
- Edge cases (custom paths, special characters) may need manual fix
- Symlink may not work on all systems (Windows: requires admin)

## Implementation

- `scripts/setup.ts` — Interactive CLI
- `docs/runbooks/instantiate-template.md` — Step-by-step guide
- `docs/runbooks/setup-supabase.md` — Database setup
- README + CLAUDE.md placeholders for setup script to replace
