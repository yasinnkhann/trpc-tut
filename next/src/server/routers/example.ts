import { tRouter, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const exampleRouter = tRouter({
	hello: publicProcedure
		.output(z.object({ greeting: z.string() }))
		.input(z.object({ text: z.string().nullish() }))
		.query(async ({ input }) => {
			// exists at: baseURL()/api/trpc/hello
			return {
				greeting: `hello ${input?.text ?? 'world'}`,
			};
		}),
	'check-auth': protectedProcedure.output(z.string()).query(async () => {
		return 'You are authorized to see this!';
	}),
});
