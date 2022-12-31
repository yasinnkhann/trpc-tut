import '../../styles/globals.css';
import type { AppType } from 'next/app';
import { trpc } from '../utils/trpc';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<>
			<Component {...pageProps} />
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
};

export default trpc.withTRPC(MyApp);
