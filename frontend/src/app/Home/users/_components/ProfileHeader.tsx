import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { UserDataType } from "@/lib/types";
import { API } from "@/utils/api";

type Props = {
  user: UserDataType;
  currentUserId: string;
};

export default function ProfileHeader({ user, currentUserId }: Props) {
  const [isFollowing, setIsFollowing] = useState<boolean>(
    user.followers?.includes(currentUserId) || false
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const endpoint = isFollowing ? "/api/unfollow" : "/api/follow";
      const response = await axios.post(API+endpoint, {
        followerId: currentUserId,
        followingId: user._id,
      });
      toast.success(response.data.message);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error details:", (error as any).response?.data);
      toast.error("Follow үйлдэлд алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col ml-[20px] gap-[30px]">
      <div className="text-[20px] font-normal flex flex-row items-center gap-[8px]">
        <div>{user.username}</div>
        <Button
          className="bg-blue-400 text-white hover:bg-blue-500"
          onClick={handleFollow}
          disabled={isLoading}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Button variant="secondary" className="hover:bg-gray-200">
          Message
        </Button>
      </div>
      <div className="text-[16px] text-gray-400 flex flex-row gap-[30px]">
        <div>{user.posts?.length || 0} posts</div>
        <div>{user.followers?.length || 0} followers</div>
        <div>{user.following?.length || 0} following</div>
      </div>
      <div className="text-[16px] text-gray-500">
        {user.bio || "No bio yet"}
      </div>
    </div>
  );
}
