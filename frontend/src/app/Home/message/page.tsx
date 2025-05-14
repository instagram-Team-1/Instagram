'use client';
import { Send } from 'lucide-react';
import { NewMessageDialog } from './components/newMessage';
import Msgs from '../actualRoom/component/msgs';

const page = () => {
  return (
    <div className="flex items-center justify-center w-full bg-black h-[100vh]">
      <Msgs/>
      <div className="flex items-center flex-col gap-[10px]">
        <div className="rounded-full p-[15px] border border-white w-[200px] h-[200px] flex items-center justify-center">
          <Send size={100} className="text-white" />
        </div>
        <h1 className="text-white">Your messages</h1>
        <p className="text-white/50">Send a message to start a chat.</p>
        <NewMessageDialog />
      </div>
    </div>
  );
};

export default page;