'use client'

import Loader from "@/components/Loader"
import { getClerkUser, getDocumentUsers } from "@/lib/actions/user.actions"
import { useUser } from "@clerk/nextjs"
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense"
import { ReactNode } from "react"


const Provider = ({ children }: { children: ReactNode }) => {
	const { user: clerkUser } = useUser();

	return (
		<LiveblocksProvider authEndpoint={'/api/liveblocks-auth'} 
		resolveUsers={async ({userIds})=>{
			const users = await getClerkUser({userIds})
			console.log('users in Provider', users)
			return users
		}}
		resolveMentionSuggestions={async ({ text, roomId }) => {
			const roomUsers = await getDocumentUsers({
			  roomId,
			  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
			  currentUser: clerkUser?.emailAddresses[0].emailAddress!,
			  text,
			})
	
			return roomUsers;
		  }}
		>
			
				<ClientSideSuspense fallback={<Loader/>}>
					{children}
				</ClientSideSuspense>
			
		</LiveblocksProvider>
	)
}

export default Provider