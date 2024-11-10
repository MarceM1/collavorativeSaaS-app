"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

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
      ["email"]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ['room:write'],
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
    console.log('Iniciando tryblock')
    console.log('roomId: ', roomId)
    console.log('userId: ', userId)

    const room = await liveblocks.getRoom(roomId);
    console.log('room: ', room)
    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    // console.log('hasAccess: ', hasAccess)


    // if (!hasAccess) {
    //   throw new Error("You do not have access to this document");
    // }
    return parseStringify(room);
  } catch (error) {
    console.log("error in getDocument: ", error);
  }
};
