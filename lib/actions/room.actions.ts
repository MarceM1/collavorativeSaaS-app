"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import { redirect } from "next/navigation";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: []
    });
    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.log("error while creating a room: ", error);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    // console.log("Iniciando tryblock");
    // console.log("roomId: ", roomId);
    // console.log("userId: ", userId);

    const room = await liveblocks.getRoom(roomId);
     // console.log("room: ", room);
      const hasAccess = Object.keys(room.usersAccesses).includes(userId);
      // console.log('hasAccess: ', hasAccess)
      if (!hasAccess) {
        throw new Error("You do not have access to this document");
      }
    return parseStringify(room);
  } catch (error) {
     console.log("error in getDocument: ", error);
  }
};

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log("error in updateDocument: ", error);
  }
};

export const getDocuments = async (email: string) => {
  try {
    
     console.log("Iniciando tryblock in getDocuments");
     console.log(" email in getDocuments: ", email);

    
    const roomsA = await liveblocks.getRooms({userId:email});
    
    const rooms = parseStringify(roomsA)
    console.log('roomsA', roomsA)
    
    console.log('rooms', rooms)
    return rooms;
  } catch (error) {
    console.log("error in getDocuments: ", error);
  }
};


export const updateDocumentAccess = async ({roomId, email, userType, updatedBy}: ShareDocumentParams)=>{
  try {
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    }

    console.log('userAccesses in updateDocumentAccess: ', usersAccesses)

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses
    })

    console.log('room in updateDocumentAccess: ', room)


    if(room){
      const notificationId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: email,
        kind:'$documentAccess',
        subjectId: notificationId,
        activityData:{
          userType,
          title:`You have been granted ${userType} access to the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email
        },
        roomId
      })

    }
    revalidatePath(`/documents/${roomId}`)
    return parseStringify(room)
  } catch (error) {
    console.log('Error in updateDocumentAccess: ', error)
  }
}

export const removeCollaborator = async ({roomId, email}: {roomId:string, email:string})=>{
  try {
    const room = await liveblocks.getRoom(roomId)
    if(room.metadata.email === email){
      throw new Error('You cannot remove yourself ')
    }

    const updateRoom = await liveblocks.updateRoom(roomId,{
      usersAccesses:{
        [email]: null
      }
    })
    revalidatePath(`/documents/${roomId}`)
    return parseStringify(updateRoom)
  } catch (error) {
    console.log('error in removeCollaborator: ', error)
  }
}

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath('/')
    redirect('/')
  } catch (error) {
    console.log('error in deleteRoom: ', error)
  }
}