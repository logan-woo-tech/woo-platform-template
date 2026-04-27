import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { db } from '@template/db';
import { router, publicProcedure } from '../trpc';

export const healthRouter = router({
  status: publicProcedure
    .output(
      z.object({
        status: z.enum(['ok', 'degraded', 'down']),
        version: z.string(),
        dependencies: z.object({
          db: z.enum(['ok', 'down']),
          ai: z.enum(['ok', 'down']),
        }),
        responseTimeMs: z.number(),
      }),
    )
    .query(async () => {
      const start = Date.now();

      let dbStatus: 'ok' | 'down' = 'ok';
      try {
        await db.execute(sql`SELECT 1`);
      } catch {
        dbStatus = 'down';
      }

      const aiStatus: 'ok' | 'down' = process.env.ANTHROPIC_API_KEY ? 'ok' : 'down';

      const overallStatus =
        dbStatus === 'ok' && aiStatus === 'ok' ? 'ok' : dbStatus === 'down' ? 'down' : 'degraded';

      return {
        status: overallStatus,
        version: process.env.NEXT_PUBLIC_VERSION ?? 'unknown',
        dependencies: { db: dbStatus, ai: aiStatus },
        responseTimeMs: Date.now() - start,
      };
    }),
});
