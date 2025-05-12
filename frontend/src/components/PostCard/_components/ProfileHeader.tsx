"use client";

import { FC } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  avatarImage: string;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ username, avatarImage }) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-16 h-16">
        <AvatarImage
          src={avatarImage || "/img/default-avatar.png"}
          className="object-cover"
        />
        <AvatarFallback>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-lg font-semibold">{username}</p>
        <p className="text-gray-400 text-sm">@{username.toLowerCase()}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
