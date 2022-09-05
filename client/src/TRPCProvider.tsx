import React, { useState, createContext } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { trpc } from './trpc';

interface Props {
	children?: React.ReactNode;
}

export const TRPCContext = createContext<QueryClient | null>(null);

export const TRPCProvider = ({ children }: Props) => {
	const [queryClient] = useState(() => new QueryClient());

	const [trpcClient] = useState(() =>
		trpc.createClient({
			url: 'http://localhost:3001/trpc',
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<TRPCContext.Provider value={queryClient}>
					{children}
				</TRPCContext.Provider>
			</QueryClientProvider>
		</trpc.Provider>
	);
};
