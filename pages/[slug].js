import Message from '../components/Message';
import { Router, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebase';
import { toast } from 'react-toastify';
import Image from 'next/image';
import {
	arrayUnion,
	doc,
	onSnapshot,
	Timestamp,
	updateDoc,
} from 'firebase/firestore';

export default function Details() {
	const router = useRouter();
	const routeData = router.query;
	const [message, setMessage] = useState('');
	const [allMessages, setAllMessages] = useState([]);

	//Submit comment
	const submitComment = async () => {
		//check if the user is logged
		if (!auth.currentUser) return router.push('/auth/login');
		if (!message) {
			toast.error('Please, write a comment', {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 1500,
			});
			return;
		}

		const docRef = doc(db, 'posts', routeData.id);
		await updateDoc(docRef, {
			comments: arrayUnion({
				message,
				avatar: auth.currentUser.photoURL,
				userName: auth.currentUser.displayName,
				time: Timestamp.now(),
			}),
		});

		setMessage('');
	};

	//get all comments
	const getComments = async () => {
		const docRef = doc(db, 'posts', routeData.id);
		const unsubcribe = onSnapshot(docRef, (snapshot) => {
			setAllMessages(snapshot.data().comments);
		});
		return unsubcribe;
	};

	useEffect(() => {
		if (!router.isReady) return;
		getComments();
	}, [router.isReady]);

	return (
		<div>
			<Message {...routeData}></Message>
			<div className="my-4">
				<div className="flex gap-2">
					<input
						onChange={(e) => setMessage(e.target.value)}
						type="text"
						value={message}
						placeholder="Comment this post"
						className="bg-gray-800 w-full p-2 text-white text-sm rounded-lg"
					/>
					<button
						onClick={() => submitComment()}
						className="bg-cyan-500 text-white py-2 px-4 text-sm rounded-lg"
					>
						Submit
					</button>
				</div>
				<div className="py-6">
					<h2 className="font-bold">
						{allMessages ? 'Comments' : 'No comments'}
					</h2>
					{allMessages?.map((message) => (
						<div key={message.time} className="bg-white p-4 my-4 border-2">
							<div className="flex items-center gap-2 mb-4">
								<Image
									src={message.avatar}
									alt={message.userName}
									width={40}
									height={40}
									className="rounded-full"
								/>
								<h2>{message.userName}</h2>
							</div>
							<h2>{message.message}</h2>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
