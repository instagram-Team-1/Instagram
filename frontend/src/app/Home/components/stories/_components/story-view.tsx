import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface StoryViewProps {
  imageUrl: string;
  username: string;
  timeAgo: string;
  avatarImage: string;
  onImageLoad?: () => void; // Optional for parent sync
}

export const StoryView: React.FC<StoryViewProps> = ({
  imageUrl,
  username,
  timeAgo,
  avatarImage,
  onImageLoad,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
    if (onImageLoad) onImageLoad();
  };

  return (
    <div className="relative w-full h-full bg-black">
      
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-gray-800" />
      )}
      <img
        src={imageUrl}
        alt="story"
        className={`w-full h-full object-contain bg-black transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleImageLoad}
      />
      <div className="absolute top-0 left-0 w-full p-4 flex items-center bg-gradient-to-b from-black/80 to-transparent z-10">
        <img
          src={avatarImage}
          alt="avatar"
          className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-white"
        />
        <div className="text-white">
          <div className="font-semibold text-sm">{username}</div>
          <div className="text-xs text-gray-300">{timeAgo}</div>
        </div>
      </div>
    </div>
  );
};
