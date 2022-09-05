import { useState } from 'react';
import { trpc } from './utils/trpc';

const App = () => {
	const utils = trpc.useContext();

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
					utils.invalidateQueries(['get-messages']);
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

export default App;
