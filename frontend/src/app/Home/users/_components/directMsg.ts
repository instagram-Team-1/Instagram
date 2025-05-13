// directMsg.ts
import axios from "axios";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const directMsg = async (
  router: AppRouterInstance,
  currentUser: { id: string; username: string },
  targetUser: { _id: string; username: string }
) => {
  const selectedUsers = [
    { name: targetUser.username, id: targetUser._id },
    { name: currentUser.username, id: currentUser.id },
  ];

  try {
    const checkRoomRes = await axios.post(`${API}/api/chat/checkRoom`, {
      selectedUsers,
    });

    if (checkRoomRes.data.roomExists) {
      router.push(`/Home/actualRoom/${checkRoomRes.data.roomId}`);
    } else {
      const createRoomRes = await axios.post(`${API}/api/auth/Room`, {
        selectedUsers,
      });

      if (createRoomRes.data.message === "Room created successfully") {
        router.push(`/Home/actualRoom/${createRoomRes.data.roomId}`);
      }
    }
  } catch (error) {
    console.error("Error handling chat room:", error);
    toast.error("Failed to handle chat room.");
  }
};

export default directMsg;
