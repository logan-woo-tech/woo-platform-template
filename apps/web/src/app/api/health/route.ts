import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@template/db';

export async function GET() {
  const start = Date.now();

  let dbStatus: 'ok' | 'down' = 'ok';
  try {
    await db.execute(sql`SELECT 1`);
  } catch (error) {
    console.error('DB health check failed:', error);
    dbStatus = 'down';
  }

  const aiStatus: 'ok' | 'down' = process.env.ANTHROPIC_API_KEY ? 'ok' : 'down';

  const overallStatus =
    dbStatus === 'ok' && aiStatus === 'ok' ? 'ok' : dbStatus === 'down' ? 'down' : 'degraded';

  return NextResponse.json(
    {
      status: overallStatus,
      version: process.env.NEXT_PUBLIC_VERSION ?? 'unknown',
      dependencies: {
        db: dbStatus,
        ai: aiStatus,
      },
      response_time_ms: Date.now() - start,
    },
    {
      status: overallStatus === 'ok' ? 200 : 503,
    },
  );
}
