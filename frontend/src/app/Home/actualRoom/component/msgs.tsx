import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API } from "@/utils/api";

type Participant = {
  avatarImage: string;
  name: string;
};

type Chat = {
  _id: string;
  name: string;
  lastMessage: string;
  participants: Participant[];
};

type User = {
  userId: {
    id: string;
  };
};

const Msgs = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const storedUser = JSON.parse(userInfo) as User;
        if (!storedUser) {
          setError("User ID not found in localStorage");
          setLoading(false);
          return;
        }

        setUserId(storedUser.userId.id);

        const res = await axios.get(`${API}/api/auth/chats/${storedUser.userId.id}`);
        setAllChats(res.data);
        console.log(res.data);
        
      } catch (err) {
        console.error("Failed to fetch chats:", err);
        setError("Failed to fetch chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const jumpTo = (id: string) => {
    router.push(`/Home/actualRoom/${id}`);
  };

  return (
    <div className="flex flex-col gap-[20px] text-white">
      {loading ? (
        <p>Loading chats...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : allChats.length > 0 ? (
        <div className="flex flex-col gap-[15px]">
          {allChats.map((chat) => (
            <div
              key={chat._id}
              className="flex gap-[10px] items-center hover:bg-gray-600 p-2 cursor-pointer"
              onClick={() => jumpTo(chat._id)}
            >
              <div className="flex gap-1">
                {chat.participants.slice(0, 3).map((user, idx) => (
                  <Avatar
                    key={idx}
                    className="w-[40px] h-[40px] border-1 border-white"
                  >
                    <AvatarImage src={user.avatarImage} />
                    {/* <AvatarFallback>{user.name.charAt(0)}</AvatarFallback> */}
                  </Avatar>
                ))}
              </div>
              <div className="text-[12px]">
                <p className="font-semibold">{chat.name}</p>
                <p className="text-gray-300">Last message: {chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No chats available.</p>
      )}
    </div>
  );
};

export default Msgs;
