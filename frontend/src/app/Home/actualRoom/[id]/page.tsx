"use client";
import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MESSENGERAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import RoomHeader from "../component/roomHeader";
import { userContext } from "../../layout";
import TypingAnimation from "../component/typingAnimation";

let socket: Socket;
const Page = () => {
  const [msg, setMsg] = useState("");
  const [received, setReceived] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [prevMessage, setPrevMessage] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ userId: string; username: string; avatarImage: string }[]>([]);
  const params = useParams();
  const context = useContext(userContext);
  const roomId = params.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  let typingTimeout: NodeJS.Timeout;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [prevMessage, received]);

  useEffect(() => {
    if (context?.id) {
      setCurrentId(context.id);
    }
  }, [context?.id]);

  useEffect(() => {
    if (!currentId) return;
    socket = io(MESSENGERAPI);
    socket.emit("join-room", {
      roomId,
      currentId: currentId as string,
    });
    socket.on("previousMessages", (messages) => {
      setPrevMessage(messages);
    });
    socket.on("fromServer", (data) => {
      setReceived((prevMsgs) => [...prevMsgs, data]);
    });
    socket.on("displayTyping", ({ userId, username, avatarImage, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          const isAlreadyTyping = prev.some((user) => user.userId === userId);
          if (!isAlreadyTyping) {
            return [...prev, { userId, username, avatarImage }];
          }
          return prev;
        } else {
          return prev.filter((user) => user.userId !== userId);
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [currentId, roomId]);

  const sendChat = () => {
    if (!currentId || msg.trim() === "") {
      return;
    }
    socket.emit("serverMSG", {
      roomId,
      senderId: currentId as string,
      content: msg,
    });
    setMsg("");
    socket.emit("typing", { roomId, userId: currentId, isTyping: false });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);

    if (!currentId) return;

    if (e.target.value.trim() === "") {
      socket.emit("typing", { roomId, userId: currentId, isTyping: false });
    } else {
      socket.emit("typing", { roomId, userId: currentId, isTyping: true });
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit("typing", { roomId, userId: currentId, isTyping: false });
      }, 2000);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendChat();
    }
  };
console.log(typingUsers);

  return (
    <div className="bg-black w-full h-[100vh] text-white flex flex-col justify-between relative px-[50px]">
      <RoomHeader />

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col justify-between">
          {[...prevMessage, ...received].map((message, index) => {
            const isCurrentUser = message.sender._id === currentId;
            return (
              <div
                key={index}
                className={`mb-4 flex items-start gap-2 ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isCurrentUser && (
                  <Avatar>
                    <AvatarImage src={message.sender.avatarImage} />
                    <AvatarFallback>xopp</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[70%] ${
                    isCurrentUser
                      ? "bg-blue-600 text-right"
                      : "bg-gray-700 text-left"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })}
          {typingUsers.length > 0 && (
  <div className="flex items-center gap-2 mb-2">
    {typingUsers.map((user) => (
      <div key={user.userId} className="flex items-center gap-2 w-fit">
        <Avatar>
          <AvatarImage src={user.avatarImage} />
          <AvatarFallback>user</AvatarFallback>
        </Avatar>
        <div className="w-full flex flex-col gap-1">
            {user.username}
        <TypingAnimation/>
          </div>
      
      </div>
    ))}
  </div>
)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-700 p-[20px] flex items-center gap-[20px] relative">
        <Smile
          className="cursor-pointer"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        {showEmojiPicker && (
          <div className="absolute bottom-[80px] z-10">emojis (coming soon)</div>
        )}
        <input
          type="text"
          placeholder="Type a message..."
          value={msg}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          className="w-full outline-none text-white bg-transparent"
        />
      </div>
    </div>
  );
};

export default Page;
