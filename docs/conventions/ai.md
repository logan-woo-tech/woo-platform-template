# AI Integration Conventions

## Skills

Location: `.claude/skills/`
Naming: kebab-case.md
Format: YAML frontmatter + markdown body

## Agents

Location: `.claude/agents/`
Naming: kebab-case.md

## Prompts

Location: `docs/prompts/`
Naming: `{feature}-{purpose}-v{N}.md`

Versioning rules:

- Logic change → new version
- Typo fix → edit in place
- Old versions never deleted

## Code references

Avoid string literals, use file references:

```typescript
import { welcomeMessageV1 } from '@/lib/ai/prompts';
```

## Cost tracking

EVERY AI call must track cost via `trackAICall()`.

CI lint detects AI calls missing cost tracking.

## Degraded mode

EVERY AI feature must have ≥2 layers (primary + fallback).

Test by disabling Anthropic API key — feature must still work.

## Schemas

NEVER use `z.union` or `z.discriminatedUnion` for AI outputs.

Use flat schemas with optional fields:

```typescript
// WRONG
z.union([z.object({type: 'success', data: ...}), z.object({type: 'error', message: ...})])

// RIGHT
z.object({
  type: z.enum(['success', 'error']),
  data: z.string().optional(),
  message: z.string().optional(),
})
```

## PII safety

NEVER send PII to AI. Sanitize prompts before sending.
