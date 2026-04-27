'use client';

import { type ReactNode } from 'react';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { ConsentBanner, useConsent } from '@/components/ConsentBanner';

export function AnalyticsLayoutClient({ children }: { children: ReactNode }) {
  const consent = useConsent();
  const consented = consent === 'accepted';

  return (
    <>
      {children}
      <AnalyticsProvider consented={consented} />
      <ConsentBanner />
    </>
  );
}
