---
name: ai-prompt-pattern
description: Create production-ready AI features with cost tracking and degraded mode
---

When implementing any AI feature:

## Required pattern

```typescript
import { callAI, withFallback } from '@template/ai';

async function generateWelcomeMessage(user: User): Promise<string> {
  return withFallback(
    // Primary: AI-generated
    async () => {
      const result = await callAI({
        useCase: 'welcome_message_v1',
        systemPrompt: WELCOME_SYSTEM_PROMPT,
        userMessage: `Generate welcome for: ${user.name}`,
        userId: user.id,
      });
      return result.text;
    },
    // Fallback: template
    () => `Welcome, ${user.name}!`,
  );
}
```

## Hard constraints

- **callAI() only** — Never direct Anthropic SDK in feature code
- **withFallback() mandatory** — Every AI feature has 2+ layers
- **userId tracking** — Pass user.id to track per-user costs
- **Versioned use_case** — Format: `{feature}_v{N}` (e.g., `welcome_message_v1`)

## Use case naming

- Approved Opus cases: see OPUS_APPROVED_CASES in models.ts
- `simple_*` or `quick_*` prefix → Haiku (cheap)
- Default → Sonnet

## Schema pattern

For structured AI outputs, use FLAT Zod schemas:

```typescript
// WRONG
const schema = z.union([
  z.object({ type: 'success', data: z.string() }),
  z.object({ type: 'error', message: z.string() }),
]);

// RIGHT
const schema = z.object({
  type: z.enum(['success', 'error']),
  data: z.string().optional(),
  message: z.string().optional(),
});
```

## Reference

ADR-0010: docs/decisions/0010-ai-integration-pattern.md
