import 'server-only';
import { getClient } from './client';
import { selectModel, calculateCost, type ModelId } from './models';
import { trackAICall } from './tracking';

export interface AICallOptions {
  /**
   * Use case identifier (snake_case).
   * Used for model selection and tracking.
   */
  useCase: string;

  /**
   * System prompt.
   */
  systemPrompt: string;

  /**
   * User message.
   */
  userMessage: string;

  /**
   * Optional override for model selection.
   */
  modelOverride?: ModelId;

  /**
   * Max output tokens. Default 1024.
   */
  maxTokens?: number;

  /**
   * Temperature 0-1. Default 0.7.
   */
  temperature?: number;

  /**
   * User ID for tracking. Pass null for anonymous calls.
   */
  userId: string | null;
}

export interface AICallResult {
  text: string;
  model: ModelId;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  durationMs: number;
}

/**
 * Make an AI call with cost tracking and degraded mode safety.
 *
 * Throws on failure. Use withFallback() for degraded mode pattern.
 */
export async function callAI(opts: AICallOptions): Promise<AICallResult> {
  const start = Date.now();
  const model = opts.modelOverride ?? selectModel(opts.useCase);

  try {
    const client = getClient();
    const response = await client.messages.create({
      model,
      max_tokens: opts.maxTokens ?? 1024,
      temperature: opts.temperature ?? 0.7,
      system: opts.systemPrompt,
      messages: [{ role: 'user', content: opts.userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const text = textBlock && textBlock.type === 'text' ? textBlock.text : '';

    const cost = calculateCost(model, response.usage.input_tokens, response.usage.output_tokens);
    const durationMs = Date.now() - start;

    await trackAICall({
      userId: opts.userId,
      useCase: opts.useCase,
      model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      costUsd: cost,
      durationMs,
      success: true,
    });

    return {
      text,
      model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      costUsd: cost,
      durationMs,
    };
  } catch (error) {
    const durationMs = Date.now() - start;

    await trackAICall({
      userId: opts.userId,
      useCase: opts.useCase,
      model,
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
      durationMs,
      success: false,
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }
}
