import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

function getAdmin(): SupabaseClient {
  if (cached) return cached;
  cached = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
  return cached;
}

/**
 * Admin client with service role key. Bypasses RLS.
 *
 * SECURITY: Server-only. Never expose to client.
 *
 * Lazy proxy: defer client construction until first use so module load
 * doesn't fail during Next.js build-time page data collection.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const target = getAdmin() as unknown as Record<string | symbol, unknown>;
    const value = target[prop];
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(target)
      : value;
  },
});
