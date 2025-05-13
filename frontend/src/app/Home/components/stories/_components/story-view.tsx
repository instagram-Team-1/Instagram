import React from "react";

interface StoryViewProps {
  imageUrl: string;
  username: string;
  timeAgo: string;
  avatarImage: string;
}

export const StoryView: React.FC<StoryViewProps> = ({
  imageUrl,
  username,
  timeAgo,
  avatarImage,
}) => {
  return (

    
    <div className="relative w-full h-full bg-black">
      
      {/* Story Image */}
      <img
        src={imageUrl}
        alt="story"
        className="w-full h-full object-contain bg-black"
      />

      {/* Top Gradient + Info */}
      <div className="absolute top-0 left-0 w-full p-4 flex items-center bg-gradient-to-b from-black/80 to-transparent">
        <img
          src={avatarImage}
          alt=""
          className="w-10 h-10 rounded-full  overflow-hidden mr-3 border-2 border-white"
        />
        <div className="text-white">
          <div className="font-semibold text-sm">{username}</div>
          <div className="text-xs text-gray-300">{timeAgo}</div>
        </div>
      </div>
    </div>
  );
};
