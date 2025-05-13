"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { API } from "@/utils/api";
import { UserDataType, PostType } from "@/lib/types";
import { jwtDecode } from "jwt-decode";

import ProfileImage from "../_components/ProfileImage";
import ProfileHeader from "../_components/ProfileHeader";
import ProfileHighlights from "../_components/ProfileHighlights";
import ProfileTabs from "../_components/ProfileTabs";
import ProfileFooter from "../_components/ProfileFooter";
import PostsGrid from "../../profile/_components/PostsGrid";

export default function ProfilePage() {
  const { username } = useParams();
  const router = useRouter();

  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [user, setUser] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<{ id: string } | null>(null);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  const isOwnProfile = user?.id === userId?.id;
  const canViewPosts =
    !user?.isPrivate ||
    isOwnProfile ||
    (userId?.id && user?.followers?.includes(userId.id));

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-[935px] h-full px-[20px] pt-[30px] flex flex-col">
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-row">
            <ProfileImage
              user={user}
              currentUserId={userId?.id || ""}
              storyGroup={user.storyGroup || null}
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
                <PostsGrid username={user.username.toString()} />
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
