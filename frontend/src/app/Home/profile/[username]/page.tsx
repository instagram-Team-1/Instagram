"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Camera } from "lucide-react";
import React from "react";
import { useState, useEffect } from "react";
import PostsGrid from "../_components/PostsGrid";
import { jwtDecode } from 'jwt-decode'; 
import { UserDataType } from "@/lib/types";
import { PostType } from "@/lib/types";
import axios from "axios";


export default function ProfilePage() {

  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<UserDataType  | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [selectedTab, setSelectedTab] = useState<"posts" | "saved" | "tagged">("posts");


  // console.log("tokenData", tokenData);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<UserDataType>(token);
        setTokenData(decoded);
        console.log(decoded);
        
      } catch (err) {
        console.error('Invalid token:', err);
      }
    } else {
      console.warn('No token found in localStorage');
    }
  }, []);
  
  useEffect(() => {
    setLoading(true);
  }, []);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const UPLOAD_PRESET = "PostsInstagram";

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploading(true);
      const response = await axios.post(CLOUDINARY_URL, formData);
      const url = response.data.secure_url;
      setUploadedImageUrl(url);
      console.log("Амжилттай upload хийлээ:", url);
    } catch (error) {
      console.error("Upload алдаа:", error);
    } finally {
      setUploading(false);
    }
  };

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      uploadImageToCloudinary(file);
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!tokenData?.id) return;
      try {
        const res = await fetch(`/api/posts/user/${tokenData.id}`);
        const data = await res.json();
        setUserPosts(data.posts); 
      } catch (error) {
        console.error('Failed to fetch user posts', error);
      }
    };
  
    fetchUserPosts();
  }, [tokenData]);

    
  // return (
  //   <div>
  //     {tokenData?.id ? `User ID: ${tokenData.id}` : 'No user data found'}
  //     {tokenData?.username ? `User name: ${tokenData.username}` : 'No user data found'}
  //     {tokenData?.email ?  `User email: ${tokenData.email}` : 'No user data found'}
  //   </div>
  // );



  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-[935px] h-full px-[20px] pt-[30px] flex flex-col">
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-row">
            {/* profile image */}
            <div className="w-[283.67px] h-[181px] ">
              <div className="relative w-[150px] h-[150px] bg-gray-300 box-border rounded-full overflow-hidden group bg-cover bg-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${profileImage || "https://i.pinimg.com/originals/0f/78/5d/0f785d55cea2a407ac8c1d0c6ef19292.jpg"})`,
                  }}
                >
                  <div className="absolute inset-0 flex justify-center items-center bg-[var(--foreground)]/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                    <Camera width={20} className="stroke-[var(--background)]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-[20px] gap-[30px]">
              <div className="text-[20px] font-normal flex flex-row items-center gap-[8px]">
                <div className="mr-4">{tokenData?.username ? `${tokenData.username}` : 'No user data found'}</div>
                <Button
                  variant="secondary"
                  onClick={() => (window.location.href = "/accounts/edit/")}
                >
                  Edit profile
                </Button>
                <Button variant="secondary">View archive</Button>
              </div>
              <div className="text-[16px] text-gray-400 flex flex-row gap-[30px]">
                <div>0 posts</div>
                <div>0 followers</div>
                <div>0 following</div>
              </div>
              <div className="text-[16px] text-gray-500">Bio goes here</div>
            </div>
          </div>

          {/* highlights section */}
          <div className="w-full">
            <div
              role="tab"
              className="w-[89px] flex flex-col items-center cursor-pointer"

              onClick={() => setShowHighlightModal(true)}

            >
              <div className="w-[89px] h-[89px] rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                <div className="w-[77px] h-[77px] rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <Plus className="w-16"/>
                </div>
              </div>
              <div>New</div>
            </div>

            {showHighlightModal && (
              <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
                <div className="bg-gray-700 p-6 rounded-xl shadow-lg w-[300px]">
                  <h2 className="text-lg font-semibold mb-4">New Highlight</h2>
                  <Input
                    type="text"
                    placeholder="Highlight name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="text-gray-600 hover:text-black"
                      onClick={() => setShowHighlightModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        // Highlight creation logic here
                        setShowHighlightModal(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}


          </div>
        </div>

        <div className="flex flex-col mt-[30px]">
          <div className="flex flex-row justify-center gap-[30px] border-t border-gray-200 dark:border-gray-600">
            <button
              role="tab"
              aria-selected={selectedTab === "posts"}
              onClick={() => setSelectedTab("posts")}
              className={`text-[16px] font-medium ${
                selectedTab === "posts" ? "text-white border-t border-t-[var(--foreground)]" : "text-gray-500 hover:text-white hover:border-t border-t-transparent"
              } `}
            >
              <p className="mt-[20px]">Posts</p>
            </button>
            <button
              role="tab"
              aria-selected={selectedTab === "saved"}
              onClick={() => setSelectedTab("saved")}
              className={`text-[16px] font-medium ${
                selectedTab === "saved" ? "text-white border-t border-t-[var(--foreground)]" : "text-gray-500 hover:text-white hover:border-t border-t-transparent"
              }`}
            >
              <p className="mt-[20px]">Saved</p>
            </button>
            <button
              role="tab"
              aria-selected={selectedTab === "tagged"}
              onClick={() => setSelectedTab("tagged")}
              className={`text-[16px] font-medium ${
                selectedTab === "tagged" ? "text-white border-t border-t-[var(--foreground)]" : "text-gray-500 hover:text-white hover:border-t border-t-transparent"
              }`}
            >
              <p className="mt-[20px]">Tagged</p>
            </button>
          </div>

          <div className="mt-[20px] flex flex-col items-center justify-center min-h-[300px]">
            {selectedTab === "posts" && (
              <>
                {userPosts.length > 0 ? (
                  <PostsGrid posts={userPosts} />
                ) : (
                  <div className="text-center">
                    <h2 className="text-[24px] font-semibold mb-2">Share Photos</h2>
                    <p className="text-gray-400">When you share photos, they will appear on your profile.</p>
                  </div>
                )}
              </>
            )}
            {selectedTab !== "posts" && (
              <div className="text-center text-gray-400">
                Feature not available yet.
              </div>
            )}
          </div>
        </div>


        <footer className="w-full mt-auto py-[20px] border-gray-300 text-center text-gray-500 text-[14px]">
          <div className="w-full flex justify-center gap-[15px] mt-[10px]">
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              Blog
            </a>
            <a href="#" className="hover:underline">
              Help
            </a>
            <a href="#" className="hover:underline">
              Locations
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
          <p>
            &copy; {new Date().getFullYear()} Instagram Clone
          </p>
        </footer>
      </div>
    </div>
  );
}
