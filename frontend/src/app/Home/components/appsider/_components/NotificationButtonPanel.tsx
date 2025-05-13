import React from "react";
import { FollowNotification } from "./Notifications/FollowingNotifications";
import { LikeNotification } from "./Notifications/LikeNotification";
import { CommentNotification } from "./Notifications/CommentNotification";

type ActivePanelType = "none" | "search" | "messages" | "notifications";

interface NotificationButtonPanelProps {
  activePanel: ActivePanelType;
}

function NotificationButtonPanel({
  activePanel,
}: NotificationButtonPanelProps) {
  return (
    <div>
      {" "}
      <div
        className={`${
          activePanel === "notifications"
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } transition-all duration-400 ease-in-out fixed top-0 left-0 h-screen ml-[75px] bg-white dark:bg-black border-r border-gray-200 dark:border-zinc-800 p-4`}
        style={{ minWidth: "400px" }}
      >
        <div className="h-[160px] w-[400px] p-5 border-b-[1px]">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <ul>
            <li className="mb-2">New like on your post</li>
            <li className="mb-2">New comment on your photo</li>
            <FollowNotification
              username="username"
              avatarImage="avatarImage"
              isFollowing={true}
            />
            <LikeNotification
              username="username"
              avatarUrl="/avatars/johndoe.jpg"
              photoThumbnailUrl="/photos/liked-photo.jpg"
            />
            <CommentNotification
              username="johndoe"
              avatarUrl="/avatars/johndoe.jpg"
              comment="Awesome view!"
              photoThumbnailUrl="/photos/photo123.jpg"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NotificationButtonPanel;
