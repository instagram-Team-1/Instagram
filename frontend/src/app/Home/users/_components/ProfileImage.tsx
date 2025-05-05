import React from "react";
import { UserDataType } from "@/lib/types";
import { CldImage } from "next-cloudinary";
import { Camera } from "lucide-react";
import { useState } from "react"; 
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "@/utils/api";

type Props = {
  user: UserDataType;
};

export default function ProfileImage({ user }: Props) {
  const [UserId, setUserId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const DEFAULT_IMAGE = "https://i.pinimg.com/originals/0f/78/5d/0f785d55cea2a407ac8c1d0c6ef19292.jpg";
 console.log(user?.avatarImage, "user?.avatarImage");

 const updateProfileImage = async (imageUrl: string) => {
  try {
    const response = await axios.put(`${API}/api/users/Update/${UserId}`, {
      avatarImage: imageUrl,
    });

    setProfileImage(imageUrl);
    toast.success("Profile image updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Error updating profile!");
  } finally {
    setUploading(false);
  }
};

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size exceeds 5MB!");
    return;
  }

  setUploading(true);

  try {
    const UPLOAD_PRESET = "PostsInstagram";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    const imageUrl = uploadRes.data.secure_url;
    await updateProfileImage(imageUrl);
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Error uploading image!");
    setUploading(false);
  }
};
 
  return (
    <div className="w-[283.67px] h-[181px] flex items-center justify-center">
      <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden">
      <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          disabled={uploading}
        />
        {profileImage ? (
          <CldImage
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            src={profileImage}
            width={150}
            height={150}
            alt="profile"
          />
        ) : (
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src="https://i.pinimg.com/originals/0f/78/5d/0f785d55cea2a407ac8c1d0c6ef19292.jpg"
            alt="default profile"
          />
        )}
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-sm">Loading...</div>
          </div>
        ) : (
          <div className="absolute inset-0 flex justify-center items-center bg-[var(--foreground)]/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
            <Camera width={20} className="stroke-[var(--background)]" />
          </div>
        )}
      </div>
    </div>
  );
}

