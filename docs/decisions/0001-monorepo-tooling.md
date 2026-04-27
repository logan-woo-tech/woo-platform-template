# 0001. Monorepo Tooling

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Logan

## Context

Need to organize multiple packages and apps in single repo with efficient builds.

## Considered options

1. **Turborepo + pnpm workspaces** — Modern, fast, well-supported
2. **Nx** — More features but heavier
3. **Lerna** — Legacy, less active
4. **Yarn workspaces only** — No build orchestration

## Decision

Turborepo + pnpm workspaces.

## Rationale

- pnpm: efficient disk usage, strict by default, fast installs
- Turborepo: incremental builds, remote caching, simple config
- Combination is industry standard for Next.js monorepos
- Vercel maintains Turborepo (alignment with deployment platform)

## Consequences

### Positive

- Fast builds via incremental caching
- Strict workspace dependencies
- Active community, good docs

### Negative

- Learning curve for teams unfamiliar with pnpm
- Turbo cache occasional staleness issues

### Neutral

- pnpm-lock.yaml format different from package-lock.json or yarn.lock
