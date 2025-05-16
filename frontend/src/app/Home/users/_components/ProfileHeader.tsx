"use client";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { UserDataType } from "@/lib/types";
import { API } from "@/utils/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { userContext } from "../../layout";

type Props = {
  user: UserDataType;
  currentUserId: string;
  onUserDataUpdate?: (user: UserDataType) => void;
};

export default function ProfileHeader({
  user,
  currentUserId,
  onUserDataUpdate,
}: Props) {
  const router = useRouter();
  const context = useContext(userContext);

  const [isFollowing, setIsFollowing] = useState(
    user.followers?.some((f) => f === currentUserId) || false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [modalUsers, setModalUsers] = useState<
    {
      _id: string;
      username: string;
      avatarImage?: string;
      fullname?: string;
    }[]
  >([]);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<{
    _id?: string;
    avatarImage?: string;
    followers?: string[];
    following?: string[];
    posts?: string[];
  } | null>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API}/api/users/${user._id}`);
        setUserData(res.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, [user._id]);

  // Handle follow/unfollow
  const handleFollow = async () => {
    if (currentUserId === user._id) return;
    setIsLoading(true);
    try {
      const endpoint = isFollowing ? "/api/unfollow" : "/api/follow";
      const response = await axios.post(`${API}${endpoint}`, {
        followerId: currentUserId,
        followingId: user._id,
      });
      toast.success(response.data.message);
      setIsFollowing(!isFollowing);

      const userRes = await axios.get(`${API}/api/users/${user._id}`);
      setUserData(userRes.data);
      onUserDataUpdate?.(userRes.data);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Unable to update follow status.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create or navigate to chat room
  const createChatRoom = async () => {
    if (!context) {
      toast.error("User information not found. Please login.");
      return;
    }
    if (user._id === context.id) {
      toast.error("You cannot message yourself.");
      return;
    }
    const selectedUsers = [
      { name: user.username, id: user._id },
      { name: context.username, id: context.id },
    ];
    try {
      const checkRoomRes = await axios.post(`${API}/api/chat/checkRoom`, {
        selectedUsers,
      });
      router.push(`/Home/actualRoom/${checkRoomRes.data.roomId}`);
    } catch (error) {
      console.error("Error handling chat room:", error);
      toast.error("Failed to open chat room.");
    }
  };

  useEffect(() => {
    const fetchModalUsers = async () => {
      if (!userData || !modalType) return;
      const ids =
        modalType === "followers" ? userData.followers : userData.following;
      if (!ids) return;

      try {
        const users = await Promise.all(
          ids.map(async (id) => {
            const res = await axios.get(`${API}/api/users/${id}`);
            console.log("Fetched User Data:", res.data);
            return {
              _id: id,
              username: res.data.username,
              fullname: res.data.fullname ?? "No Name",
              avatarImage: res.data.avatarImage ?? "/default-avatar.png",
            };
          })
        );
        setModalUsers(users);
      } catch (err) {
        console.error("API fetch error:", err);
        toast.error("Error fetching users data!");
      }
    };

    if (isModalOpen) fetchModalUsers();
  }, [isModalOpen, modalType, userData]);

  // Fetch users for modal
  // useEffect(() => {
  //   const fetchModalUsers = async () => {
  //     if (!modalType || !isModalOpen || !userData) return;
  //     const ids = modalType === "followers" ? userData.followers : userData.following;
  //     if (!ids || ids.length === 0) {
  //       setModalUsers([]);
  //       return;
  //     }
  //     try {
  //       const res = await axios.get(`${API}/api/users/{id}`);
  //       setModalUsers(res.data);
  //     } catch (error) {
  //       console.error("Failed to fetch modal users:", error);
  //       setModalUsers([]);
  //     }
  //   };
  //   fetchModalUsers();
  // }, [modalType, isModalOpen, userData]);

  return (
    <div className="flex flex-col ml-5 gap-8">
      <div className="text-xl font-normal flex items-center gap-4">
        <div>{user.username}</div>
        <Button
          className={`dark:text-white dark:hover:bg-white/10 hover:bg-black/10 cursor-pointer ${
            !isFollowing ? "bg-blue-400 hover:bg-blue-500" : ""
          }`}
          onClick={handleFollow}
          variant="secondary"
          disabled={isLoading || currentUserId === user._id}
        >
          {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Button
          variant="secondary"
          onClick={createChatRoom}
          className="cursor-pointer dark:hover:bg-white/10 hover:bg-black/10"
        >
          Message
        </Button>
      </div>

      <div className="text-base text-gray-400 flex gap-8">
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
        <DialogContent className="w-[370px] p-0 px-3 dark:bg-[#282828]">
          <DialogHeader className="flex items-center py-2 border-b">
            <DialogTitle className="text-md">
              {modalType === "followers" ? "Followers" : "Following"}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto">
            {!modalUsers.length && (
              <div className="p-4 text-center text-gray-500">
                No users found
              </div>
            )}
            {modalUsers.map((u) => (
              <div key={u._id} className="py-2 flex items-center gap-3">
                <img
                  src={u.avatarImage}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="dark:text-white font-semibold">
                    {u.username}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {u.fullname || "No name"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="text-base text-gray-500">{user.bio || "No bio yet"}</div>
    </div>
  );
}
