/**
 * Model identifiers and selection logic per ADR-014.
 *
 * Hard constraint: Opus reserved for 4 approved use cases.
 * Default to Sonnet for most operations.
 * Haiku for cheap operations (validation, simple checks).
 */

export const MODELS = {
  HAIKU: 'claude-haiku-4-5-20251001',
  SONNET: 'claude-sonnet-4-6',
  OPUS: 'claude-opus-4-7',
} as const;

export type ModelId = (typeof MODELS)[keyof typeof MODELS];

/**
 * Approved Opus use cases.
 * Hard constraint: Opus selection requires use case in this list.
 */
export const OPUS_APPROVED_CASES = [
  'placement_test_grading',
  'session_synthesis',
  'pedagogy_briefing',
  'eval_judging',
] as const;

export type OpusUseCase = (typeof OPUS_APPROVED_CASES)[number];

/**
 * Cost per 1M tokens (input | output) USD.
 * Update when Anthropic pricing changes.
 *
 * Source: https://docs.anthropic.com/en/docs/about-claude/pricing
 */
export const PRICING_PER_MTOKENS = {
  [MODELS.HAIKU]: { input: 1.0, output: 5.0 },
  [MODELS.SONNET]: { input: 3.0, output: 15.0 },
  [MODELS.OPUS]: { input: 15.0, output: 75.0 },
} as const;

/**
 * Select appropriate model for use case.
 *
 * Logic:
 * - 'quick_*' or 'simple_*' prefix → Haiku
 * - Approved Opus cases → Opus
 * - Default → Sonnet
 */
export function selectModel(useCase: string): ModelId {
  if (OPUS_APPROVED_CASES.includes(useCase as OpusUseCase)) {
    return MODELS.OPUS;
  }

  if (useCase.startsWith('quick_') || useCase.startsWith('simple_')) {
    return MODELS.HAIKU;
  }

  return MODELS.SONNET;
}

/**
 * Calculate cost for a call in USD.
 */
export function calculateCost(model: ModelId, inputTokens: number, outputTokens: number): number {
  const pricing = PRICING_PER_MTOKENS[model];
  if (!pricing) {
    return 0;
  }

  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  return Number((inputCost + outputCost).toFixed(6));
}
