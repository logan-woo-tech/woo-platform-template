# 0005. Anthropic SDK Exact-Pinning

**Status:** Accepted
**Date:** 2026-04-27

## Context

Anthropic SDK evolves rapidly. Caret/tilde version ranges can introduce breaking changes silently.

## Decision

Anthropic SDK MUST be exact-pinned:

- `"@anthropic-ai/sdk": "0.32.0"` ✅
- `"@anthropic-ai/sdk": "^0.32.0"` ❌
- `"@anthropic-ai/sdk": "~0.32.0"` ❌

## Rationale

- Behavior changes between minor versions
- Eval tests can detect regressions only if version stable
- Manual upgrade triggers eval re-validation
- Cost models may change

## Enforcement

CI script `scripts/verify-anthropic-pin.ts` blocks PR if violated.

## Consequences

### Positive

- Predictable AI behavior
- Eval-driven upgrades
- No silent breaks

### Negative

- Manual update process
- Miss security patches if neglect updates

## Upgrade procedure

1. Read Anthropic SDK changelog
2. Update version in package.json
3. Run evals (`pnpm eval`)
4. Address regressions
5. Commit upgrade as separate PR
