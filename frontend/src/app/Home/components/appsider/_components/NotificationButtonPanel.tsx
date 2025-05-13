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
    if (data?.userId) {
      socket.emit("addUser", data.userId);

      fetchNotifications();

      const handler = (notif: Notification) => {
        console.log("Шинэ мэдэгдэл:", notif);

        const newNotif: Notification = {
          ...notif,
          message: `${notif.username} has ${notif.type}d your post`, // 🧠 шууд мессеж үүсгэх
          _id: `${notif.senderId}-${notif.type}-${Date.now()}`, // хиймэл ID
        };
        toast("🔥 New Like", {
          description: `${notif.username} liked your post`,
          action: {
            label: "View",
            onClick: () => console.log("clicked"),
          },
          duration: 4000,
        });

        setNotifications((prev) => [newNotif, ...prev]);
      };
      socket.on("getNotification", handler);

      return () => {
        socket.off("getNotification", handler);
      };
    }
  }, [data?.userId]);

  const renderText = (notif: Notification) => {
    return notif.message || "New notification";
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
        <div className="h-[160px] w-[400px] p-5 border-b-[1px]">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          {notifications.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Notifications
              </h4>
              <ul className="space-y-1 max-h-32 overflow-y-auto text-sm">
                {notifications.map((notif) => (
                  <li
                    key={notif._id}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {renderText(notif)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationButtonPanel;
