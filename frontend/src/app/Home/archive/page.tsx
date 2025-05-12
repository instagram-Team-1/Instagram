"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, History } from "lucide-react";
import { API } from "@/utils/api";
import Image from "next/image";
import { parseJwt } from "@/utils/JwtParse";
import { useRouter } from "next/navigation";

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const token = localStorage.getItem("token");
  const decode = parseJwt(token || "undefined");
  const userId = decode?.id;
  const router = useRouter();

  useEffect(() => {
    const fetchMyStories = async () => {
      try {
        const res = await axios.get(`${API}/api/story/all/${userId}`);
        setStories(res.data);
      } catch (err) {
        console.error("Миний story-г татаж чадсангүй:", err);
      }
    };

    fetchMyStories();
  }, [userId]);

  const handleBack = () => {
    router.push("/Home/profile");
  };

  return (
    <div className="w-screen flex flex-col items-center mt-6">
      <div className="w-[1125px]">
        <div onClick={handleBack} className="flex gap-3">
          <ArrowLeft />
          <div className="text-[18px]">Archive</div>
        </div>
        <div className="flex justify-center items-center gap-1 w-[1125px] h-[70px] border-b-[1px] border-gray-800 text-[12px]">
          <p className="h-[70px] border-b-[1px] border-white flex justify-center items-center gap-1">
            <History className="w-[15px] h-[15px]" />
            STORIES
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {stories.map((story: any) => (
            <div
              key={story._id}
              className="border rounded p-2  w-[300px] h-[300px]"
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

export default MyStories; // Make sure it's exported like this
