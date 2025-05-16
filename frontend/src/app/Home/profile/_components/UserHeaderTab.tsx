"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API } from "@/utils/api";
import { StoryViewer } from "./Storyviewo";

type User = {
  _id: string;
  username: string;
  avatarImage?: string;
  followers?: string[];
  following?: string[];
  posts?: string[];
  bio?: string;
  fullname: string;
  postCount?: number;
};


type StoryItem = {
  _id: string;
  imageUrl: string;
  createdAt?: string;
  expiresAt?: string;
  viewed?: boolean;
};

export type GroupedStory = {
  _id?: string;
  user: { _id: string; username: string; avatarImage: string };
  stories: { _id: string; imageUrl: string; createdAt?: string }[];
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
    {
      _id: string;
      username: string;
      avatarImage?: string;
      fullname?: string;
    }[]
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
      console.log(res.data ,  "ooon");
      
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
            return { _id: id, username: res.data.username, fullname: res.data.fullname, avatarImage: res.data.avatarImage };
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
<div
  className={`relative w-[150px] h-[150px] bg-gray-300 rounded-full overflow-hidden group cursor-pointer ${
    myStoryGroup
      ? "border-4 border-pink-500 via-red-500 to-yellow-500"
      : "border-4 border-gray-300"
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
    <Skeleton className="w-full h-full rounded-full" />
  )}
</div>


      {/* User Info */}
      <div className="flex flex-col ml-5 gap-6">
       <div className="flex items-center gap-4 text-[20px] font-normal">
        {userData?.username ? (
          <span>{userData.username}</span>
        ) : (
          <Skeleton className="h-6 w-[100px]" />
        )}
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
          <div>{userData?.postCount || 0} posts</div>
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
        <DialogContent className="w-[370px] p-0 px-3 dark:bg-[#282828]">
          <DialogHeader className="flex items-center py-2 border-b">
            <DialogTitle className="text-md">
              {modalType === "followers" ? "Followers" : "Following"}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto">
            {!modalUsers.length && (
              <div className="p-4 text-center text-gray-500">
                No users found
              </div>
            )}
            {modalUsers.map((u) => (
              <div key={u._id} 
              className="py-2 flex items-center gap-3" 
              onClick={() => router.push("/Home/users/" + u.username)}
              >
                <img
                  src={u.avatarImage}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover"
                  onClick={() => router.push("/Home/users/" + u.username)}
                />
                <div onClick={() => router.push("/Home/users/" + u.username)}>
                  <div className="dark:text-white font-semibold">
                    {u.username}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {u.fullname || "No name"}
                  </div>
                </div>
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
