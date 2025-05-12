"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface Post {
  _id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  avatarImage: string;
  posts: Post[];
  followers: number | any[];
  following: number | any[];
}

interface HoverProfileCardProps {
  user: User;
}

const HoverProfileCard: FC<HoverProfileCardProps> = ({ user }) => {
  const router = useRouter();

  const [isFollowing, setIsFollowing] = useState(true); // default true, customize if needed

  const followers =
    typeof user.followers === "number"
      ? user.followers
      : Array.isArray(user.followers)
        ? user.followers.length
        : 0;

  const following =
    typeof user.following === "number"
      ? user.following
      : Array.isArray(user.following)
        ? user.following.length
        : 0;

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);

    // Optional: send to API
    // await fetch(`/api/users/${user._id}/follow`, {
    //   method: isFollowing ? "DELETE" : "POST",
    // });
  };

  const handleMessage = () => {
    router.push(`/messages/${user._id}`);
  };

  return (
    <div className="bg-black text-white rounded-xl p-4 w-80 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={user.avatarImage || "/img/default-avatar.png"}
            className="object-cover"
          />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{user.username}</p>
          <p className="text-gray-400 text-sm">
            @{user.username.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-4 text-center text-sm">
        <div>
          <p className="font-bold">{user.posts?.length ?? 0}</p>
          <p className="text-gray-400">Posts</p>
        </div>
        <div>
          <p className="font-bold">{followers}</p>
          <p className="text-gray-400">Followers</p>
        </div>
        <div>
          <p className="font-bold">{following}</p>
          <p className="text-gray-400">Following</p>
        </div>
      </div>

      {/* Post Preview */}
      {user.posts?.length > 0 && (
        <div className="grid grid-cols-3 gap-1 mt-4 max-h-48 overflow-y-auto pr-1">
          {user.posts.map((post) => (
            <Image
              key={post._id}
              src={post.imageUrl}
              alt={post.caption}
              width={90}
              height={90}
              className="object-cover w-full h-24 rounded-sm"
            />
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between gap-2 mt-4">
        <Button
          onClick={handleMessage}
          className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md"
        >
          Message
        </Button>
        <Button
          onClick={handleFollowToggle}
          className="flex-1 px-2 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs rounded-md"
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>
    </div>
  );
};

export default HoverProfileCard;
