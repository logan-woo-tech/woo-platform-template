import { router } from '../trpc';
import { healthRouter } from './health';
import { authRouter } from './auth';
import { aiRouter } from './ai';

export const appRouter = router({
  health: healthRouter,
  auth: authRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
