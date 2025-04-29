"use client";

import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { CldImage } from "next-cloudinary";

const UserHeaderTab = () => {
  const [tokenData, setTokenData] = useState<{ username?: string } | null>(
    null
  );

  const [username, setUsername] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<{
          id: string;
          email: string;
          username: string;
        }>(token);

        if (decodedToken.username) {
          setTokenData({ username: decodedToken.username });
          fetchProfileImage(decodedToken.username); // ☑️ username явуулж байна
        } else {
          console.warn("Username not found in token");
          setTokenData(null);
        }

        if (decodedToken.username) {
          setUsername(decodedToken.username);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Токены алдаа гарлаа!");
      }
    }
  }, []);

  useEffect(() => {}, [tokenData]);

  const fetchProfileImage = async (username: string) => {
    try {
      const response = await axios.get(`${API}/api/users/${username}`);
      setProfileImage(response.data.avatarImage);
    } catch (error) {
      console.error("Failed to fetch profile image:", error);
    }
  };

  const updateProfileImage = async (imageUrl: string) => {
    if (!username) {
      toast.error("Хэрэглэгчийн ID олдсонгүй!");
      return;
    }
    try {
      await axios.put(`${API}/api/users/Update/${username}`, {
        avatarImage: imageUrl,
      });
      setProfileImage(imageUrl);
      toast.success("Профайл зураг амжилттай шинэчлэгдлээ!");
    } catch (error) {
      console.error("Профайл шинэчлэхэд алдаа:", error);
      toast.error("Профайл шинэчлэхэд алдаа гарлаа!");
    } finally {
      setUploading(false);
    }
  };

  // Файл сонгох -> Upload хийх
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Зургийн хэмжээ 5MB-ээс их байна!");
      return;
    }

    setUploading(true);

    try {
      // Cloudinary upload (эсвэл өөр API)

      const UPLOAD_PRESET = "PostsInstagram";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET); // Cloudinary upload preset

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      const imageUrl = uploadRes.data.secure_url;
      await updateProfileImage(imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Зураг upload хийхэд алдаа гарлаа!");
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-row">
      {/* Profile image */}
      <div className="w-[283.67px] h-[181px] flex justify-center items-center">
        <div className="relative w-[150px] h-[150px] bg-gray-300 rounded-full overflow-hidden group">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            disabled={uploading}
          />
          <CldImage
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            src={profileImage || "default_profile_image.jpg"}
            width={150}
            height={150}
            quality={100}
            loading="lazy"
            style={{
              backgroundImage: `url(${profileImage ||
                "https://i.pinimg.com/originals/0f/78/5d/0f785d55cea2a407ac8c1d0c6ef19292.jpg"})`,
            }} alt={""}           />
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-sm">Хуулж байна...</div>
              </div>
            ) : (
              <div className="absolute inset-0 flex justify-center items-center bg-[var(--foreground)]/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                <Camera width={20} className="stroke-[var(--background)]" />
              </div>
            )}
          
        </div>
      </div>

      {/* User Info */}
      <div className="flex flex-col ml-5 gap-6">
        <div className="text-[20px] font-normal flex items-center gap-4">
          <div>{tokenData?.username || "No user data found"}</div>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/accounts/edit/")}
          >
            Edit profile
          </Button>
          <Button variant="secondary">View archive</Button>
        </div>
        <div className="text-[16px] text-gray-400 flex gap-8">
          <div>0 posts</div>
          <div>0 followers</div>
          <div>0 following</div>
        </div>
        <div className="text-[16px] text-gray-500">Bio goes here</div>
      </div>
    </div>
  );
};

export default UserHeaderTab;
