import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import superjson from 'superjson';
import { TContext, createContext } from './context';

interface ChatMessage {
	user: string;
	message: string;
}

const messages: ChatMessage[] = [
	{ user: 'user1', message: 'Hello' },
	{ user: 'user2', message: 'Hi' },
	{ user: 'user3', message: 'Hola' },
	{ user: 'user4', message: 'Oi' },
	{ user: 'user5', message: 'Bonjour' },
];

const t = initTRPC.context<TContext>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape;
	},
});

export const tRouter = t.router;

export const publicProcedure = t.procedure;

export const tMiddleware = t.middleware;

const appRouter = tRouter({
	hello: publicProcedure.output(z.string()).query(async () => {
		// exists at: baseURL()/api/trpc/hello
		return 'Hello from trpc!!';
	}),

	'get-messages': publicProcedure
		.output((value: unknown) => {
			if (value && typeof value === typeof messages) {
				console.log(value);
				return value;
			}
			throw new Error('Wrong type');
		})
		.input(z.number().default(3))
		.query(({ input }) => {
			return messages.slice(-input);
		}),

	'add-messages': publicProcedure
		.output((value: unknown) => {
			if (
				value &&
				typeof value === typeof { user: 'user1', message: 'Hello' }
			) {
				return value;
			}
			throw new Error('Wrong type');
		})
		.input(z.object({ user: z.string(), message: z.string() }))
		.mutation(({ input }) => {
			messages.push(input);
			return input;
		}),
});

export type AppRouter = typeof appRouter;

const port = process.env.PORT ?? 3001;

const app = express();

app.use(cors());

app.use(
	'/api/trpc',
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext,
	})
);

app.get('/', (_req, res) => {
	res.send('Hello from server!!!');
});

app.listen(port, () => {
	console.log(`🚀 Server listening on port ${port}`);
});
