"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { API } from "@/utils/api";
import { UserDataType, PostType } from "@/lib/types";
import ProfileHighlights from "../../users/_components/ProfileHighlights";
import ProfileHeader from "../../users/_components/ProfileHeader";
import ProfileImage from "../../users/_components/ProfileImage";
import ProfileTabs from "../../users/_components/ProfileTabs";
import ProfileFooter from "../../users/_components/ProfileFooter";
import PostsGrid from "../_components/PostsGrid";

import { UserHeaderTab } from "../_components/UserHeaderTab";
import Highlight from "../_components/Highligth";
import PostAndSave from "../_components/PostAndSave";
import Footer from "../_components/Footer";
export default function ProfilePage() {
  const { username } = useParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        setCurrentUserId(decoded.id);
      } catch (err) {
        console.error("Token decoding error:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API}/api/users/${username || currentUserId}`
        );
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (username || currentUserId) {
      fetchUserData();
    }
  }, [username, currentUserId]);

  if (loading) return <div>Loading...</div>;
  if (error || !userData) return <div>{error || "User not found"}</div>;

  const isOwnProfile = userData.id === currentUserId;
  const canViewPosts =
    !userData.isPrivate ||
    isOwnProfile ||
    userData.followers?.includes(currentUserId || "");

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-[935px] h-full px-[20px] pt-[30px] flex flex-col">
        {isOwnProfile ? (
          <>
            <div className="flex flex-col gap-[30px]">
              <UserHeaderTab />
              <Highlight />
            </div>
            <PostAndSave />
            <Footer />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-[30px]">
              <div className="flex flex-row">
                <ProfileImage user={userData} />
                <ProfileHeader
                  user={userData}
                  currentUserId={currentUserId || ""}
                  onUserDataUpdate={setUserData}
                />
              </div>
              <ProfileHighlights onClick={() => {}} />
            </div>

            <div className="flex flex-col mt-[30px]">
              <ProfileTabs />
              <div className="mt-[20px]">
                {canViewPosts ? (
                  <PostsGrid username={userData.username.toString()} />
                ) : (
                  <div className="text-center mt-10">
                    <p className="text-lg font-semibold">
                      This account is private.
                    </p>
                    <p className="text-sm text-gray-500">
                      Follow to see their photos.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <ProfileFooter />
          </>
        )}
      </div>
    </div>
  );
}