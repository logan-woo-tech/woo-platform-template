# Phase 2 Decisions Summary

**Status:** All decisions proposed (Phase 2)
**Frame:** B (Claude-driven)
**Total decisions:** ~60 across 9 layers

---

## Layer 1: Code

| # | Decision | Choice | Document |
|---|----------|--------|----------|
| 1.1 | Package count | 6 packages | layer-1-code-design.md |
| 1.2 | Apps from day 1 | Web + Mobile | layer-1-code-design.md |
| 1.3 | Module system | ESM | layer-1-code-design.md |
| 1.4 | TypeScript mode | Strict | layer-1-code-design.md |
| 1.5 | Build tool | Turborepo | layer-1-code-design.md |
| 1.6 | Package manager | pnpm 10.32.1 | layer-1-code-design.md |
| 1.7 | Node version | 24 LTS | layer-1-code-design.md |

## Layer 2: API

| # | Decision | Choice | Document |
|---|----------|--------|----------|
| 2.1 | API style | tRPC v11 | layer-2-api-design.md |
| 2.2 | OpenAPI generation | Auto via trpc-openapi | layer-2-api-design.md |
| 2.3 | Procedure types | 3 (public, authenticated, admin) | layer-2-api-design.md |
| 2.4 | Versioning | None v0.1 | layer-2-api-design.md |
| 2.5 | Rate limiting | None v0.1 | layer-2-api-design.md |
| 2.6 | Pagination | Cursor-based | layer-2-api-design.md |
| 2.7 | Error format | Standard tRPC codes | layer-2-api-design.md |

## Layer 3: Design System

| # | Decision | Choice | Document |
|---|----------|--------|----------|
| 3.1 | Styling approach | Tailwind 4 | layer-3-design-system.md |
| 3.2 | Component pattern | shadcn-style | layer-3-design-system.md |
| 3.3 | Initial components | 3 (Button, Input, Card) | layer-3-design-system.md |
| 3.4 | Tokens approach | TypeScript objects | layer-3-design-system.md |
| 3.5 | Mobile parity | Tokens shared, components separate | layer-3-design-system.md |
| 3.6 | Accessibility | WCAG AA baseline | layer-3-design-system.md |
| 3.7 | Component playground | Yes (dev only) | layer-3-design-system.md |

## Layer 4: Localization

| # | Decision | Choice | Document |
|---|----------|--------|----------|
| 4.1 | Library | next-intl | layer-4-localization.md |
| 4.2 | Default locale | Vietnamese | layer-4-localization.md |
| 4.3 | Initial locales | en + vi | layer-4-localization.md |
| 4.4 | URL strategy | /{locale}/path | layer-4-localization.md |
| 4.5 | Type safety | Auto-gen từ messages | layer-4-localization.md |
| 4.6 | CI verification | Yes | layer-4-localization.md |
| 4.7 | Mobile sharing | Defer to v1.0+ | layer-4-localization.md |

## Layer 5: Data / Analytics

| # | Decision | Choice | Document |
|---|----------|--------|----------|
| 5.1 | Analytics tool | PostHog | layer-5-data.md |
| 5.2 | Naming convention | noun_verb | layer-5-data.md |
| 5.3 | Tracking | Hybrid (server + client) | layer-5-data.md |
| 5.4 | Privacy | Opt-in tracking | layer-5-data.md |
| 5.5 | Initial events | 10 events | layer-5-data.md |
| 5.6 | Versioning | Property additive | layer-5-data.md |
| 5.7 | Package location | packages/utils/analytics | layer-5-data.md |

## Layer 6: Security

| # | Decision | Choice | Document |
|---|----------|--------|----------|
| 6.1 | Auth provider | Supabase Auth | layer-6-security.md |
| 6.2 | Primary auth | Email + password | layer-6-security.md |
| 6.3 | Secondary auth | Email magic link | layer-6-security.md |
| 6.4 | RLS pattern | SECURITY DEFINER functions | layer-6-security.md |
| 6.5 | Authorization layers | 3 (DB, API, UI) | layer-6-security.md |
| 6.6 | Email verification | Mandatory | layer-6-security.md |
| 6.7 | Session duration | 24h with rotation | layer-6-security.md |
| 6.8 | Service role | Server-only strict | layer-6-security.md |
| 6.9 | Audit logging | Minimal v0.1 | layer-6-security.md |
| 6.10 | Compliance | Defer formal | layer-6-security.md |
| 6.11 | Password policy | 8+ chars, letter+number | layer-6-security.md |

## Layer 7: AI Integration

| # | Decision | Choice | Document |
|---|----------|--------|----------|
| 7.1 | SDK | Anthropic direct | layer-7-ai-integration.md |
| 7.2 | Model tiering | Haiku/Sonnet/Opus | layer-7-ai-integration.md |
| 7.3 | Default model | Sonnet 4.6 | layer-7-ai-integration.md |
| 7.4 | Skills/agents | Claude Code pattern | layer-7-ai-integration.md |
| 7.5 | Streaming UI | Vercel AI SDK | layer-7-ai-integration.md |
| 7.6 | Eval framework | Promptfoo | layer-7-ai-integration.md |
| 7.7 | Prompts | Versioned files | layer-7-ai-integration.md |
| 7.8 | Cost tracking | Every call | layer-7-ai-integration.md |
| 7.9 | Degraded mode | Mandatory 2-layer | layer-7-ai-integration.md |
| 7.10 | Schemas | Flat with optionals | layer-7-ai-integration.md |
| 7.11 | PII | Never to AI | layer-7-ai-integration.md |
| 7.12 | Prompt caching | Yes for >1024 tokens | layer-7-ai-integration.md |
| 7.13 | Daily budget | $10/day dev | layer-7-ai-integration.md |

## Layer 8: Knowledge & Workflow

| # | Decision | Choice | Document |
|---|----------|--------|----------|
| 8.1 | ADR numbering | 4-digit | layer-8-knowledge-workflow.md |
| 8.2 | ADR immutability | Yes | layer-8-knowledge-workflow.md |
| 8.3 | Specs separate | Yes | layer-8-knowledge-workflow.md |
| 8.4 | Runbooks | Templates included | layer-8-knowledge-workflow.md |
| 8.5 | PR template | Required sections | layer-8-knowledge-workflow.md |
| 8.6 | Issue templates | Bug, Feature, ADR | layer-8-knowledge-workflow.md |
| 8.7 | Commit format | Conventional Commits | layer-8-knowledge-workflow.md |
| 8.8 | Branch naming | type/description | layer-8-knowledge-workflow.md |
| 8.9 | Merge strategy | Squash and merge | layer-8-knowledge-workflow.md |
| 8.10 | Branch protection | Strict | layer-8-knowledge-workflow.md |
| 8.11 | Glossary | Yes (project terms) | layer-8-knowledge-workflow.md |

## Layer 9: Operations

| # | Decision | Choice | Document |
|---|----------|--------|----------|
| 9.1 | Hosting | Vercel | layer-9-operations.md |
| 9.2 | CI | GitHub Actions | layer-9-operations.md |
| 9.3 | CD | Vercel native | layer-9-operations.md |
| 9.4 | Health check | Deep (DB + AI) | layer-9-operations.md |
| 9.5 | Monitoring | Vercel native v0.1 | layer-9-operations.md |
| 9.6 | DB migrations | Manual via CLI | layer-9-operations.md |
| 9.7 | Logging | Structured JSON | layer-9-operations.md |
| 9.8 | Alerts | Minimal v0.1 | layer-9-operations.md |
| 9.9 | Rollback | Auto on health fail | layer-9-operations.md |
| 9.10 | CI target time | <5 minutes | layer-9-operations.md |
| 9.11 | Custom verifications | 4 scripts | layer-9-operations.md |

---

## Total decision count

- Layer 1: 7 decisions
- Layer 2: 7 decisions
- Layer 3: 7 decisions
- Layer 4: 7 decisions
- Layer 5: 7 decisions
- Layer 6: 11 decisions
- Layer 7: 13 decisions
- Layer 8: 11 decisions
- Layer 9: 11 decisions

**Total: 81 decisions** across 9 layers + cross-layer integrations.

---

## Status

**All decisions Proposed (Phase 2).** Awaiting approval.

If approved:
- Decisions move to Accepted
- Phase 3 builds based on these decisions
- Each major decision becomes ADR in Phase 3

---

## Approval needed

Bạn approve all decisions? Hoặc challenge specific ones?

If approve all → Phase 3 begins.
If challenge → discuss specific decisions, refine, re-propose.

---

*End of decisions-summary.md*
