'use client';
import { Send } from 'lucide-react';
import { NewMessageDialog } from './components/newMessage';
import Msgs from '../actualRoom/component/msgs';

const page = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full bg-black min-h-screen p-4 md:p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full p-4 md:p-6 lg:p-8 border border-white w-[150px] h-[150px] md:w-[200px] md:h-[200px] flex items-center justify-center">
          <Send size={80} className="text-white md:text-[100px]" />
        </div>
        <h1 className="text-white text-lg md:text-2xl">Your messages</h1>
        <p className="text-white/50 text-sm md:text-base">Send a message to start a chat.</p>
        <NewMessageDialog />
      </div>
    </div>
  );
};

export default page;
