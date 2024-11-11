
import CollaborativeRoom from '@/components/CollaborativeRoom'
import { getDocument } from '@/lib/actions/room.actions'
import { getClerkUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const Document = async ({ params: { id } }: SearchParamProps) => {

  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress
  })
  console.log('room en Document: ', room)
  console.log('EmailAddress', clerkUser.emailAddresses[0].emailAddress)
  // console.log('room.metadata in Document', room.metadata)

  if (!room) redirect('/')

  const userIds = Object.keys(room.usersAccesses)
  
  console.log('room.usersAccesses en Document: ', room.usersAccesses)
  console.log('userIds en Document: ', userIds)
  
  const users = await getClerkUser({ userIds })

  console.log('users en document: ', users)
  const usersData = users?.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes('room:write')
    ? 'editor'
    : 'viewer'
  }))
  const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer'
  console.log('currentUserType: ', currentUserType)
  return (
    <div className='flex w-full flex-col items-center'>
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </div>
  )
}

export default Document