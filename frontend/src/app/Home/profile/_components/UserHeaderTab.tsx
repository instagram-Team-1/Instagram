"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API } from "@/utils/api";
import { StoryViewer } from "../../components/stories/_components/StoryViewer";
import { useRouter } from "next/navigation";
import { ProfileImage } from "./ProfileImage";

type User = {
  _id: string;
  username: string;
  avatarImage?: string;
  followers?: string[];
  following?: string[];
  posts?: string[];
  bio?: string;
  fullname?: string; 
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

  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [myStoryGroup, setMyStoryGroup] = useState<GroupedStory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStoryGroup, setSelectedStoryGroup] =
    useState<GroupedStory | null>(null);

  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );
  const [modalUsers, setModalUsers] = useState<
    { _id: string; username: string; avatarImage: string; fullname?: string }[]
  >([]);
  
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

      setMyStoryGroup({
        user: myStory.user,
        stories: updatedStories,
      });
    } catch {
      toast.error("Failed to fetch stories");
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
            console.log("Fetched User Data:", res.data); 
            return {
              _id: id,
              username: res.data.username,
              fullname: res.data.fullname ?? "No Name", 
              avatarImage: res.data.avatarImage ?? "/default-avatar.png", 
            };
          })
        );
        setModalUsers(users);
      } catch (err) {
        console.error("API fetch error:", err);
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
      <ProfileImage
        src={profileImage}
        hasStory={!!myStoryGroup}
        onClick={handleProfileImageClick}
      />

      {/* User Info */}
      <div className="flex flex-col ml-5 gap-6">
        <div className="flex items-center gap-4 text-[20px] font-normal">
          <span>{userData?.username || ""}</span>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/Home/accounts/edit/")}
            className="cursor-pointer"
          >
            Edit profile
          </Button>
          <Button onClick={handleArchiveButtonClick} variant="secondary" className="cursor-pointer">
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="w-[370px] p-0 px-3 dark:bg-[#282828]">
                <DialogHeader className="flex items-center py-2 border-b">
                  <DialogTitle className="text-md">{modalType === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
                </DialogHeader>
                <div className="max-h-80 overflow-y-auto">
                  {(!modalUsers.length) && <div className="p-4 text-center text-gray-500">No users found</div>}
                  {modalUsers.map((u) => (
                    <div key={u._id} className="py-2 flex items-center gap-3">
                      <img
                        src={u.avatarImage}
                        alt={u.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="dark:text-white font-semibold">{u.username}</div>
                        <div className="text-gray-400 text-sm">{u.fullname || 'No name'}</div>
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
