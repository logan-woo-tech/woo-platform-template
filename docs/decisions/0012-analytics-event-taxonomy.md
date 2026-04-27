# 0012. Analytics & Event Taxonomy

**Status:** Accepted
**Date:** 2026-04-27

## Context

Need product analytics for understanding user behavior, conversion funnels, retention. Multiple options:

- PostHog (open-source, generous free tier, EU/data residency)
- Mixpanel (mature, expensive)
- Segment (CDP, overkill for direct analytics)
- Google Analytics (privacy concerns)

## Decision

PostHog with clear event taxonomy, opt-in tracking, server + client hybrid capture.

### Naming convention

`noun_verb` per PostHog standard:

- ✅ `user_signed_up`
- ❌ `signup`
- ❌ `click_button`

### Initial event taxonomy (10 events)

- Auth: `user_signed_up`, `user_signed_in`, `user_signed_out`
- Navigation: `page_viewed`
- Engagement: `button_clicked`, `form_submitted`, `form_failed`
- Errors: `error_occurred`
- AI: `ai_call_started`, `ai_call_completed`, `ai_call_failed`

### Privacy

- Opt-in tracking (cookie consent banner)
- No PII in events without explicit consent
- `person_profiles: 'identified_only'` (no profile creation for anonymous)
- Server-side critical events (signups, payments) for reliability
- Client-side UX events (clicks, page views)

## Rationale

- PostHog open-source, generous free tier (1M events/month)
- Self-host option available later
- Hybrid client/server capture handles ad-blockers
- noun_verb consistent with PostHog ecosystem

## Implementation

- `apps/web/src/lib/analytics/events.ts` — Event taxonomy
- `apps/web/src/lib/analytics/client.ts` — Browser client
- `apps/web/src/lib/analytics/server.ts` — Server client
- `apps/web/src/components/ConsentBanner.tsx` — Cookie consent
- `apps/web/src/components/AnalyticsProvider.tsx` — Init wrapper

## Consequences

### Positive

- Clear naming = discoverable in PostHog UI
- Opt-in tracking = privacy-friendly default
- Hybrid capture = better data quality
- Versioned events possible (additive properties)

### Negative

- Cookie banner = signup friction
- Hybrid capture = duplicate event risk (deduplicate via event_id later if needed)
- PostHog vendor lock-in (mitigated: self-host option)
- Free tier may be insufficient at 10K+ MAU (estimated)

## Versioning rules

- New properties OK to add (additive)
- NEVER remove properties (breaks dashboards)
- NEVER change property meaning (subtle break)
- Breaking changes → new event name (`user_signed_up_v2`)
