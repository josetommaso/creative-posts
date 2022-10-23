import { auth, db } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import postcss from 'postcss';
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function Post() {
	const [user, loading] = useAuthState(auth);
	const route = useRouter();
	const routeData = route.query;

	//form state
	const [post, setPost] = useState({ description: '' });

	//submit post
	const submitPost = async (e) => {
		e.preventDefault();

		//Run checks for description
		if (post.description.trim() == '') {
			toast.error('Description field empty 😥', {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 2000,
			});
			return;
		}

		if (post.description.length > 300) {
			toast.error('Description too long 😥', {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 2000,
			});
			return;
		}

		//edit post
		if (post?.hasOwnProperty('id')) {
			const docRef = doc(db, 'posts', post.id);
			const updatedPost = { ...post, timestamp: serverTimestamp() };
			await updateDoc(docRef, updatedPost);
			toast.success('Your post was edited succesfully 📫', {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 2000,
			});
			return route.push('/');
		} else {
			//make a new post
			const collectionRef = collection(db, 'posts');

			await addDoc(collectionRef, {
				...post,
				timestamp: serverTimestamp(),
				user: user.uid,
				avatar: user.photoURL,
				username: user.displayName,
			});

			setPost({ ...post, description: '' });
			toast.success('Your post was created succesfully 📫', {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 2000,
			});
			return route.push('/');
		}
	};

	useEffect(() => {
		//check our user
		const checkUser = async () => {
			if (loading) return;
			if (!user) route.push('/auth/login');

			if (routeData.id) {
				setPost({ description: routeData.description, id: routeData.id });
			}
		};

		checkUser();
	}, [user, loading, route, routeData.description, routeData.id]);

	return (
		<div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
			<form onSubmit={submitPost}>
				<h1 className="text-2xl font-bold">
					{routeData.id ? 'Edit your post' : 'Create a new post'}
				</h1>
				<div className="py-2">
					<h3 className="py-2 text-lg font-medium">Description</h3>
					<textarea
						value={post.description}
						onChange={(e) => setPost({ ...post, description: e.target.value })}
						className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
					></textarea>
					<p
						className={` font-medium text-sm ${
							post.description.length > 300 ? 'text-red-600' : 'text-cyan-600'
						}`}
					>
						{post.description.length}/300
					</p>
					<button
						type="submit"
						className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}
