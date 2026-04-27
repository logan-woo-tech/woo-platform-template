import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

type DrizzleDb = ReturnType<typeof drizzle>;

let cached: DrizzleDb | null = null;

function getDb(): DrizzleDb {
  if (cached) return cached;
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }
  // HARD CONSTRAINT: pool max=1, sequential queries only
  const queryClient = postgres(process.env.DATABASE_URL, { max: 1 });
  cached = drizzle(queryClient);
  return cached;
}

// Lazy proxy: defer connection until first use so module load doesn't
// throw during Next.js build-time page data collection.
export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    const target = getDb() as unknown as Record<string | symbol, unknown>;
    const value = target[prop];
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(target)
      : value;
  },
});
