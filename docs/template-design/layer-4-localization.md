# Layer 4: Localization

**Status:** Proposed (Phase 2)
**Frame:** B
**Note:** Layer 4 dormant in v0.1, active từ v2.1+

---

## Approach

**next-intl với App Router**

Reasoning: Direct Next.js 15 App Router support, server component compatible, type-safe message keys.

NOT: i18next (heavier, plugin complexity), formatjs (lower-level).

## Folder structure

```
apps/web/src/
├── i18n/
│   ├── config.ts               # Locale config
│   ├── routing.ts              # next-intl routing
│   └── request.ts              # Server-side request config
├── messages/
│   ├── en.json                 # English (default)
│   └── vi.json                 # Vietnamese
└── middleware.ts               # Locale detection
```

## Locale configuration

`apps/web/src/i18n/config.ts`:

```typescript
export const locales = ['en', 'vi'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'vi';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
};
```

## Routing

URL strategy: `/{locale}/path`

Examples:
- `/vi/dashboard` (default Vietnamese)
- `/en/dashboard` (English)
- `/` redirects to `/vi`

`apps/web/src/i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'vi',
  localePrefix: 'always',
});
```

## Message file structure

Hierarchical organization, namespace per feature:

```json
{
  "common": {
    "buttons": {
      "submit": "Gửi",
      "cancel": "Huỷ",
      "save": "Lưu",
      "delete": "Xoá"
    },
    "errors": {
      "required": "Trường bắt buộc",
      "invalid_email": "Email không hợp lệ"
    }
  },
  "auth": {
    "signIn": {
      "title": "Đăng nhập",
      "email_label": "Email",
      "password_label": "Mật khẩu"
    }
  },
  "dashboard": {
    "welcome": "Chào mừng, {name}!"
  }
}
```

## Type safety

Auto-generate types from message file:

```typescript
// apps/web/src/i18n/types.d.ts (auto-generated)
type Messages = typeof import('../../messages/en.json');

declare interface IntlMessages extends Messages {}
```

Usage in components:

```typescript
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('common.buttons');

  return <button>{t('submit')}</button>;
}
```

TypeScript catches typos at compile time.

## Server components vs client components

**Server components (default):**
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('dashboard');
  return <h1>{t('welcome', { name: 'Logan' })}</h1>;
}
```

**Client components:**
```typescript
'use client';
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('dashboard');
  return <h1>{t('welcome', { name: 'Logan' })}</h1>;
}
```

## Pluralization

```json
{
  "items": {
    "count": "{count, plural, =0 {Không có mục} =1 {1 mục} other {# mục}}"
  }
}
```

Usage:
```typescript
t('items.count', { count: 5 }); // "5 mục"
```

## Number and date formatting

```typescript
import { useFormatter } from 'next-intl';

export function Component() {
  const format = useFormatter();

  return (
    <div>
      {format.number(1234.56, { style: 'currency', currency: 'VND' })}
      {format.dateTime(new Date(), { dateStyle: 'medium' })}
    </div>
  );
}
```

## Locale switching

Component:

```typescript
'use client';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (locale: string) => {
    const newPath = pathname.replace(/^\/(en|vi)/, `/${locale}`);
    router.push(newPath);
  };

  return (
    <select onChange={(e) => switchLocale(e.target.value)}>
      {locales.map(l => (
        <option key={l} value={l}>{l}</option>
      ))}
    </select>
  );
}
```

## Locale persistence

User preference stored in:
1. Cookie `NEXT_LOCALE` (1 year expiry)
2. User profile (database) for authenticated users

Priority: User profile > Cookie > Browser language > Default (vi)

## CI verification

Custom script `scripts/verify-locales.ts`:

```typescript
import en from '../apps/web/messages/en.json';
import vi from '../apps/web/messages/vi.json';

function getKeys(obj: any, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return getKeys(value, path);
    }
    return [path];
  });
}

const enKeys = new Set(getKeys(en));
const viKeys = new Set(getKeys(vi));

const missingInVi = [...enKeys].filter(k => !viKeys.has(k));
const missingInEn = [...viKeys].filter(k => !enKeys.has(k));

if (missingInVi.length || missingInEn.length) {
  console.error('Locale mismatch:', { missingInVi, missingInEn });
  process.exit(1);
}
```

CI runs this on every PR.

## Vietnamese-specific considerations

- Diacritics preserved (UTF-8 throughout)
- Length expansion (~20-30% longer than English)
- No truncation in UI (allow text wrap)
- Vietnamese fonts: Inter supports Vietnamese diacritics well

## Mobile parity

Mobile app (`apps/mobile/`) shares messages via `@woo/i18n` package (could create later).

For v0.1: duplicate messages in mobile app, sync manually. Refactor to shared package in v1.0+.

## Decision summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Library | next-intl | App Router native |
| Default locale | Vietnamese | Vietnam market |
| Locales v0.1 | en + vi | Foundation, expand later |
| URL strategy | `/{locale}/path` | Standard pattern |
| Type safety | Auto-gen từ messages | Catch typos |
| CI check | Yes | Prevent locale drift |
| Mobile sharing | Defer to v1.0+ | Keep v0.1 simple |

---

*End of layer-4-localization.md*
