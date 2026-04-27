# Layer 7: AI Integration

**Status:** Proposed (Phase 2)
**Frame:** B
**Hard constraints applied:** Anthropic SDK exact-pin, no z.union/z.discriminatedUnion in AI outputs, Opus reserved for approved cases, eval tests not mocked

---

## Approach

**Anthropic SDK direct + Skills/Agents architecture**

- Anthropic SDK exact-pinned (no caret/tilde)
- Claude Code skills and subagents pattern
- Vercel AI SDK for streaming UI patterns (NOT for orchestration)
- Promptfoo for evals

NOT: LangChain (heavy framework, abstraction we don't need), OpenAI SDK (different vendor).

## Folder structure

```
packages/ai/
├── src/
│   ├── client.ts               # Anthropic SDK wrapper
│   ├── models.ts               # Model selection logic
│   ├── cost-tracking.ts        # Token + cost tracking
│   ├── degraded-mode.ts        # Fallback patterns
│   ├── prompts/
│   │   ├── index.ts            # Prompt registry
│   │   └── helpers.ts          # Prompt building helpers
│   ├── skills/                 # Skill definitions (TypeScript)
│   ├── agents/                 # Agent definitions (TypeScript)
│   ├── evals/                  # Eval test setup (Promptfoo)
│   └── types.ts                # AI types
└── package.json

.claude/                        # Claude Code artifacts (separate from package)
├── skills/
│   ├── migration-with-rls.md
│   ├── rls-security-definer.md
│   └── ai-prompt-pattern.md
└── agents/
    └── plan-reviewer.md

docs/prompts/                   # Versioned prompt files
├── changelog.md
└── welcome-message-v1.md
```

## Model selection (ADR-014 enforced)

```typescript
// packages/ai/src/models.ts

export const MODELS = {
  HAIKU: 'claude-haiku-4-5-20251001',
  SONNET: 'claude-sonnet-4-6',
  OPUS: 'claude-opus-4-7',
} as const;

// Default — most cases
export const DEFAULT_MODEL = MODELS.SONNET;

// Cheap operations
export const CHEAP_MODEL = MODELS.HAIKU;

// Premium — limited approved cases
export const PREMIUM_MODEL = MODELS.OPUS;

// Approved Opus cases (per ADR-014)
export const OPUS_APPROVED_CASES = [
  'placement_test_grading',     // High accuracy needed
  'sói_session_synthesis',       // Complex reasoning
  'gv_signature_briefing',       // Pedagogy-sensitive
  'eval_judging',                // Eval ground truth
] as const;

export function selectModel(useCase: string): string {
  if (OPUS_APPROVED_CASES.includes(useCase as any)) {
    return PREMIUM_MODEL;
  }
  // Cheap operations
  if (useCase.startsWith('quick_')) {
    return CHEAP_MODEL;
  }
  return DEFAULT_MODEL;
}
```

## SDK wrapper

```typescript
// packages/ai/src/client.ts

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface AICallOptions {
  useCase: string;
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
  metadata?: Record<string, unknown>;
}

export async function callAI(opts: AICallOptions) {
  const start = Date.now();
  const model = selectModel(opts.useCase);

  try {
    const response = await client.messages.create({
      model,
      max_tokens: opts.maxTokens ?? 1024,
      temperature: opts.temperature ?? 0.7,
      system: opts.systemPrompt,
      messages: [{ role: 'user', content: opts.userMessage }],
    });

    await trackAICall({
      model,
      useCase: opts.useCase,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cost: calculateCost(model, response.usage),
      durationMs: Date.now() - start,
      success: true,
    });

    return response;
  } catch (error) {
    await trackAICall({
      model,
      useCase: opts.useCase,
      inputTokens: 0,
      outputTokens: 0,
      cost: 0,
      durationMs: Date.now() - start,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown',
    });
    throw error;
  }
}
```

## Cost tracking

Every call tracked. Schema:

```sql
CREATE TABLE ai_call_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth_users(id),
  use_case text NOT NULL,
  model text NOT NULL,
  input_tokens int NOT NULL,
  output_tokens int NOT NULL,
  cost_usd numeric(10, 6) NOT NULL,
  duration_ms int NOT NULL,
  success boolean NOT NULL,
  error_message text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ai_call_log_created ON ai_call_log(created_at);
CREATE INDEX idx_ai_call_log_user ON ai_call_log(user_id);
CREATE INDEX idx_ai_call_log_use_case ON ai_call_log(use_case);
```

## Degraded mode pattern

**Every AI feature MUST have at least 2 layers:**

```typescript
async function getWelcomeMessage(user: User): Promise<string> {
  // Layer 1: AI primary
  try {
    return await generateWelcomeAI(user);
  } catch (error) {
    logger.warn('AI welcome failed, falling back', { error });
  }

  // Layer 2: Template fallback
  return getTemplateWelcome(user);
}

function getTemplateWelcome(user: User): string {
  return `Welcome back, ${user.name}!`;
}
```

Test degraded mode by disabling Anthropic API key in dev. Feature must still work.

## Skills (Claude Code)

`.claude/skills/`:

**`migration-with-rls.md`:**
```markdown
---
name: migration-with-rls
description: Create database migration with RLS SECURITY DEFINER pattern
---

When creating new tables:

1. Define table schema
2. Enable RLS on table
3. Create SECURITY DEFINER helper functions if needed
4. Define policies using helper functions (NEVER inline EXISTS subqueries)
5. Add to migrations folder with sequential number

Example: ...
```

**`rls-security-definer.md`:** Detailed RLS pattern documentation
**`ai-prompt-pattern.md`:** Prompt versioning and testing pattern

## Agents

`.claude/agents/`:

**`plan-reviewer.md`:**
```markdown
---
name: plan-reviewer
description: Reviews architectural plans for consistency
context: isolated
---

You review plans for:
- Consistency with existing ADRs
- Hard constraint violations
- Missing edge cases
- Pattern adherence

Provide structured feedback...
```

## Prompts (versioned)

`docs/prompts/welcome-message-v1.md`:

```markdown
# Welcome Message v1

**Status:** Production
**Created:** 2026-04-26
**Model:** Claude Sonnet (default)

## System prompt

You are a friendly assistant welcoming a new user to the WOO Platform...

## User message template

The user just signed up. Generate a personalized welcome message.

User name: {{name}}
User locale: {{locale}}

Respond in {{locale}}. Keep under 100 words.

## Expected output

Plain text greeting message, no formatting.

## Examples

[Few-shot examples here]
```

**Versioning rules:**
- Logic change → new version (v2, v3)
- Typo/formatting fix → edit in place
- Old versions never deleted (history)

## Schema for AI outputs

**Hard constraint: No z.union or z.discriminatedUnion.**

WRONG:
```typescript
const schema = z.union([
  z.object({ type: 'success', data: z.string() }),
  z.object({ type: 'error', message: z.string() }),
]);
```

RIGHT:
```typescript
const schema = z.object({
  type: z.enum(['success', 'error']),
  data: z.string().optional(),
  message: z.string().optional(),
});
```

Flat schemas with optional fields. Anthropic SDK structured output works reliably.

## Streaming

For UI patterns (chat-like UX), use Vercel AI SDK for streaming:

```typescript
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

Use Vercel AI SDK ONLY for streaming UI. Don't use for orchestration (use Anthropic SDK direct).

## Eval framework

**Tool: Promptfoo**

Setup:
```yaml
# packages/ai/src/evals/promptfooconfig.yaml

prompts:
  - file://prompts/welcome-message-v1.md

providers:
  - id: anthropic:messages:claude-sonnet-4-6

tests:
  - vars:
      name: 'Logan'
      locale: 'vi'
    assert:
      - type: contains
        value: 'Logan'
      - type: latency
        threshold: 5000

  - vars:
      name: 'John'
      locale: 'en'
    assert:
      - type: contains
        value: 'John'
      - type: language
        value: 'english'
```

Run: `pnpm eval`

CI runs evals on PR. Fail if eval scores drop below threshold.

## Prompt caching (Anthropic feature)

For long system prompts (>1024 tokens), use prompt caching:

```typescript
const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: longSystemPrompt,
      cache_control: { type: 'ephemeral' },
    },
  ],
  messages: [...],
});
```

90% cost reduction on cached portion. Critical for cost optimization at scale.

## PII safety

**Never send PII to AI:**

```typescript
// WRONG
const prompt = `User ${user.email} wants to ${action}`;

// RIGHT
const prompt = `User wants to ${action}`;
// Use ID-based identification if needed
```

Sanitize before sending. Document allowed PII fields per use case (none for v0.1).

## Cost budget alerts

**Daily budget: $10/day during dev (testing)**
**Production: scale based on user count**

Alert at 80% of budget:
```typescript
async function checkBudget() {
  const dailyCost = await getDailyAICost();
  if (dailyCost > DAILY_BUDGET * 0.8) {
    await alertOps('AI budget at 80%', { dailyCost });
  }
}
```

Run hourly via cron.

## Decision summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| SDK | Anthropic direct | Direct control, no abstraction |
| Models | Tiered (Haiku/Sonnet/Opus) | Cost vs capability |
| Skills/agents | Claude Code pattern | Aligned with our tooling |
| Streaming | Vercel AI SDK (UI only) | Best Next.js integration |
| Evals | Promptfoo | Open-source, framework-agnostic |
| Prompts | Versioned files | Track changes |
| Cost tracking | Every call | Visibility critical |
| Degraded mode | Mandatory 2-layer | Resilience |
| Schemas | Flat with optionals | Avoid SDK issues |
| PII | Never to AI | Privacy by default |

---

*End of layer-7-ai-integration.md*
