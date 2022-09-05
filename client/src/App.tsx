import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { trpc } from './trpc';

const client = new QueryClient();

const AppContent = () => {
	const [user, setUser] = useState('');
	const [message, setMessage] = useState('');

	const hello = trpc.useQuery(['hello']);
	const getMessages = trpc.useQuery(['get-messages']);

	const addMessage = trpc.useMutation(['add-message']);

	const handleAddMessage = (e: any) => {
		e.preventDefault();
		addMessage.mutate(
			{
				user,
				message,
			},
			{
				onSuccess: () => {
					client.invalidateQueries(['get-messages']);
				},
			}
		);
	};

	return (
		<div style={{ textAlign: 'center' }}>
			<p>{JSON.stringify(hello.data)}</p>
			{(getMessages.data ?? []).map((row: any, idx: number) => (
				<div key={idx}>
					<p>{JSON.stringify(row)}</p>
				</div>
			))}

			<form onSubmit={handleAddMessage}>
				<input
					type='text'
					value={user}
					onChange={e => setUser(e.target.value)}
					placeholder='User'
				/>
				<input
					type='text'
					value={message}
					onChange={e => setMessage(e.target.value)}
					placeholder='Message'
				/>
				<button type='submit'>Send</button>
			</form>
		</div>
	);
};

const App = () => {
	const [trpcClient] = useState(() =>
		trpc.createClient({
			url: 'http://localhost:3001/trpc',
		})
	);
	return (
		<trpc.Provider client={trpcClient} queryClient={client}>
			<QueryClientProvider client={client}>
				<AppContent />
			</QueryClientProvider>
		</trpc.Provider>
	);
};

export default App;
