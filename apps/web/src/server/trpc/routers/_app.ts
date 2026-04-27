import { router } from '../trpc';
import { healthRouter } from './health';
import { authRouter } from './auth';

export const appRouter = router({
  health: healthRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
