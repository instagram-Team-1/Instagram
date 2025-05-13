"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { UserDataType } from "@/lib/types";
import { API } from "@/utils/api";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import socket from "@/lib/socket";

type Props = {
  user: UserDataType;
  currentUserId: string;
  onUserDataUpdate?: (user: UserDataType) => void;
};

export default function ProfileHeader({ user, currentUserId, onUserDataUpdate }: Props) {
  const [isFollowing, setIsFollowing] = useState<boolean>(user.followers?.some(f => f === currentUserId) || false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalUsers, setModalUsers] = useState<{ _id: string; username: string }[]>([]);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<{
      _id?: string;
      avatarImage?: string;
      followers?: string[];
      following?: string[];
      posts?: string[];
    } | null>(null);



  const router = useRouter();

  const handleFollow = async () => {
    if (currentUserId === user._id) {
      toast.error("Өөрийгөө дагах боломжгүй");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isFollowing ? "/api/unfollow" : "/api/follow";
      const response = await axios.post(`${API}${endpoint}`, {
        followerId: currentUserId,
        followingId: user._id,
      });
      if (!isFollowing) {
        socket.emit("sendNotification", {
          senderId: currentUserId,
          receiverId: user._id,
          type: "follow",
        });
      } else {
        socket.emit("sendNotification", {
          senderId: currentUserId,
          receiverId: user._id,
          type: "unfollow",
        });
      }
      toast.success(response.data.message);
      setIsFollowing(!isFollowing);

      const userRes = await axios.get(`${API}/api/users/${user._id}`);
      setUserData(userRes.data);
      onUserDataUpdate?.(userRes.data);
    } catch (error: any) {
      console.error("Алдаа:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

const createChatRoom = async () => {
  const storedData = localStorage.getItem("userInfo");
  let myId = null;
  let myUsername = "";

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    myId = parsedData.userId?.id;
    myUsername = parsedData.username?.username;
  }

  if (!myId || !myUsername) {
    toast.error("User information not found. Please login.");
    return;
  }

  const selectedUsers = [
    { name: user.username, id: user._id },
    { name: myUsername, id: myId },
  ];
  console.log("Selected Users:", selectedUsers);

  try {
    const checkRoomRes = await axios.post(`${API}/api/chat/checkRoom`, { selectedUsers });
    console.log("Check Room Response:", checkRoomRes.data);

    if (checkRoomRes.data.roomExists) {
      console.log("Room exists");
      router.push(`/Home/actualRoom/${checkRoomRes.data.roomId}`);
    } else {
      const createRoomRes = await axios.post(`${API}/api/auth/Room`, { selectedUsers });
      console.log("Create Room Response:", createRoomRes.data);

      if (createRoomRes.data.message === "Room created successfully") {
        console.log("Room created successfully");
        router.push(`/Home/actualRoom/${createRoomRes.data.roomId}`);
      }
    }
  } catch (error) {
    console.error("Error handling chat room:", error);
    toast.error("Failed to handle chat room.");
  }
};


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API}/api/users/${user._id}`);
        setUserData(res.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Хэрэглэгчийн мэдээллийг татахад алдаа гарлаа!");
      }
    };

    fetchUserData();
  }, [user._id]);

  return (
    <div className="flex flex-col ml-[20px] gap-[30px]">
      <div className="text-[20px] font-normal flex flex-row items-center gap-[8px]">
        <div>{user.username}</div>
        <Button
          className={`${isFollowing ? 'bg-gray-200' : 'bg-blue-400'} text-white`}
          onClick={handleFollow}
          disabled={isLoading || currentUserId === user._id}
        >
          {isLoading ? (
            <span>Loading...</span>
          ) : isFollowing ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </Button>
        <Button variant="secondary" className="hover:bg-gray-200" onClick={createChatRoom}>
          Message
        </Button>
      </div>
      <div className="text-[16px] text-gray-400 flex gap-8">
        <div>{userData?.posts?.length || 0} posts</div>
        <div
          className="cursor-pointer"
          onClick={() => {
            setModalType("followers");
            setIsModalOpen(true);
          }}
        >
          {userData?.followers?.length || 0} followers
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            setModalType("following");
            setIsModalOpen(true);
          }}
        >
          {userData?.following?.length || 0} following
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {modalType === "followers" ? "Followers" : "Following"}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            {modalUsers.map((user) => (
              <div key={user._id} className="py-2 border-b">
                @{user.username}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <div className="text-[16px] text-gray-500">
        {user.bio || "No bio yet"}
      </div>
    </div>
  );
}