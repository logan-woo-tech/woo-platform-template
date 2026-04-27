# CLAUDE.md

This file provides guidance to Claude Code when working in this repo.

## Project context

This is a template repo for AI-native platform projects with 9-layer architecture.
Inspired by WOO Platform's architecture but generalized for reuse.

## Hard constraints (NEVER violate)

1. **TypeScript strict mode** — Always
2. **ESM modules only** — No CommonJS
3. **Anthropic SDK exact-pin** — No `^` or `~` prefixes
4. **DB pool max=1** — Sequential queries only
5. **Drizzle generate-only** — NEVER `db:push`
6. **RLS SECURITY DEFINER pattern** — NEVER inline `EXISTS` subqueries (causes 42P17)
7. **No `z.union` or `z.discriminatedUnion` in AI outputs** — Flat schemas only
8. **Opus reserved for approved cases** — Default Sonnet, cheap → Haiku
9. **FK to `learner_profiles(profile_id)`** — NOT `(id)`

## Workflow

1. Plan → Write Prompt → Review → Build → Test → Docs → /clear
2. Approval-First: discuss before implementing
3. Atomic commits với Conventional Commits format
4. Pre-flight git check before feature branches

## Communication

- Vietnamese cho strategy/discussion
- English cho code/commits/docs/file names
- Direct pushback và safety checks valued

## Reference

- Phase 2 design decisions: `docs/template-design/`
- ADRs: `docs/decisions/`
- Conventions: `docs/conventions/`
