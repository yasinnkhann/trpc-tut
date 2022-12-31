import { useState } from 'react';
import { trpc } from '../utils/trpc';

export default function IndexPage() {
	const utils = trpc.useContext();

	const [info, setInfo] = useState({
		title: '',
		description: '',
	});

	const hello = trpc.example.hello.useQuery({ text: 'yasin' });
	const getPosts = trpc.post['get-all'].useQuery();
	const createPost = trpc.post['create-one'].useMutation();
	const updatePost = trpc.post['update-one'].useMutation();
	const deletePost = trpc.post['delete-one'].useMutation();
	const deleteAllPosts = trpc.post['delete-all'].useMutation();

	if (!hello.data || !getPosts.data) {
		return <div>Loading...</div>;
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInfo(currInfo => ({
			...currInfo,
			[e.target.name]: e.target.value,
		}));
	};

	const handleAddedPost = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { title, description } = info;

		if (!title || !description) return;
		createPost.mutate(
			{
				title,
				description,
			},
			{
				onSuccess: () => {
					utils.post['get-all'].invalidate();
					// // or
					// getPosts.refetch();
				},
			}
		);

		setInfo({
			title: '',
			description: '',
		});
	};

	const handleUpdatedPost = (id: number) => {
		return updatePost.mutate(
			{ id, title: 'Updated Title', description: 'Updated Description' },
			{
				onSuccess: () => {
					getPosts.refetch();
				},
			}
		);
	};

	const handleDeletePost = (id: number) => {
		return deletePost.mutate(
			{ id },
			{
				onSuccess: () => {
					getPosts.refetch();
					// utils.invalidateQueries(['posts.get-all']);
				},
			}
		);
	};

	const handleDeleteAllPosts = () => {
		const allIds = getPosts.data.map(post => post.id);

		if (allIds.length) {
			return deleteAllPosts.mutate(
				{ ids: allIds },
				{
					onSuccess: () => {
						getPosts.refetch();
					},
				}
			);
		}
	};

	return (
		<>
			<section>
				<p>{hello.data.greeting}</p>
			</section>
			<section>
				<form onSubmit={handleAddedPost}>
					<input
						type='text'
						placeholder='Title...'
						name='title'
						value={info.title}
						onChange={handleChange}
					/>
					<input
						type='text'
						placeholder='Description...'
						name='description'
						value={info.description}
						onChange={handleChange}
					/>
					<button type='submit'>Submit</button>
				</form>
				<br />
				<br />

				<div>
					{getPosts.data.map(post => (
						<div key={post.id} style={{ border: '1px solid black' }}>
							<p>Title: {post.title}</p>
							<p>Description: {post.description}</p>
							<div>
								<button onClick={() => handleUpdatedPost(post.id)}>
									Update
								</button>
							</div>
							<button onClick={() => handleDeletePost(post.id)}>Delete</button>
						</div>
					))}
				</div>
				<button onClick={handleDeleteAllPosts}>Delete All Posts</button>
			</section>
		</>
	);
}
