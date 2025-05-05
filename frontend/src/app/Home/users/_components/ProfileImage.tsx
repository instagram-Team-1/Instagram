import React from "react";
import { UserDataType } from "@/lib/types";
import { log } from "console";

type Props = {
  user: UserDataType;
};

export default function ProfileImage({ user }: Props) {
  const DEFAULT_IMAGE = "https://i.pinimg.com/originals/0f/78/5d/0f785d55cea2a407ac8c1d0c6ef19292.jpg";

  const imageUrl = user.avatarImage;
  console.log(imageUrl);

  return (
    <div className="w-[283.67px] h-[181px] flex items-center justify-center">
      <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden">
        <img
          src={user?.avatarImage}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
        />
      </div>
    </div>
  );
}

