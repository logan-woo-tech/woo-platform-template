import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const config: NextConfig = {
  typedRoutes: true,
  transpilePackages: [
    '@template/auth',
    '@template/db',
    '@template/ai',
    '@template/types',
    '@template/ui',
    '@template/utils',
  ],
};

export default withNextIntl(config);
