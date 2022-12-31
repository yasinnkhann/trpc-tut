import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../prisma/client';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext({ req, res }: CreateNextContextOptions) {
	const session = await getSession({ req });

	return {
		session,
		prisma,
		req,
		res,
	};
}

export type TContext = inferAsyncReturnType<typeof createContext>;
