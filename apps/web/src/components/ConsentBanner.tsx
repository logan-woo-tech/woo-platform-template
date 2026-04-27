'use client';

import { useEffect, useState } from 'react';
import { Button } from '@template/ui';
import { useTranslations } from 'next-intl';

const CONSENT_COOKIE = 'analytics_consent';
const CONSENT_DURATION_DAYS = 365;

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

function getConsentFromCookie(): ConsentStatus {
  if (typeof document === 'undefined') return 'pending';
  const match = document.cookie.match(new RegExp(`${CONSENT_COOKIE}=([^;]+)`));
  if (!match) return 'pending';
  return match[1] === 'true' ? 'accepted' : 'rejected';
}

function setConsentCookie(value: boolean): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setDate(expires.getDate() + CONSENT_DURATION_DAYS);
  document.cookie = `${CONSENT_COOKIE}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

interface ConsentBannerProps {
  onConsent?: (accepted: boolean) => void;
}

export function ConsentBanner({ onConsent }: ConsentBannerProps) {
  const t = useTranslations('consent');
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStatus(getConsentFromCookie());
  }, []);

  const handleAccept = () => {
    setConsentCookie(true);
    setStatus('accepted');
    onConsent?.(true);
  };

  const handleReject = () => {
    setConsentCookie(false);
    setStatus('rejected');
    onConsent?.(false);
  };

  // Don't render until mounted (avoid hydration mismatch)
  if (!mounted) return null;

  // Don't show if already decided
  if (status !== 'pending') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="text-sm text-gray-700 flex-1">{t('message')}</p>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={handleReject}>
            {t('reject')}
          </Button>
          <Button variant="primary" size="sm" onClick={handleAccept}>
            {t('accept')}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to read consent status reactively.
 */
export function useConsent(): ConsentStatus {
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStatus(getConsentFromCookie());

    // Listen for consent changes (multi-tab support)
    const interval = setInterval(() => {
      const current = getConsentFromCookie();
      setStatus((prev) => (prev !== current ? current : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return 'pending';
  return status;
}
