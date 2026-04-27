/**
 * Event taxonomy — single source of truth for all analytics events.
 *
 * Naming convention: noun_verb (PostHog standard)
 * Examples: user_signed_up (correct), signup (wrong), click_button (wrong)
 *
 * Adding events:
 * 1. Add to AnalyticsEvent type
 * 2. Add to ANALYTICS_EVENTS object
 * 3. Document properties expected
 */

export type AnalyticsEvent =
  // Auth events
  | 'user_signed_up'
  | 'user_signed_in'
  | 'user_signed_out'
  // Navigation events
  | 'page_viewed'
  // Engagement events
  | 'button_clicked'
  | 'form_submitted'
  | 'form_failed'
  // Error events
  | 'error_occurred'
  // AI events
  | 'ai_call_started'
  | 'ai_call_completed'
  | 'ai_call_failed';

export const ANALYTICS_EVENTS = {
  user_signed_up: 'user_signed_up',
  user_signed_in: 'user_signed_in',
  user_signed_out: 'user_signed_out',
  page_viewed: 'page_viewed',
  button_clicked: 'button_clicked',
  form_submitted: 'form_submitted',
  form_failed: 'form_failed',
  error_occurred: 'error_occurred',
  ai_call_started: 'ai_call_started',
  ai_call_completed: 'ai_call_completed',
  ai_call_failed: 'ai_call_failed',
} as const satisfies Record<AnalyticsEvent, AnalyticsEvent>;

/**
 * Properties expected per event (documentation, not enforced types).
 *
 * Use to align tracking calls with dashboard expectations.
 */
export const EVENT_PROPERTIES = {
  user_signed_up: ['method', 'locale'],
  user_signed_in: ['method', 'locale'],
  user_signed_out: [],
  page_viewed: ['page_name', 'page_path', 'referrer'],
  button_clicked: ['button_id', 'page'],
  form_submitted: ['form_id', 'page'],
  form_failed: ['form_id', 'error_type'],
  error_occurred: ['error_type', 'error_message', 'page'],
  ai_call_started: ['model', 'feature'],
  ai_call_completed: ['model', 'feature', 'duration_ms', 'cost_usd'],
  ai_call_failed: ['model', 'feature', 'error_type'],
} as const;
