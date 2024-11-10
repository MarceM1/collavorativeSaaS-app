'use client'

import Loader from "@/components/Loader"
import { getClerkUser } from "@/lib/actions/user.actions"
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense"
import { ReactNode } from "react"


const Provider = ({ children }: { children: ReactNode }) => {
	return (
		<LiveblocksProvider authEndpoint={'/api/liveblocks-auth'} 
		resolveUsers={async ({userIds})=>{
			const users = await getClerkUser({userIds})
			console.log('users in Provider', users)
			return users
		}}>
			<RoomProvider id="my-room">
				<ClientSideSuspense fallback={<Loader/>}>
					{children}
				</ClientSideSuspense>
			</RoomProvider>
		</LiveblocksProvider>
	)
}

export default Provider