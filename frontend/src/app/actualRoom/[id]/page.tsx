"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Smile } from 'lucide-react';

let socket: Socket;

const Page = () => {
  const [msg, setMsg] = useState('');
  const [received, setReceived] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 
  const params = useParams();
  const roomId = params.id;


  useEffect(() => {
    const userIdFromStorage = JSON.parse(localStorage.getItem('id'));

    if (userIdFromStorage) {
      setCurrentId(userIdFromStorage.id);
    } else {
      console.log("User not logged in or userId not found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (!currentId) return;

    socket = io('http://localhost:9000');

    socket.emit('join-room', {
      roomId,
      currentId,
    });

    socket.on('fromServer', (data) => {
      console.log('Received message from server:', data);
      setReceived((prevMsgs) => [...prevMsgs, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentId, roomId]);

  const sendChat = () => {
    if (!currentId) {
      console.log("User is not logged in.");
      return;
    }

    socket.emit('serverMSG', {
      roomId,
      senderId: currentId,
      content: msg,
    });
    console.log('Message sent:', msg);
    setMsg('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendChat();
    }
  };

  return (
    <div className='bg-black w-full h-[100vh] text-white flex flex-col justify-between'>
      <div className="flex-1 overflow-y-auto p-4">
        <div>
          {received.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-[10px] rounded-xl w-fit ${
                message.sender._id === currentId
                  ? 'bg-blue-600 text-right ml-auto' 
                  : 'bg-gray-700 text-left'
              }`}
            >
              {message.sender._id !== currentId && (
                <strong>{message.sender.username}</strong> 
              )}
               {message.content}
            </div>
          ))}
        </div>
      </div>

      <div className='border rounded-xl p-[20px] flex items-center gap-[20px]'>
        <Smile
          className="cursor-pointer"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)} // Toggle emoji picker visibility
        />

        {showEmojiPicker && (
          <div className="absolute bottom-[80px] z-10">
            emojis
          </div>
        )}

        <input
          type="text"
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKeyDown} 
          className="w-full outline-none text-white bg-transparent"
        />
      </div>
    </div>
  );
};

export default Page;
