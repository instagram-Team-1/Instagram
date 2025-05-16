"use client";

import { FC } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { User as UserType } from "@/lib/types";

interface PostHeaderProps {
  user?: UserType | null; 
}

const PostHeader: FC<PostHeaderProps> = ({ user }) => {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-[32px] h-[32px]">
            <AvatarImage src={user?.avatarImage || "/img/default-avatar.png"} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="relative inline-block">
          <span className="text-sm font-medium cursor-pointer">
            {user?.username || "Unknown User"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
