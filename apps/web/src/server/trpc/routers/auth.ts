import { z } from 'zod';
import { router, authenticatedProcedure } from '../trpc';

export const authRouter = router({
  me: authenticatedProcedure
    .output(
      z.object({
        id: z.string(),
        email: z.string(),
        role: z.string().nullable(),
      }),
    )
    .query(({ ctx }) => ({
      id: ctx.user.id,
      email: ctx.user.email ?? '',
      role: ctx.userRole,
    })),
});
