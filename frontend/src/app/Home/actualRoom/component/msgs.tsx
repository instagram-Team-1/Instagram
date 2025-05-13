import React, { useEffect, useState, useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API } from "@/utils/api";
import { userContext } from "../../layout";
import ChatSkeleton from "./chatSkeleton";
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

const Msgs = () => {
  const router = useRouter();
  const context = useContext(userContext);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!context || !context.id) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API}/api/auth/chats/${context.id}`);
        setAllChats(res.data);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
        setError("Failed to fetch chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [context]);

  const jumpTo = (id: string) => {
    router.push(`/Home/actualRoom/${id}`);
  };

  return (
    <div className="flex flex-col gap-[20px] text-white">
      {loading ? (
       <ChatSkeleton/>
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
