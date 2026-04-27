# Layer 5: Data / Analytics

**Status:** Proposed (Phase 2)
**Frame:** B

---

## Approach

**PostHog cho analytics + product insights**

Reasoning: Open-source, generous free tier, EU/data residency options, server + client tracking, session replay built-in.

NOT: Mixpanel (similar but more expensive), Segment (overkill, just needs analytics), Google Analytics (privacy concerns).

## Architecture

```
Client (web/mobile)
  └─→ PostHog client SDK
        └─→ PostHog cloud (or self-hosted)

Server (Next.js)
  └─→ PostHog Node SDK
        └─→ PostHog cloud
```

## Folder structure

```
packages/
├── analytics/                  # NEW package (or merge into utils)
│   ├── src/
│   │   ├── client.ts           # PostHog browser client
│   │   ├── server.ts           # PostHog server client
│   │   ├── events.ts           # Event constants + types
│   │   ├── identify.ts         # User identification
│   │   └── properties.ts       # Property helpers
│   └── package.json
```

For v0.1, mình propose merge into `packages/utils/analytics/` để keep package count at 6.

## Event taxonomy

**Naming convention: `{noun}_{verb}`** (PostHog standard)

Examples:
- `user_signed_up`
- `user_signed_in`
- `page_viewed`
- `button_clicked`
- `form_submitted`
- `payment_completed`
- `error_occurred`

NOT: `signup`, `login`, `click_button` (inconsistent verb position).

## Initial events (template)

```typescript
// packages/utils/src/analytics/events.ts

export const events = {
  // Auth
  user_signed_up: { /* properties */ },
  user_signed_in: { /* properties */ },
  user_signed_out: {},

  // Navigation
  page_viewed: {
    page_name: '',
    page_path: '',
    referrer: '',
  },

  // Engagement
  button_clicked: {
    button_id: '',
    page: '',
  },

  // Errors
  error_occurred: {
    error_type: '',
    error_message: '',
    page: '',
  },

  // AI
  ai_call_started: {
    model: '',
    feature: '',
  },
  ai_call_completed: {
    model: '',
    feature: '',
    duration_ms: 0,
    input_tokens: 0,
    output_tokens: 0,
    cost_usd: 0,
  },
  ai_call_failed: {
    model: '',
    feature: '',
    error_type: '',
  },
} as const;
```

## Identify pattern

When user signs in:

```typescript
import { identify } from '@/lib/analytics';

posthog.identify(user.id, {
  email: user.email,        // PII — toggle ingestion based on consent
  created_at: user.created_at,
  role: user.role,
  locale: user.locale,
});
```

**Privacy:** PII fields (email) gated by consent. Anonymous tracking by default.

## Privacy & consent

**v0.1 approach:**
- Anonymous tracking by default
- Cookie-based consent banner
- Reject all = no tracking
- Accept = identify + events

**Vietnamese privacy:**
- Vietnam doesn't have GDPR-equivalent yet
- But best practice: opt-in for tracking
- Cookie banner Vietnamese + English

## Server-side vs client-side

**Server-side events:**
- More reliable (no ad blockers)
- Higher latency
- Use for: critical events (signups, payments)

**Client-side events:**
- Real-time
- Subject to ad blockers
- Use for: UX events (clicks, page views)

Hybrid: Critical events fire both server + client (deduplicate via event_id).

## Funnel definitions (template starter)

```typescript
// Defined trong PostHog dashboard, but document here

export const funnels = {
  signup: [
    'page_viewed', // landing
    'button_clicked', // CTA
    'page_viewed', // signup form
    'form_submitted', // signup
    'user_signed_up', // success
  ],

  onboarding: [
    'user_signed_up',
    'onboarding_step_1_completed',
    'onboarding_step_2_completed',
    'onboarding_completed',
  ],
};
```

## Reporting queries

PostHog provides query builder. Document common queries:

- DAU (Daily Active Users): unique users với event in 24h
- Retention: cohort retention by signup date
- Funnel conversion: % completing onboarding
- Feature adoption: % users using feature X

## Event versioning

When event schema changes:

**Strategy: Property additive**
- New properties OK to add (existing events still valid)
- NEVER remove properties (breaks dashboards)
- NEVER change property meaning (subtle break)

**If breaking change needed:**
- Create new event: `user_signed_up_v2`
- Document migration in ADR

## Cost monitoring

PostHog free tier:
- 1M events/month free
- $0.00031/event after

Estimated v0.1 usage:
- 30 learners × 50 events/day × 30 days = 45,000 events/month
- Well within free tier

Monitor at PostHog dashboard. Alert if approaching limit.

## Decision summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tool | PostHog | Open-source, free tier generous |
| Naming | noun_verb | PostHog standard |
| Tracking | Hybrid (server + client) | Reliability + real-time |
| Privacy | Opt-in tracking | User-friendly default |
| Initial events | 10 events | Foundation, expand as needed |
| Versioning | Property additive | Avoid breaking dashboards |

---

*End of layer-5-data.md*
