"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchUser } from "@/lib/api";
import { UserDataType } from "@/lib/types";
import { PostType } from "@/lib/types";
import { API } from "@/utils/api";
import axios from "axios";

import ProfileImage from "../_components/ProfileImage";
import ProfileHeader from "../_components/ProfileHeader";
import ProfileHighlights from "../_components/ProfileHighlights";
import ProfileTabs from "../_components/ProfileTabs";
import ProfileFooter from "../_components/ProfileFooter";
import PostsGrid from "../../profile/_components/PostsGrid";

export default function ProfilePage() {
  const {username} = useParams()
  const [userPosts, setUserPosts] = useState<PostType[]>([]);


  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [user, setUser] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const getUser = async () => {
      try {
        if (typeof username === "string") {
          const userData = await fetchUser(username);
          setUser(userData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
    
  }, [username]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (typeof username !== "string") return;
        const res = await fetch(`/api/posts/user/username/${username}`);
        const data = await res.json();
        setUserPosts(data.posts);
      } catch (error) {
        console.error("Failed to fetch user posts", error);
      }
    };
  
    fetchUserPosts();
  }, [username]);

  const fetchUser = async (username: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/api/users/${username}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      return response.data;
    } catch (error) {
      console.error("fetchUser error:", error);
      throw error;
    }
  };

  console.log("User data:", user);
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-[935px] h-full px-[20px] pt-[30px] flex flex-col">
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-row">
            <ProfileImage user={user}/>
            <ProfileHeader user={user} />
          </div>
          <ProfileHighlights onClick={() => setShowHighlightModal(true)} />
        </div>

        <div className="flex flex-col mt-[30px]">
          <ProfileTabs />
          <div className="mt-[20px]">
          <PostsGrid username={user.username.toString()} />
          </div>
        </div>

        <ProfileFooter />
      </div>
    </div>
  );
}
