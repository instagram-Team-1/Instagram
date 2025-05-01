import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from 'axios'
import { useRouter } from 'next/navigation'
const msgs = () => {
    const router = useRouter()
    const [userId,setUserid] = useState([])
    const [allChats, setAllchats] = useState([])

    useEffect(() => {

        const fetch = async () => {
const userId = localStorage.getItem('token')

            const res = await axios.get(`http://localhost:9000/api/auth/chats/${userId}`)
           
            setAllchats(res.data)
        }
        fetch()
    }, [])
const jumpTo = (id:string)=>{
   router.push(`/actualRoom/${id}`)
    
}



    return (
        <div className='flex flex-col gap-[20px]'>
            {allChats && (
                <div>
                    {allChats.map((chat, index) => (
                        <div key={index} className='flex gap-[10px] items-center' onClick={()=>jumpTo(chat._id)}>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='text-[12px]'>
                                {chat.name}
                                <p>last msg</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default msgs
