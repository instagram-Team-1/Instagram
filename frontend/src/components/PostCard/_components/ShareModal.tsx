"use client";

import { FC, useState } from "react";
import { X, Copy } from "lucide-react";
import Image from "next/image";

interface ShareModalProps {
  onClose: () => void;
}

const ShareModal: FC<ShareModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const friends = [
    { name: "Juliana", image: "/img/user1.png" },
    { name: "Pine", image: "/img/user2.png" },
  ];
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-lg w-[90%] max-w-md p-4 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-white">
          <X size={24} />
        </button>
        <h2 className="text-white text-lg font-semibold text-center mb-4">
          Share
        </h2>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-neutral-800 text-white p-2 rounded-md mb-4 outline-none placeholder-gray-400 text-sm"
        />
        <div className="flex flex-wrap gap-4 overflow-y-auto max-h-48 mb-4">
          {filteredFriends.map((friend, idx) => (
            <div key={idx} className="flex flex-col items-center w-20">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-600">
                <Image
                  src={friend.image}
                  role="img"
                  alt={`${friend.name}-н профайлын зураг`}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-white text-xs mt-1 text-center truncate">
                {friend.name}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-around border-t border-neutral-700 pt-4">
          <div className="flex flex-col items-center">
            <Copy className="text-white mb-1" size={20} />
            <span className="text-white text-xs">Copy link</span>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/img/fb.png"
              alt="Facebook"
              width={20}
              height={20}
              className="mb-1"
            />
            <span className="text-white text-xs">Facebook</span>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/img/messenger.png"
              alt="Messenger"
              width={20}
              height={20}
              className="mb-1"
            />
            <span className="text-white text-xs">Messenger</span>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/img/whatsapp.png"
              alt="WhatsApp"
              width={20}
              height={20}
              className="mb-1"
            />
            <span className="text-white text-xs">WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
