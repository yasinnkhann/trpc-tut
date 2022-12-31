import { useState } from 'react';
import { trpc } from './utils/trpc';

export function App() {
	const utils = trpc.useContext();

	const [user, setUser] = useState('');
	const [message, setMessage] = useState('');

	const hello = trpc.hello.useQuery();
	const getMessages = trpc['get-messages'].useQuery();
	const addMessage = trpc['add-messages'].useMutation();

	const handleAddMessage = (e: any) => {
		e.preventDefault();
		addMessage.mutate(
			{
				user,
				message,
			},
			{
				onSuccess: data => {
					console.log('SUCCESS: ', data);
					utils['get-messages'].invalidate();
				},
			}
		);
	};

	if (!hello.data) return <div>Loading...</div>;

	return (
		<div style={{ textAlign: 'center' }}>
			<p>{hello.data}</p>
			{(getMessages.data ?? []).map((ChatMsg, idx: number) => (
				<div key={idx}>
					<p>{JSON.stringify(ChatMsg)}</p>
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
}

export default App;
