"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { UserHeaderTab } from "./_components/UserHeaderTab";
import Highlight from "./_components/Highligth";
import PostAndSave from "./_components/PostAndSave";
import Footer from "./_components/Footer";
import { API } from "@/utils/api";
import { UserDataType } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="flex items-center justify-center w-full h-screen overflow-x-hidden">
      <div className="w-[935px] h-full px-[20px] pt-[30px] flex flex-col">
        <div className="flex flex-col gap-[30px]">
          {loading ? (
            <>
              {/* Avatar and username skeleton */}
              <div className="flex items-center gap-6">
                <Skeleton className="w-[100px] h-[100px] rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-[150px] h-6 rounded" />
                  <Skeleton className="w-[100px] h-4 rounded" />
                </div>
              </div>

              {/* Highlight skeleton */}
              <div className="flex gap-4 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-[80px] h-[80px] rounded-full"
                  />
                ))}
              </div>

              {/* Posts grid skeleton */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="w-full h-[300px] rounded-md" />
                ))}
              </div>
            </>
          ) : (
            <>
              <UserHeaderTab />

              <div className="flex justify-start">
                <Highlight />
              </div>
              <PostAndSave />
              <Footer />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
