import React, { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { useFeed } from "@/app/Home/Context/FeedPage";
import axios from "axios";
import { API } from "@/utils/api";
import { toast } from "sonner";

type Notification = {
  message: string;
  senderId: string;
  username: string;
  type: string;
  _id?: string;
};

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const data = useFeed();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API + `/api/notifications/${data?.userId}`);
      setNotifications(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Мэдэгдэл ачаалахад алдаа:", err);
    }
  };

  useEffect(() => {
    if (!data?.userId) return;

    console.log("👤 userId байна:", data.userId);

    const handleConnect = () => {
      console.log("🔌 socket connected:", socket.id);
      socket.emit("addUser", data.userId);
      console.log("✅ addUser дуудлаа:", data.userId);
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    fetchNotifications();

    const handler = (notif: Notification) => {
      console.log("📥 Шинэ мэдэгдэл хүлээн авлаа:", notif);

      const newNotif: Notification = {
        ...notif,
        message: `${notif.username} has ${notif.type}d your post`,
        _id: `${notif.senderId}-${notif.type}-${Date.now()}`,
      };

      setNotifications((prev) => [newNotif, ...prev]);

      toast("🔥 New Notification", {
        description: newNotif.message,
      });
    };

    socket.on("getNotification", handler);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("getNotification", handler);
    };
  }, [data?.userId]);

  const renderText = (notif: Notification) => {
    return notif.message || "New notification";
  };

  useEffect(() => {
    console.log("🔥 NotificationButtonPanel rendered");
  }, []);

  socket.on("connect", () => console.log("Socket connected:", socket.id));
  socket.on("disconnect", () => console.log("Socket disconnected"));
  socket.on("reconnect_attempt", () => console.log("Socket reconnect attempt"));

  return (
    <div>
      <div
        className={`${
          activePanel === "notifications"
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } transition-all duration-400 ease-in-out fixed top-0 left-0 h-screen ml-[75px] bg-white dark:bg-black border-r border-gray-200 dark:border-zinc-800 p-4`}
        style={{ minWidth: "400px" }}
      >
        <div className="h-[160px] w-[400px] p-5 border-b-[1px] flex items-center">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        </div>
        {notifications.length > 0 && (
          <div className="shadow-md rounded-lg p-4 mb-4 mt-[30px]">
            <ul className="space-y-1 overflow-y-auto text-sm">
              {notifications.map((notif) => (
                <li
                  key={notif._id}
                  className="text-black dark:text-white h-[50px] flex items-center"
                >
                  {renderText(notif)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationButtonPanel;
