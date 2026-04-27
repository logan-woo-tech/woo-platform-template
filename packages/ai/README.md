# @template/ai

Anthropic SDK integration với skills, agents, evals, degraded mode.

## Status

Skeleton — implementation in Sub-phase D.

## Hard constraints

- **Anthropic SDK exact-pin** — No `^` or `~` prefixes
- **No z.union/z.discriminatedUnion** in AI outputs
- **Opus reserved** for approved cases (default Sonnet)
- **PII never to AI** — Sanitize prompts
- **Mandatory degraded mode** — Every feature 2+ layers

## Will provide

- Anthropic SDK wrapper với cost tracking
- Model selection logic (Haiku/Sonnet/Opus)
- Degraded mode helpers
- Skills/agents structure
- Eval framework setup (Promptfoo)
