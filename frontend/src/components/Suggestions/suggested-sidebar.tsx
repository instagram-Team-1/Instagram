import * as Avatar from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { parseJwt } from "@/utils/JwtParse";
import { API } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

type StoriesBarProps = {
  username: { username: string } | null;
};

export function SuggestionsSidebar({ username }: StoriesBarProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalUsers, setModalUsers] = useState<
    { _id: string; username: string }[]
  >([]);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<{
    _id?: string;
    avatarImage?: string;
    followers?: string[];
    following?: string[];
    posts?: string[];
  } | null>(null);

  const router = useRouter();

  const decoded = parseJwt(token || undefined);
  const userId = decoded.id;
  const image = decoded.avatarImage;
  const fullname = decoded.fullname;

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get(API + `/api/suggested/${userId}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    fetchSuggestedUsers();
  }, [userId]);

  const handleFollow = async (targetUserId: string) => {
    if (userId === targetUserId) {
      // toast.error("Өөрийгөө дагах боломжгүй");
      return;
    }

    setLoadingUserId(targetUserId);

    try {
      const isAlreadyFollowing = userData?.following?.includes(targetUserId);
      const endpoint = isAlreadyFollowing ? "/api/unfollow" : "/api/follow";

      const response = await axios.post(
        `${API}${endpoint}`,
        {
          followerId: userId,
          followingId: targetUserId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);

      const userRes = await axios.get(`${API}/api/users/${userId}`);
      setUserData(userRes.data);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setLoadingUserId(null);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Avatar.Root className="h-11 w-11 rounded-full overflow-hidden bg-gray-800">
            <Avatar.Image
              src={image}
              alt={image}
              className="object-cover w-full h-full"
            />
          </Avatar.Root>
          <div className="flex flex-col leading-4">
            <span className="text-sm font-semibold">{username?.username}</span>
            <span className="text-xs text-[#B3B3B3]">{fullname}</span>
          </div>
        </div>
        <button
          className="text-[#0095F6] text-xs font-semibold dark:hover:text-white cursor-pointer"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold dark:text-white/70 text-black/50">Suggested for you</h2>
        <button
          className="text-xs dark:text-white font-semibold dark:hover:text-white/80 hover:text-black/70 cursor-pointer"
          onClick={() => router.push("Home/SuggestedPeople")}
        >
          See All
        </button>
      </div>
      {suggestions.slice(0, 5).map((user, i) => {
        const isAlreadyFollowing = userData?.following?.includes(user._id);

        return (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar.Root className="h-11 w-11 rounded-full overflow-hidden bg-gray-800">
                <Avatar.Image
                  src={user.image || "/avatars/default.jpg"}
                  alt={user.username}
                  className="object-cover w-full h-full"
                />
                <Avatar.Fallback className="text-white flex items-center justify-center h-full w-full text-xs uppercase">
                  {user.username.charAt(0)}
                </Avatar.Fallback>
              </Avatar.Root>
              <div
                className="flex flex-col leading-4 cursor-pointer"
                onClick={() => router.push("/Home/users/" + user.username)}
              >
                <span className="text-sm font-semibold">{user.username}</span>
                <span className="text-xs text-[#B3B3B3] max-w-[160px] truncate">
                  {user.fullname}
                </span>
              </div>
            </div>
            <button
              className={`text-xs font-semibold ${
                isAlreadyFollowing ? "dark:text-white dark:hover:text-white/70 hover:text-black/70" : "text-[#0095F6] dark:hover:text-white hover:text-black"
              } cursor-pointer disabled:opacity-50 flex items-center`}
              onClick={() => handleFollow(user._id)}
              disabled={loadingUserId === user._id || userId === user._id}
            >
              {loadingUserId === user._id ? (
                <div className="spinner-border animate-spin h-4 w-4 border-2 border-t-2 border-t-transparent border-white rounded-full"></div>
              ) : isAlreadyFollowing ? (
                "Following"
              ) : (
                "Follow"
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
