"use client";

import { FC, useState } from "react";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileStats from "./_components/ProfileStats";
import PostPreview from "./_components/PostPreview";
import ProfileActions from "./_components/ProfileActions";
import { User } from "@/lib/types";

interface HoverProfileCardProps {
  user: User;
}

const HoverProfileCard: FC<HoverProfileCardProps> = ({ user }) => {
  const [isFollowing, setIsFollowing] = useState(true);

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
  };

  return (
    <div className="bg-black text-white rounded-xl p-4 w-80 shadow-lg">
      <ProfileHeader username={user.username ?? ""} avatarImage={user.avatarImage ?? "/default-avatar.png"} />
      <ProfileStats
        postsCount={user.posts?.length ?? 0}
        followers={followers}
        following={following}
      />
      <PostPreview posts={user.posts} />
      <ProfileActions
        userId={user._id}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
      />
    </div>
  );
};

export default HoverProfileCard;
