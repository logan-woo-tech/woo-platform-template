'use client';

import posthog from 'posthog-js';

let initialized = false;

/**
 * Initialize PostHog browser client.
 * Idempotent — safe to call multiple times.
 *
 * Privacy: capture_pageview disabled (we capture manually for control).
 */
export function initAnalytics(): void {
  if (initialized) return;
  if (typeof window === 'undefined') return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key || !host) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('PostHog not configured (missing NEXT_PUBLIC_POSTHOG_KEY)');
    }
    return;
  }

  posthog.init(key, {
    api_host: host,
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    loaded: () => {
      initialized = true;
    },
  });
}

/**
 * Track event from browser.
 * No-op if not initialized.
 */
export function trackEvent(event: string, properties?: Record<string, unknown>): void {
  if (!initialized) return;
  posthog.capture(event, properties);
}

/**
 * Identify user (called after login).
 *
 * Privacy: only call after explicit consent + login.
 * Do not include sensitive PII in properties.
 */
export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  if (!initialized) return;
  posthog.identify(userId, properties);
}

/**
 * Reset user identification (called on logout).
 */
export function resetAnalytics(): void {
  if (!initialized) return;
  posthog.reset();
}
