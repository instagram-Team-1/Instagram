"use client";

import { FC } from "react";

interface ProfileStatsProps {
  postsCount: number;
  followers: number;
  following: number;
}

const ProfileStats: FC<ProfileStatsProps> = ({
  postsCount,
  followers,
  following,
}) => {
  return (
    <div className="flex justify-between mt-4 text-center text-sm">
      <div>
        <p className="font-bold">{postsCount}</p>
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
  );
};

export default ProfileStats;
