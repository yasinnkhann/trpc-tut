import { tRouter } from '../trpc';
import { exampleRouter } from './example';
import { postRouter } from './post';

export const appRouter = tRouter({
	example: exampleRouter,
	post: postRouter,
});

export type AppRouter = typeof appRouter;
