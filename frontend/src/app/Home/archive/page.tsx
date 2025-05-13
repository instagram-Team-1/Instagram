"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, History } from "lucide-react";
import { API } from "@/utils/api";
import Image from "next/image";
import { parseJwt } from "@/utils/JwtParse";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true); // 🟡 Added loading state
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const decode = parseJwt(token || "undefined");
  const userId = decode?.id;
  const router = useRouter();

  useEffect(() => {
    const fetchMyStories = async () => {
      try {
        setLoading(true); // 🟡 Start loading
        const res = await axios.get(`${API}/api/story/all/${userId}`);
        setStories(res.data);
      } catch (err) {
        console.error("Миний story-г татаж чадсангүй:", err);
      } finally {
        setLoading(false); // 🟢 Stop loading
      }
    };

    if (userId) {
      fetchMyStories();
    }
  }, [userId]);

  const handleBack = () => {
    router.push("/Home/profile");
  };

  const SkeletonArchive = () => (
    <div className="  p-2 w-[310px] h-[310px]">
      <Skeleton className="w-full h-full rounded-md" />
    </div>
  );

  return (
    <div className="w-screen flex flex-col items-center mt-6">
      <div className="w-[1125px]">
        <div onClick={handleBack} className="flex gap-3 cursor-pointer">
          <ArrowLeft />
          <div className="text-[18px]">Archive</div>
        </div>
        <div className="flex justify-center items-center gap-1 w-[1125px] h-[70px] border-b border-gray-800 text-[12px]">
          <p className="h-[70px] border-b border-white flex justify-center items-center gap-1">
            <History className="w-[15px] h-[15px]" />
            STORIES
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {loading
            ? [...Array(6)].map((_, index) => <SkeletonArchive key={index} />)
            : stories.map((story: any) => (
                <div
                  key={story._id}
                  className=" p-2 w-[300px] h-[300px]"
                >
                  <Image
                    src={story.imageUrl}
                    alt="archive"
                    width={300}
                    height={300}
                    className="w-[300px] h-[300px] object-cover"
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default MyStories;
