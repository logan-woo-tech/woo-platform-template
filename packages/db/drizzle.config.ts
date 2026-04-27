import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DIRECT_URL) {
  throw new Error('DIRECT_URL is required for migrations');
}

export default {
  schema: './src/schema/*.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DIRECT_URL,
  },
} satisfies Config;
