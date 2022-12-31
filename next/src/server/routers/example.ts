import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const exampleRouter = router({
	hello: publicProcedure
		.output(z.object({ greeting: z.string() }))
		.input(z.object({ text: z.string().nullish() }))
		.query(async ({ input }) => {
			// exists at: baseURL()/api/trpc/hello
			return {
				greeting: `hello ${input?.text ?? 'world'}`,
			};
		}),
});
