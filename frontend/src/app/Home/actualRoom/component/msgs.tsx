import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { API } from '@/utils/api'

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
  id: string;
};

const Msgs = () => {
  const router = useRouter();
  const [userId, setUserid] = useState<User | null>(null);
  const [allChats, setAllchats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const storedUserId = JSON.parse(localStorage.getItem('id') || '{}') as User;
      setUserid(storedUserId);

      if (storedUserId?.id) {
        try {
          const res = await axios.get(`${API}/api/auth/chats/${storedUserId.id}`);
          setAllchats(res.data);
        } catch (err) {
          console.error("Failed to fetch chats", err);
        }
      }
    };
    fetch();
  }, []);

  const jumpTo = (id: string) => {
    router.push(`/Home/actualRoom/${id}`);
  };

  return (
    <div className='flex flex-col gap-[20px] text-white'>
      {allChats.length > 0 && (
        <div className='flex flex-col gap-[15px]'>
          {allChats.map((chat) => (
            <div
            key={chat._id}
            className='flex gap-[10px] items-center hover:bg-gray-600 p-2 cursor-pointer'
            onClick={() => jumpTo(chat._id)}
          >
            <div className="flex gap-1">
              {chat.participants.slice(0,3).map((user, idx) => (
                <Avatar key={idx} className="w-[40px] h-[40px] border-1 border-white">
                  <AvatarImage src={user.avatarImage} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className='text-[12px]'>
              <p className='font-semibold'>{chat.name}</p>
              <p className='text-gray-300'>last message: {chat.lastMessage}</p>
            </div>
          </div>
          
          ))}
        </div>
      )}
    </div>
  );
};

export default Msgs;
