'use client'

import Loader from "@/components/Loader"
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense"
import { ReactNode } from "react"


const Provider = ({ children }: { children: ReactNode }) => {
	return (
		<LiveblocksProvider authEndpoint={'/api/liveblocks-auth'} >
			<RoomProvider id="my-room">
				<ClientSideSuspense fallback={<Loader/>}>
					{children}
				</ClientSideSuspense>
			</RoomProvider>
		</LiveblocksProvider>
	)
}

export default Provider