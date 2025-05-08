import React from "react";
import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { UserDataType } from "@/lib/types";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API } from "@/utils/api";

interface DecodedToken {
  username: string;
  email: string;
}

interface Post {
  _id: string;
  username: string;
  caption: string;
  imageUrl: string;
  likes: any[];
  shares: number;
  comments: any[];
  createdAt: string;
}

const PostAndSave = () => {
  const [selectedTab, setSelectedTab] = useState<"posts" | "saved" | "tagged">(
      "posts"
    );

  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<UserDataType | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<UserDataType & DecodedToken>(token);

      setTokenData(decoded);
      setUsername(decoded.username);
      
    } catch (err) {
      console.error("Invalid token:", err);
      setError("Invalid token. Please log in again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!tokenData?.id) return;
  

    const fetchSavedPosts = async () => {
      try {
        setLoading(true);
        
        
        const response = await axios.get(
          `${API}/api/getSavePost/${tokenData.id}`
        );
          console.log("Saved posts:", response.data.savedPosts);
        setSavedPosts(response.data.savedPosts);
        console.log("Saved posts:", response.data.savedPosts);
      } catch (err) {
        console.error("Failed to fetch saved posts", err);
        setError("Couldn't fetch saved posts");
      } finally {
        setLoading(false);
      }
    };

    if (selectedTab === "saved") {
      fetchSavedPosts();
    }
  }, [selectedTab, tokenData]);

  

  useEffect(() => {
    if (!username) {
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/api/posts/user/${username}`);
        const fetchedPosts = response.data.posts || response.data || [];
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username]);



  return (
    <div className="flex flex-col mt-[30px]">
      <div className="flex flex-row justify-center gap-[30px] border-t border-gray-200 dark:border-gray-600">
        <button
          role="tab"
          aria-selected={selectedTab === "posts"}
          onClick={() => setSelectedTab("posts")}
          className={`text-[16px] font-medium ${
            selectedTab === "posts"
              ? "text-white border-t border-t-[var(--foreground)]"
              : "text-gray-500 hover:text-white hover:border-t border-t-transparent"
          } `}
        >
          <p className="mt-[20px]">Posts</p>
        </button>

        <button
          role="tab"
          aria-selected={selectedTab === "saved"}
          onClick={() => setSelectedTab("saved")}
          className={`text-[16px] font-medium ${
            selectedTab === "saved"
              ? "text-white border-t border-t-[var(--foreground)]"
              : "text-gray-500 hover:text-white hover:border-t border-t-transparent"
          }`}
        >
          <p className="mt-[20px]">Saved</p>
        </button>

        <button
          role="tab"
          aria-selected={selectedTab === "tagged"}
          onClick={() => setSelectedTab("tagged")}
          className={`text-[16px] font-medium ${
            selectedTab === "tagged"
              ? "text-white border-t border-t-[var(--foreground)]"
              : "text-gray-500 hover:text-white hover:border-t border-t-transparent"
          }`}
        >
          <p className="mt-[20px]">Tagged</p>
        </button>
      </div>

      <div>
        {selectedTab === "posts" && (
          <>
            {posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mt-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="relative group w-full aspect-square overflow-hidden"
                >
                  {/* Зураг */}
                  <CldImage
                    src={post.imageUrl}
                    alt={post.caption || "Post image"}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
            
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-60 transition-opacity flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1 text-white text-lg font-semibold">
                      ❤️ {post.likes?.length ?? 0}
                    </div>
                    <div className="flex items-center gap-1 text-white text-lg font-semibold">
                      💬 {post.comments?.length ?? 0}
                    </div>
            ) : (
              <div className="text-center">
                <h2 className="text-[24px] font-semibold mb-2">Share Photos</h2>
                <p className="text-gray-400">
                  When you share photos, they will appear on your profile.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <div>
        {selectedTab === "saved" && (
          <>
            {savedPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {savedPosts.map((post) => (
                  <div key={post._id} className="w-full h-auto bg-gray-200">
                    <CldImage
                      src={post.imageUrl}
                      alt={post.caption || "Saved Post"}
                      width={400}
                      height={300}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mt-14">
                <h2 className="text-[24px] font-semibold mb-2">
                  No Saved Posts
                </h2>
                <p className="text-gray-400">
                  You haven't saved any posts yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostAndSave;
