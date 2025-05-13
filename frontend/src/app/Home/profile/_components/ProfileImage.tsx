"use client";

import { CldImage } from "next-cloudinary";

type ProfileImageProps = {
  src?: string | null;
  hasStory?: boolean;
  onClick?: () => void;
};

export const ProfileImage = ({ src, hasStory, onClick }: ProfileImageProps) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-[150px] h-[150px] bg-gray-300 rounded-full overflow-hidden group cursor-pointer ${
        hasStory ? "border-4 border-pink-500" : "border-4 border-gray-300"
      }`}
    >
      {src ? (
        <CldImage
          src={src}
          width={150}
          height={150}
          alt="profile"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src="https://i.pinimg.com/originals/0f/78/5d/0f785d55cea2a407ac8c1d0c6ef19292.jpg"
          alt="default profile"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
};
