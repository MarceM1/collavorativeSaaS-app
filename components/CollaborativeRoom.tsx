'use client'

import Loader from "@/components/Loader"
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense"
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React, { useEffect, useRef, useState } from 'react'
import ActiveCollaborators from "./ActiveCollaborators"
import { Input } from "./ui/input"
// import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import { updateDocument } from "@/lib/actions/room.actions"
import ShareModal from "./ShareModal"


const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {

	// console.log('roomMetadata: ', roomMetadata)
	// console.log('roomId: ', roomId)


	const [documentTitle, setDocumentTitle] = useState(roomMetadata.title)
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLDivElement>(null)

	const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		setLoading(true)

		try {
			if (documentTitle !== roomMetadata.title) {
				const updatedDocument = await updateDocument(roomId, documentTitle);

				if (updatedDocument) {
					setEditing(false)
				}
			}
		} catch (error) {
			console.log('error in updateTitleHanlder: ', error)
		}

		setLoading(false)
	}

	useEffect(() => {
		const handlerClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setEditing(false)
				updateDocument(roomId, documentTitle)
			}
		}

		document.addEventListener('mousedown', handlerClickOutside);

		return () => {
			document.removeEventListener('mousedown', handlerClickOutside)
		};

	}, [roomId, documentTitle])

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus()
		}
	}, [editing])

	return (
		<RoomProvider id={roomId}>
			<ClientSideSuspense fallback={<Loader />}>
				<div className="collaborative-room">
					<Header >
						<div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
							{editing && !loading ? (
								<Input
									type="text"
									value={documentTitle}
									ref={inputRef}
									placeholder="Enter title"
									onChange={(e) => setDocumentTitle(e.target.value)}
									// onKeyDown={updateTitleHandler}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											updateTitleHandler(e);
										}
									}}
									disabled={!editing}
									className="document-title-input"
								/>
							) : (
								<>
									<p className="document-title">{documentTitle}</p>
								</>
							)}

							{currentUserType === 'editor' && !editing && (
								<Image
									src={'/assets/icons/edit.svg'}
									alt="Edit"
									width={24}
									height={24}
									onClick={() => setEditing(true)}
									className="cursor-pointer"
								/>
							)}

							{currentUserType !== 'editor' && !editing && (
								<p className="view-only-tag">View only</p>
							)}

							{loading && (
								<p className="view-only-tag text-gray-400">saving...</p>
							)}
						</div>
						<div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
							<ActiveCollaborators />
							<ShareModal 
								roomId={roomId}
								collaborators={users}
								creatorId={roomMetadata.creatorId}
								currentUserType={currentUserType}
							/>
							<SignedOut>
								<SignInButton />
							</SignedOut>
							<SignedIn>
								<UserButton />
							</SignedIn>
						</div>
					</Header>
					<Editor roomId={roomId} currentUserType={currentUserType} />
				</div>
			</ClientSideSuspense>
		</RoomProvider>
	)
}

export default CollaborativeRoom