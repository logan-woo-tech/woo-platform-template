import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  transpilePackages: [
    '@template/auth',
    '@template/db',
    '@template/ai',
    '@template/types',
    '@template/ui',
    '@template/utils',
  ],
};

export default config;
