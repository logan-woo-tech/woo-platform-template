import 'server-only';

/**
 * Run primary function with fallback if it throws.
 *
 * Hard constraint: every AI feature MUST have ≥2 layers.
 * This helper enforces the pattern.
 *
 * @example
 * const message = await withFallback(
 *   () => generateAIWelcome(user),
 *   () => getTemplateWelcome(user)
 * );
 */
export async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  try {
    return await primary();
  } catch (error) {
    console.warn('Primary failed, using fallback:', error);
    return await fallback();
  }
}
