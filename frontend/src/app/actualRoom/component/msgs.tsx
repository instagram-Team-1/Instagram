import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from 'axios'
import { useRouter } from 'next/navigation'


type Chat = {
  _id: string;
  name: string;
  lastMessage: string;
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
                const res = await axios.get(`http://localhost:9000/api/auth/chats/${storedUserId.id}`);
                setAllchats(res.data);
                console.log(res.data);
                console.log('hh');
                
            }
        };
        fetch();
    }, []);

    const jumpTo = (id: string) => {
        router.push(`/actualRoom/${id}`);
    };

    return (
        <div className='flex flex-col gap-[20px] text-white'>
            {allChats && (
                <div className='flex flex-col gap-[15px]'>
                    {allChats.map((chat, index) => (
                        <div key={index} className='flex gap-[10px] items-center hover:bg-gray-600' onClick={() => jumpTo(chat._id)}>
                            <Avatar className='w-[50px] h-[50px] bg-green-300 '>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='text-[12px]'>
                                {chat.name}
                                <p>{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Msgs;