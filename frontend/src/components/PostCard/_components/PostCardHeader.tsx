"use client";

import { FC, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import HoverProfileCard from "../HoverProfileCard";
import { User as UserType } from "@/lib/types";

interface PostHeaderProps {
  user: UserType;
}

const PostHeader: FC<PostHeaderProps> = ({ user }) => {
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [isHoveringName, setIsHoveringName] = useState(false);

  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-4">
        <div
          className="relative"
          onMouseEnter={() => setIsHoveringAvatar(true)}
          onMouseLeave={() => setIsHoveringAvatar(false)}
        >
          <Avatar className="w-[32px] h-[32px]">
            <AvatarImage src={user.avatarImage || "/img/default-avatar.png"} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          {isHoveringAvatar && (
            <div className="absolute top-full left-0 z-50">
              <HoverProfileCard user={user} />
            </div>
          )}
        </div>
        <div
          className="relative inline-block"
          onMouseEnter={() => setIsHoveringName(true)}
          onMouseLeave={() => setIsHoveringName(false)}
        >
          <span className="text-white text-sm font-medium cursor-pointer">
            {user.username || ""}
          </span>
          {isHoveringName && (
            <div className="absolute top-full mt-2 z-50">
              <HoverProfileCard user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
