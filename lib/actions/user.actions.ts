"use server";

import { clerkClient } from "@clerk/clerk-sdk-node";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUser = async ({ userIds }: { userIds: string[] }) => {
  try {
    // console.log("userIds: ", userIds);
    const { data } = await clerkClient.users.getUserList({
      emailAddress: userIds,
    });
    // console.log("data:", data);
    // console.log('data in getClerckUser', data)
    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));

    const sortedUsers = userIds.map((email) =>
      users.find((user) => user.email === email)
    );

    return parseStringify(sortedUsers);
  } catch (error) {
    console.log("error in getClerkUser: ", error);
  }
};

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    );

    if (text.length > 0) {
      const lowerCaseText = text.toLowerCase();

      const filteredUsers = users.filter((email) =>
        email.toLowerCase().includes(lowerCaseText)
      );

      return parseStringify(filteredUsers);
    }
    return parseStringify(users);
  } catch (error) {
    console.log("error in getDocumentsUsers: ", error);
  }
};
