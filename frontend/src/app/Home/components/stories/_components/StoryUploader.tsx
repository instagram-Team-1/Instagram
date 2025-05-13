"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { API } from "@/utils/api";

type Props = {
  userId: string;
  username: string;
  onUploadSuccess: () => void;
};

export const StoryUploader = ({ userId, username, onUploadSuccess }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Story-Instagram");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const imageUrl = await handleImageUpload(file);
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${API}/api/story/${userId}`, { imageUrl });
      onUploadSuccess(); // refresh stories
    } catch (error) {
      console.error("Failed to create story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-w-[70px]">
      <div className="relative">
        <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500">
          <Avatar className="border-2 border-black w-14 h-14">
            <AvatarImage />
            <AvatarFallback>{username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <label className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
          ) : (
            "+"
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      <span className="text-xs text-white mt-2 text-center w-16 truncate">
        {username || "Username"}
      </span>
    </div>
  );
};
