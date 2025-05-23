"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { API } from "@/utils/api";
import { UserDataType, PostType } from "@/lib/types";
import { useRouter } from "next/navigation";

import { ProfileImage } from "../../profile/_components/ProfileImage";
import ProfileHeader from "../_components/ProfileHeader";
import ProfileHighlights from "../_components/ProfileHighlights";
import ProfileTabs from "../_components/ProfileTabs";
import ProfileFooter from "../_components/ProfileFooter";
import PostsGrid from "../../profile/_components/PostsGrid";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

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

export default function ProfilePage() {

  const router = useRouter();
  const { username } = useParams();
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [user, setUser] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<{ id: string } | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [myStoryGroup, setMyStoryGroup] = useState<GroupedStory | null>(null);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<GroupedStory | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        if (typeof username === "string") {
          const userData = await fetchUser(username);
          setUser(userData);
         
          
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("User not found");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<{ id: string }>(token);

        if (decodedToken.id) {
          setUserId({ id: decodedToken.id });
          setCurrentUserId(decodedToken.id);
        } else {
          console.warn("ID not found in token");
          setUserId(null);
          setCurrentUserId(null);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (typeof username !== "string") return;
        const res = await fetch(`${API}/api/posts/user/${username}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setUserPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  }, [username]);

  const fetchUser = async (username: string) => {
    try {
      const response = await axios.get(`${API}/api/users/${username}`);
      return response.data;
    } catch (error) {
      console.error("fetchUser error:", error);
      throw error;
    }
  };

    const isOwnProfile = user?.id === userId?.id;
  const canViewPosts =
    !user?.isPrivate ||
    isOwnProfile ||
    (userId?.id && user?.followers?.includes(userId.id));

    const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Story-Instagram");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
      formData
    );
    const imageUrl = res.data.secure_url;
    setProfileImage(imageUrl);
    await axios.put(`${API}/api/users/${userId}`, {
      avatarImage: imageUrl,
    });
    toast.success("Profile photo updated!");
  } catch (err) {
    toast.error("Image upload failed.");
  }
};

const handleProfileImageClick = () => {
  if (myStoryGroup) {
    router.push(`/stories/${myStoryGroup.user._id}`);
  }
};

  useEffect(() => {
  if (user?.avatarImage) {
    setProfileImage(user.avatarImage);
  }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;
  
  // const createChatRoom = async () => {
  //   const storedData = localStorage.getItem("userInfo");
  //   let myId = null;
  //   let myUsername = "";
  
  //   if (storedData) {
  //     const parsedData = JSON.parse(storedData);
  //     myId = parsedData.userId?.id;
  //     myUsername = parsedData.username?.username;
  //   }
  
  //   if (!myId || !myUsername) {
  //    console.log('user not found');
     
  //     return;
  //   }
  
  //   const selectedUsers = [
  //     { name: user.username, id: user._id },
  //     { name: myUsername, id: myId },
  //   ];
  //   console.log("Selected Users:", selectedUsers);
  
  //   try {
  //     const checkRoomRes = await axios.post(`${API}/api/chat/checkRoom`, { selectedUsers });
  //     console.log("Check Room Response:", checkRoomRes.data);
  
  //     if (checkRoomRes.data.roomExists) {
  //       console.log("Room exists");
  //       router.push(`/Home/actualRoom/${checkRoomRes.data.roomId}`);
  //     } else {
  //       const createRoomRes = await axios.post(`${API}/api/auth/Room`, { selectedUsers });
  //       console.log("Create Room Response:", createRoomRes.data);
  
  //       if (createRoomRes.data.message === "Room created successfully") {
  //         console.log("Room created successfully");
  //         router.push(`/Home/actualRoom/${createRoomRes.data.roomId}`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error handling chat room:", error);
  //     console.log('error');
      
  //   }
  // };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-[935px] h-full px-[20px] pt-[30px] flex flex-col">
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-row gap-13">
            <ProfileImage
              src={profileImage}
              hasStory={!!myStoryGroup}
              onClick={handleProfileImageClick}
            />
            <ProfileHeader
              user={user}
              currentUserId={userId?.id || ""}
              onUserDataUpdate={(updatedUser) => setUser(updatedUser)}
            />
          </div>
          <ProfileHighlights onClick={() => setShowHighlightModal(true)} />
        </div>

        <div className="flex flex-col mt-[30px]">
          <ProfileTabs />
          <div className="mt-[20px]">
            {user?.username &&
              (user.id === userId?.id || canViewPosts ? (
                <PostsGrid username={user.username.toString()} user={user._id}/>
              ) : (
                <div className="text-center mt-10">
                  <p className="text-lg font-semibold">
                    This account is private.
                  </p>
                  <p className="text-sm text-gray-500">
                    Follow to see their photos.
                  </p>
                </div>
              ))}
          </div>
        </div>
        <ProfileFooter />
      </div>
    </div>
  );
}
