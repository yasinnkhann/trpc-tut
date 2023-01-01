import { initTRPC, TRPCError } from '@trpc/server';
import { TContext } from './context';
import superjson from 'superjson';

const t = initTRPC.context<TContext>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape;
	},
});

const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.session) {
		throw new TRPCError({
			message: 'No session detected.',
			code: 'UNAUTHORIZED',
		});
	}
	return next({
		ctx: {
			// Infers the `session` as non-nullable
			session: ctx.session,
		},
	});
});

export const tRouter = t.router;

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(isAuthed);
