import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Lazy Anthropic client.
 * Initialized on first call to avoid build-time env var requirement.
 */
let _client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required for AI calls');
    }
    _client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return _client;
}

/**
 * Reset client (useful for testing).
 */
export function resetClient(): void {
  _client = null;
}
