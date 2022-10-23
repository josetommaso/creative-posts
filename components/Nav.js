import Link from 'next/link';
import Image from 'next/image';
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Nav() {
	const [user, loading] = useAuthState(auth);
	return (
		<nav className="flex justify-between items-center py-10">
			<Link href="/">
				<button className="text-lg font-medium">Creative Posts</button>
			</Link>
			<ul className="flex items-center gap-10">
				{!user && (
					<Link href="/auth/login">
						<a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
							Join Now
						</a>
					</Link>
				)}
				{user && (
					<div className="flex items-center gap-6">
						<Link href="/post">
							<button className="font-medium bg-cyan-600 text-white py-2 px-4 rounded-md text-sm">
								Post
							</button>
						</Link>
						<Link href="/dashboard">
							<a>
								<Image
									src={user.photoURL}
									alt={user.displayName}
									width="40"
									height="40"
									className="rounded-full cursor-pointer"
								/>
							</a>
						</Link>
					</div>
				)}
			</ul>
		</nav>
	);
}
