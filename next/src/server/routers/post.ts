import { tRouter, publicProcedure } from '../trpc';
import { z } from 'zod';

export const postRouter = tRouter({
	'get-all': publicProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.post.findMany();
	}),
	'create-one': publicProcedure
		.input(z.object({ title: z.string(), description: z.string() }))
		.mutation(async ({ input, ctx }) => {
			return await ctx.prisma.post.create({
				data: { title: input.title, description: input.description },
			});
		}),
	'update-one': publicProcedure
		.input(
			z.object({ id: z.number(), title: z.string(), description: z.string() })
		)
		.mutation(async ({ input, ctx }) => {
			const { id, ...rest } = input;

			return await ctx.prisma.post.update({
				where: { id },
				data: { ...rest },
			});
		}),
	'delete-one': publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			return await ctx.prisma.post.delete({
				where: { id: input.id },
			});
		}),
	'delete-all': publicProcedure
		.input(z.object({ ids: z.number().array() }))
		.mutation(async ({ input, ctx }) => {
			return await ctx.prisma.post.deleteMany({
				where: {
					id: { in: input.ids },
				},
			});
		}),
});
