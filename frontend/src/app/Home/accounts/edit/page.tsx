"use client";
import React from "react";
import { API } from "@/utils/api";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CldImage } from "next-cloudinary";
import { Camera } from "lucide-react";
import axios from "axios";

const AccountEditPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    isPrivate: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/users/${userId}`);
        const user = await res.json();
        setFormData({
          username: user.username || "",
          email: user.email || "",
          bio: user.bio || "",
          isPrivate: user.isPrivate || false,
        });
        setProfileImage(user.avatarImage || null);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form refresh
    if (!userId) return;

    try {
      const res = await fetch(`${API}/api/users/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, avatarImage: profileImage }),
      });
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 5000);
      } else {
        toast.error("Error updating profile!");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "PostsInstagram");
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setProfileImage(res.data.public_id);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-screen p-60 flex items-center justify-center">
      <div className="flex flex-col w-full">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        {/* Profile Image Section */}
        <div className="relative w-[150px] h-[150px] bg-gray-300 rounded-full overflow-hidden group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                uploadImage(file);
              }
            }}
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
              <div className="text-white text-sm">Uploading...</div>
            </div>
          ) : (
            <div className="absolute inset-0 flex justify-center items-center bg-[var(--foreground)]/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
              <Camera width={20} className="stroke-[var(--background)]" />
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className=" w-full flex flex-col space-y-6 lg:w-3/4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.username}
                  placeholder="Username"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Bio Field */}
              <div>
                <label htmlFor="bio" className="text-sm font-medium text-gray-300">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="bio"
                  className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              {/* Private Account */}
              <div className="flex items-center gap-2">
                <label htmlFor="isPrivate" className="text-sm font-medium text-gray-300">Private account</label>
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Toast Message */}
      {showSavedMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-full shadow-lg animate-fade-in-out z-50">
          Profile saved
        </div>
      )}
    </div>
  );
};

export default AccountEditPage;
