"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { UserHeaderTab } from "./_components/UserHeaderTab";
import Highlight from "./_components/Highligth";
import PostAndSave from "./_components/PostAndSave";
import Footer from "./_components/Footer";
import { API } from "@/utils/api";
import { UserDataType } from "@/lib/types";

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode<{ id: string }>(token);
    const userId = decoded.id;
    setCurrentUserId(userId);

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API}/api/users/${userId}`);
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;

  const isOwnProfile = userData?.id === currentUserId;
  const canViewPosts =
    !userData?.isPrivate ||
    isOwnProfile ||
    userData?.followers?.some((f) => f === currentUserId);

  // if (userData?.isPrivate && userData.id !== currentUserId) {
  //   return (
  //     <div className="text-center mt-10">
  //       <p className="text-lg font-semibold">This account is private.</p>
  //       <p className="text-sm text-gray-500">Follow to see their photos.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-[935px] h-full px-[20px] pt-[30px] flex flex-col">
        <div className="flex flex-col gap-[30px]">
          <UserHeaderTab />
          <Highlight />
        </div>
        {/* {!canViewPosts ? (
          <div className="text-center mt-10">
            <p className="text-lg font-semibold">This account is private.</p>
            <p className="text-sm text-gray-500">Follow to see their photos.</p>
          </div>
        ) : ( */}
        <PostAndSave />
        {/* )} */}
        <Footer />
      </div>
    </div>
  );
}
