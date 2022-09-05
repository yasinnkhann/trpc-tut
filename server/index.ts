import * as trpcExpress from '@trpc/server/adapters/express';
import * as trpc from '@trpc/server';
import { z } from 'zod';
import express from 'express';
import cors from 'cors';

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

const appRouter = trpc
	.router()
	.query('hello', {
		// http://localhost:3001/trpc/hello
		resolve() {
			return 'Hello World!!!';
		},
	})
	.query('get-messages', {
		input: z.number().default(3),
		resolve({ input }) {
			return messages.slice(-input);
		},
	})
	.mutation('add-message', {
		input: z.object({
			user: z.string(),
			message: z.string(),
		}),
		resolve({ input }) {
			messages.push(input);
			return input;
		},
	});

export type AppRouter = typeof appRouter;

const app = express();
const port = 3001;

app.use(cors());

app.use(
	'/trpc',
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext: () => null,
	})
);

app.get('/', (req, res) => {
	res.send('Hello from server!!!');
});

app.listen(port, () => {
	console.log(`server listening at http://localhost:${port}`);
});
