import React, { useState } from 'react';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import { getBaseURL } from '../utils/getBaseURL';
import superjson from 'superjson';

interface Props {
	children?: React.ReactNode;
}

export const TRPCProvider = ({ children }: Props) => {
	const [queryClient] = useState(() => new QueryClient());

	const [trpcClient] = useState(() =>
		trpc.createClient({
			transformer: superjson,
			links: [
				httpBatchLink({
					url: `${getBaseURL()}/api/trpc`,
					// // optional
					// headers() {
					// 	return {};
					// },
				}),
			],
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
};
