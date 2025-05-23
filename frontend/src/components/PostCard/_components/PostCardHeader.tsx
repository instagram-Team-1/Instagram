"use client";

import { FC } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { User as UserType } from "@/lib/types";
import { useRouter } from "next/navigation";

interface PostHeaderProps {
  user: UserType;
  createdAt: string;
}

const PostHeader: FC<PostHeaderProps> = ({ user, createdAt }) => {
  const router = useRouter()
  function getTimeAgo(dateString: string) {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMinutes = Math.floor(diffMs / 1000 / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return created.toLocaleDateString();
  }

  const timeAgo = getTimeAgo(createdAt);

  return (
    <div className="flex items-center justify-between py-3 px-2">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/Home/users/" + user.username)}>
        <Avatar className="w-[32px] h-[32px]">
          <AvatarImage src={user.avatarImage || "/img/default-avatar.png"} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-row gap-1">
          <span className="text-sm font-medium cursor-pointer">{user.username}</span>
          <span className="text-sm text-gray-400">• {timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;