import Notification from "../models/notification";
import { Server } from "socket.io";

export const createAndSendNotification = async ({
  io,
  senderId,
  receiverId,
  type,
  postId,
  storyId,
}: {
  io: Server;
  senderId: string;
  receiverId: string;
  type: "like" | "comment" | "follow" | "story_view";
  postId?: string;
  storyId?: string;
}) => {
  const notification = await Notification.create({
    sender: senderId,
    receiver: receiverId,
    type,
    post: postId,
    story: storyId,
  });

  const populatedNotif = await notification.populate(
    "sender",
    "username avatarImage"
  );

  io.to(receiverId).emit("notification", populatedNotif);
};
