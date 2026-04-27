# 0011. Prompt Versioning Strategy

**Status:** Accepted
**Date:** 2026-04-27

## Context

Production prompts evolve. Need to track changes, run evals across versions, rollback if regression.

## Decision

**File-based prompt versioning with suffix:**

- Document: `docs/prompts/{feature}-v{N}.md`
- Implementation: `packages/ai/src/prompts/{feature}-v{N}.ts`
- Use case identifier: `{feature}_v{N}` (passed to callAI)

**Rules:**

1. Logic change → new version (v2, v3, ...)
2. Typo/formatting fix → edit in place
3. Old versions never deleted (history preserved)
4. Eval tests target specific version

## Rationale

- File-based = easy to diff in git
- Version in code = traceable in `ai_call_log`
- Old versions retained = rollback possible
- Eval per version = regression detection

## Implementation

```typescript
// packages/ai/src/prompts/welcome-message-v1.ts
const result = await callAI({
  useCase: 'welcome_message_v1', // ← versioned identifier
  ...
});

// packages/ai/src/prompts/welcome-message-v2.ts (future)
const result = await callAI({
  useCase: 'welcome_message_v2',
  ...
});
```

Database tracks `use_case` per call → can compare v1 vs v2 metrics.

## Consequences

### Positive

- Clear version tracking
- Rollback path always available
- Eval comparisons across versions
- Audit trail in `ai_call_log`

### Negative

- Code duplication between versions
- Need to clean up unused versions periodically
- More files to maintain
