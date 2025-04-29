"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { API } from "@/utils/api";
import { UserDataType, PostType } from "@/lib/types";

import ProfileImage from "../_components/ProfileImage";
import ProfileHeader from "../_components/ProfileHeader";
import ProfileHighlights from "../_components/ProfileHighlights";
import ProfileTabs from "../_components/ProfileTabs";
import ProfileFooter from "../_components/ProfileFooter";
import PostsGrid from "../../profile/_components/PostsGrid";
import { jwtDecode } from "jwt-decode";

export default function ProfilePage() {
  const { username } = useParams(); 
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [user, setUser] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Хэрэглэгчийн мэдээлэл авах
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        if (typeof username === "string") {
          const userData = await fetchUser(username);
          setUser(userData);
          
        }
      } catch (error) {
        console.error("Хэрэглэгч авахад алдаа гарлаа:", error);
        setError("Хэрэглэгчийн мэдээлэл авахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username]);

  const [userId, setId] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<{
          id: string;
        }>(token);

        if (decodedToken.id) {
          setId({ id: decodedToken.id });
        } else {
          console.warn("id not found in token");
          setId(null);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {}, [userId]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (typeof username !== "string") return;
        const res = await fetch(`${API}/api/posts/user/${username}`);
        if (!res.ok) throw new Error("Пост авахад алдаа гарлаа");
        const data = await res.json();
        setUserPosts(data.posts || []);
      } catch (error) {
        console.error("Хэрэглэгчийн пост авахад алдаа гарлаа:", error);
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

  if (loading) return <div>Ачааллаж байна...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Хэрэглэгч олдсонгүй</div>;

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-[935px] h-full px-[20px] pt-[30px] flex flex-col">
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-row">
            <ProfileImage user={user} />
            <ProfileHeader user={user} currentUserId={userId?.id || ""} />
          </div>
          <ProfileHighlights onClick={() => setShowHighlightModal(true)} />
        </div>

        <div className="flex flex-col mt-[30px]">
          <ProfileTabs />
          <div className="mt-[20px]">
            {user?.username && (
              <PostsGrid username={user.username.toString()} />
            )}
          </div>
        </div>
        <ProfileFooter />
      </div>
    </div>
  );
}
