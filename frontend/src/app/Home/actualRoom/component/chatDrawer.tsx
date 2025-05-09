import React, { useEffect, useState } from 'react'
import { CircleAlert } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NameChanger from './nameChanger';
import AddToGroup from './addToGroup';
import axios from 'axios';
import { API } from '@/utils/api';
import { useParams } from 'next/navigation';

const Drawer = () => {
  const params = useParams()
  const roomId = params.id;
  
  const [participants, setParticipants] = useState<any[]>([]);  

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/api/chat/get/${roomId}`);
        setParticipants(res.data.participants); 
        console.log(res.data); 
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    }
    
    fetch();  
  }, [roomId]); 

  return (
    <div className='max-w-[350px]'>
      <h1 className='font-[700] p-[20px]'>Details</h1>
      <Separator className='bg-white/50' />
      
      <Dialog>
        <div className='flex justify-between p-[20px]'>
          <h1>Change group name</h1>
          <DialogTrigger>
            <Button>
              Change
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <NameChanger />
        </DialogContent>
      </Dialog>
      
      <Separator className='bg-white/50' />
      
      <div className='flex justify-between p-[20px]'>
        <p>Members</p>
        <Dialog>
          <DialogTrigger>
            <p className='text-blue-500 hover:text-white/50'>Add people</p>
          </DialogTrigger>
          <DialogContent>
            <AddToGroup />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Members list */}
      <div className="p-4">
        <h2 className="font-bold">Members:</h2>
        <div>
          {participants.length > 0 ? (
            participants.map((member: any) => (
              <div key={member._id} className="flex items-center py-2">
                <img
                  src={member.avatarImage || '/default-avatar.png'} // Fallback to a default avatar
                  alt={member.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <p>{member.username}</p>
              </div>
            ))
          ) : (
            <p>No members found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
export default Drawer;
