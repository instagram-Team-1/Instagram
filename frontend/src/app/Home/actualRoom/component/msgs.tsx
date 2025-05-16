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
    <div className="flex flex-col gap-4 text-white w-full max-w-lg mx-auto p-4 md:p-6">
      {loading ? (
        <ChatSkeleton />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : allChats.length > 0 ? (
        <div className="flex flex-col gap-4">
          {allChats.map((chat) => (
            <div
              key={chat._id}
              className="flex gap-3 items-center hover:bg-gray-700 rounded-lg p-2 cursor-pointer transition-colors"
              onClick={() => jumpTo(chat._id)}
            >
              <div className="flex -space-x-2">
                {chat.participants.slice(0, 3).map((user, idx) => (
                  <Avatar
                    key={idx}
                    className="w-[40px] h-[40px] border-2 border-white"
                  >
                    <AvatarImage src={user.avatarImage} />
                    <AvatarFallback className="bg-gray-500 text-white">
                     x
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>

              <div className="flex-1 min-w-0 text-[14px] md:text-[16px]">
                <p className="font-semibold truncate">{chat.name}</p>
                <p className="text-gray-400 truncate text-sm md:text-base">
                  Last message: {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white/70">No chats available.</p>
      )}
    </div>
  );
};

export default Msgs;
