import { z } from 'zod';
import { router, authenticatedProcedure } from '../trpc';
import { generateWelcomeMessage, callAI, withFallback } from '@template/ai';

export const aiRouter = router({
  /**
   * Generate AI welcome message for current user.
   * Demonstrates withFallback pattern — if AI fails, returns template.
   */
  welcome: authenticatedProcedure
    .input(
      z.object({
        locale: z.enum(['vi', 'en']),
      }),
    )
    .output(
      z.object({
        message: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userName = ctx.user.email?.split('@')[0] ?? 'friend';
      const message = await generateWelcomeMessage({
        userName,
        locale: input.locale,
        userId: ctx.user.id,
      });
      return { message };
    }),

  /**
   * Echo endpoint — simple AI call demonstrating cost tracking.
   * Uses Haiku (cheap) via simple_ prefix.
   */
  echo: authenticatedProcedure
    .input(
      z.object({
        message: z.string().min(1).max(500),
      }),
    )
    .output(
      z.object({
        response: z.string(),
        model: z.string(),
        costUsd: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return withFallback(
        async () => {
          const result = await callAI({
            useCase: 'simple_echo',
            systemPrompt: 'Echo back the user message verbatim. Add nothing else.',
            userMessage: input.message,
            userId: ctx.user.id,
          });
          return {
            response: result.text,
            model: result.model,
            costUsd: result.costUsd,
          };
        },
        () => ({
          response: input.message,
          model: 'fallback',
          costUsd: 0,
        }),
      );
    }),
});
