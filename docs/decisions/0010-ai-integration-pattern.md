# 0010. AI Integration Pattern

**Status:** Accepted
**Date:** 2026-04-27

## Context

Multiple ways to integrate AI in production:

1. Direct SDK calls scattered through codebase
2. Heavy framework (LangChain, LlamaIndex)
3. Custom wrapper with standard patterns

## Decision

Custom wrapper in `@template/ai` package with standard patterns:

- Centralized model selection (per ADR-014)
- Mandatory cost tracking (every call logged to `ai_call_log`)
- Degraded mode helper (`withFallback`) for resilience
- Lazy SDK client initialization
- Type-safe call interface

## Rationale

- Avoid framework lock-in
- Direct control over Anthropic SDK behavior
- Cost visibility from day 1
- Resilience by design (degraded mode)
- Eval-able (Promptfoo integration in PR 2)

## Consequences

### Positive

- Clear API surface (`callAI`, `withFallback`)
- Centralized cost tracking
- Model selection logic in one place
- Easy to test and mock

### Negative

- Less feature-rich than LangChain
- Manual implementation of advanced patterns (RAG, agents)
- Need to update wrapper when SDK changes

## Pattern enforcement

- Hard constraint: Anthropic SDK exact-pinned (script verifies)
- Hard constraint: no `z.union` / `z.discriminatedUnion` in AI outputs
- Hard constraint: Opus reserved for 4 approved cases
- Mandatory: every AI call uses `callAI()` (not direct SDK)
- Mandatory: every AI feature has degraded mode (`withFallback`)
