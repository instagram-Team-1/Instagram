"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import { CldImage } from "next-cloudinary";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API } from "@/utils/api";
import { StoryViewer } from "../../components/stories/_components/StoryViewer";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  username: string;
  avatarImage?: string;
  followers?: string[];
  following?: string[];
  posts?: string[];
  bio?: string;
};


type StoryItem = {
  _id: string;
  imageUrl: string;
  createdAt?: string;
  expiresAt?: string;
  viewed?: boolean;
};

type GroupedStory = {
  user: {
    _id: string;
    username: string;
    avatarImage: string;
  };
  stories: StoryItem[];
};

export const UserHeaderTab = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [myStoryGroup, setMyStoryGroup] = useState<GroupedStory | null>(null);
  const [selectedStoryGroup, setSelectedStoryGroup] =
    useState<GroupedStory | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );
  const [modalUsers, setModalUsers] = useState<
    { _id: string; username: string }[]
  >([]);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        if (decoded.id) {
          setUserId(decoded.id);
          fetchUserData(decoded.id);
          fetchMyStory(decoded.id);
        }
      } catch {
        toast.error("Failed to decode token");
      }
    }
  }, []);

  // Fetch user
  const fetchUserData = async (id: string) => {
    try {
      const res = await axios.get(`${API}/api/users/${id}`);
      setUserData(res.data);
      setProfileImage(res.data.avatarImage);
    } catch {
      toast.error("Failed to fetch user data");
    }
  };

  // Fetch my stories
  const fetchMyStory = async (id: string) => {
    try {
      const res = await axios.get(`${API}/api/Getstory/${id}`);
      const storiesData = res.data;
      const myStory = storiesData.find((group: any) => group.user._id === id);
      if (!myStory) return;

      const storyIds = myStory.stories.map((s: any) => s._id);
      const viewRes = await axios.post(`${API}/api/storyHasView`, {
        userId: id,
        storyIds,
      });
      const viewedStoryIds: string[] = viewRes.data.viewedStoryIds;

      const updatedStories = myStory.stories.map((story: any) => ({
        ...story,
        viewed: viewedStoryIds.includes(story._id),
      }));

      setMyStoryGroup({ ...myStory, stories: updatedStories });
    } catch {
      console.error("Failed to fetch story");
    }
  };

  // Fetch followers/following for modal
  useEffect(() => {
    const fetchModalUsers = async () => {
      if (!userData || !modalType) return;
      const ids =
        modalType === "followers" ? userData.followers : userData.following;
      if (!ids) return;
      try {
        const users = await Promise.all(
          ids.map(async (id) => {
            const res = await axios.get(`${API}/api/users/${id}`);
            return { _id: id, username: res.data.username };
          })
        );
        setModalUsers(users);
      } catch {
        toast.error("Error fetching users data!");
      }
    };
    if (isModalOpen) fetchModalUsers();
  }, [isModalOpen, modalType, userData]);

  const handleProfileImageClick = () => {
    if (myStoryGroup) {
      setSelectedStoryGroup(myStoryGroup);
    }
  };

  const handleArchiveButtonClick = () => {
    router.push("/Home/archive");
  };

  return (
    <div className="flex flex-row gap-14">
      {/* Profile Image */}
      <div
        className={`relative w-[150px] h-[150px] bg-gray-300 rounded-full overflow-hidden group cursor-pointer ${
          myStoryGroup ? "border-4 border-pink-500" : "border-4 border-gray-300"
        }`}
        onClick={handleProfileImageClick}
      >
        {profileImage ? (
          <CldImage
            src={profileImage}
            width={150}
            height={150}
            alt="profile"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src="https://i.pinimg.com/originals/0f/78/5d/0f785d55cea2a407ac8c1d0c6ef19292.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            alt="default"
          />
        )}
      </div>

      {/* User Info */}
      <div className="flex flex-col ml-5 gap-6">
        <div className="flex items-center gap-4 text-[20px] font-normal">
          <span>{userData?.username || "Unknown"}</span>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/Home/accounts/edit/")}
          >
            Edit profile
          </Button>
          <Button onClick={handleArchiveButtonClick} variant="secondary">
            View archive
          </Button>
        </div>

        <div className="text-[16px] text-gray-400 flex gap-8">
          <div>{userData?.posts?.length || 0} posts</div>
          <div
            className="cursor-pointer"
            onClick={() => {
              setModalType("followers");
              setIsModalOpen(true);
            }}
          >
            {userData?.followers?.length || 0} followers
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              setModalType("following");
              setIsModalOpen(true);
            }}
          >
            {userData?.following?.length || 0} following
          </div>
        </div>

        <div className="text-[16px] text-gray-500">{userData?.bio}</div>
      </div>

      {/* Followers / Following Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {modalType === "followers" ? "Followers" : "Following"}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            {(modalType === "followers"
              ? userData?.followers
              : userData?.following
            )?.map((uid) => (
              <div key={uid} className="py-2 border-b">
                {modalUsers
                  .filter((u) => u._id === uid)
                  .map((u) => (
                    <div key={u._id}>@{u.username}</div>
                  ))}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Story Viewer */}
      {selectedStoryGroup && (
        <StoryViewer
          storyGroup={selectedStoryGroup}
          stories={[selectedStoryGroup]}
          setSelectedStoryGroup={setSelectedStoryGroup}
          userId={userId || ""}
        />
      )}
    </div>
  );
};
