import Image from 'next/image';
import React from 'react';

export default function Message({ children, avatar, username, description }) {
	return (
		<div className="bg-white p-8 border-b-2 rounded">
			<div className="flex items-center gap-2">
				{avatar && (
					<Image
						src={avatar}
						alt={username}
						width="40"
						height="40"
						className="rounded-full cursor-pointer"
					/>
				)}
				<h2>{username}</h2>
			</div>
			<div className="py-4">
				<p>{description}</p>
			</div>
			{children}
		</div>
	);
}
