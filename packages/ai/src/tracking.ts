import 'server-only';
import { db, aiCallLog } from '@template/db';
import type { ModelId } from './models';

export interface AICallTrackingData {
  userId: string | null;
  useCase: string;
  model: ModelId;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  durationMs: number;
  success: boolean;
  errorMessage?: string;
}

/**
 * Log AI call to database.
 *
 * Hard constraint: every AI call MUST be tracked here.
 * Failure to track = silent. Don't throw, log to console.
 */
export async function trackAICall(data: AICallTrackingData): Promise<void> {
  try {
    await db.insert(aiCallLog).values({
      userId: data.userId,
      useCase: data.useCase,
      model: data.model,
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens,
      costUsd: data.costUsd.toString(),
      durationMs: data.durationMs,
      success: data.success,
      errorMessage: data.errorMessage ?? null,
    });
  } catch (error) {
    console.error('Failed to track AI call:', error);
  }
}
