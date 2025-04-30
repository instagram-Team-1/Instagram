"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "next/navigation";
import { Smile } from "lucide-react";

let socket: Socket;

type Message = {
  from: string;
  content: string;
  createdAt: string;
};

export default function Home() {
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [msg, setMsg] = useState("");
  const currentUser = params.id as string;
  const roomId = "global-room";

  useEffect(() => {
    socket = io("http://localhost:4000");

    socket.emit("joinRoom", roomId);

    socket.on("previousMessages", (loaded: Message[]) => {
      setMessages(loaded);
    });

    socket.on("toClient", (data: Message) => {
      setMessages((prev) => [...prev, data]);
      console.log(messages+"sad");
      
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;

    const now = new Date().toISOString();

    const messageData: Message = {
      content: msg,
      from: currentUser,
      createdAt: now,
    };

    socket.emit("sendmsg", { ...messageData, roomId });
    setMessages((prev) => [...prev, messageData]);
    setMsg("");
  };

  return (
    <div className="flex flex-col justify-between h-screen bg-black text-white px-4 py-6">
      <div className="border-b border-white/20 pb-4 mb-4">
        <h1 className="text-xl font-semibold">Group Chat: {roomId}</h1>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 flex flex-col space-y-2 justify-end">
      {messages
  .filter((m) => m.from !== "System") // Hide system messages
  .map((m, index) => (
    <div
      key={index}
      className={`max-w-[70%] px-4 py-2 rounded-lg text-white break-words ${
        m.from === currentUser
          ? "bg-blue-600 self-end"
          : "bg-gray-700 self-start"
      }`}
    >
      <div>{m.content}</div>
      <div className="text-xs text-white/50">
        {new Date(m.createdAt).toLocaleTimeString()}
      </div>
    </div>
))}
      </div>

      <div className="flex items-center border border-white/10 p-3 rounded-xl">
        <Smile className="text-white/70 mr-2" />
        <input
          type="text"
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-transparent outline-none placeholder:text-white/50 text-white px-2"
        />
        <button
          onClick={sendMessage}
          className="ml-3 bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
