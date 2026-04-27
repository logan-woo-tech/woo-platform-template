import { NextResponse } from 'next/server';

type DependencyStatus = 'ok' | 'down';
type OverallStatus = 'ok' | 'down' | 'degraded';

function checkDb(): DependencyStatus {
  // Placeholder until db setup in Sub-phase C
  return 'ok';
}

function checkAi(): DependencyStatus {
  // Placeholder until ai setup in Sub-phase D
  return process.env.ANTHROPIC_API_KEY ? 'ok' : 'down';
}

function computeOverall(db: DependencyStatus, ai: DependencyStatus): OverallStatus {
  if (db === 'ok' && ai === 'ok') return 'ok';
  if (db === 'down') return 'down';
  return 'degraded';
}

export async function GET() {
  const start = Date.now();

  const dbStatus = checkDb();
  const aiStatus = checkAi();
  const overallStatus = computeOverall(dbStatus, aiStatus);

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
