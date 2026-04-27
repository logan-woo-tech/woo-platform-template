# 0003. TypeScript Strict Mode

**Status:** Accepted
**Date:** 2026-04-27

## Context

TypeScript can run in various strictness modes.

## Decision

Strict mode với additional flags:

- `strict: true`
- `noImplicitAny: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedIndexedAccess: true`

## Rationale

- Catches errors at compile time
- Prevents common bugs (undefined access, unused code)
- Industry best practice
- AI-generated code more reliable with strict types

## Consequences

### Positive

- Fewer runtime errors
- Better IDE support
- Self-documenting code

### Negative

- More verbose code
- Learning curve for less experienced devs
