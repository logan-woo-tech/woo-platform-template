'use client';

import { useEffect } from 'react';
import { initAnalytics, trackEvent } from '@/lib/analytics/client';

interface AnalyticsProviderProps {
  /**
   * Whether user has consented to tracking.
   * If false, no events tracked.
   */
  consented: boolean;
}

/**
 * Initializes PostHog client when consent given.
 * Tracks initial page_viewed event.
 *
 * Place inside [locale]/layout.tsx after consent check.
 */
export function AnalyticsProvider({ consented }: AnalyticsProviderProps) {
  useEffect(() => {
    if (!consented) return;

    initAnalytics();

    // Track initial page view
    if (typeof window !== 'undefined') {
      trackEvent('page_viewed', {
        page_path: window.location.pathname,
        page_name: document.title,
        referrer: document.referrer,
      });
    }
  }, [consented]);

  return null;
}
