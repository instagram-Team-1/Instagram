"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ProfileActionsProps {
  userId: string;
  isFollowing: boolean;
  onFollowToggle: () => void;
}

const ProfileActions: FC<ProfileActionsProps> = ({
  userId,
  isFollowing,
  onFollowToggle,
}) => {
  const router = useRouter();

  const handleMessage = () => {
    router.push(`/messages/${userId}`);
  };

  return (
    <div className="flex justify-between gap-2 mt-4">
      <Button
        onClick={handleMessage}
        className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md"
      >
        Message
      </Button>
      <Button
        onClick={onFollowToggle}
        className="flex-1 px-2 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs rounded-md"
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export default ProfileActions;
