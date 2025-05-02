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

      <div className="mt-[20px] flex flex-col items-center justify-center min-h-[300px]">
        {selectedTab === "posts" && (
          <>
            {posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {posts.map((post) => {
                  return (
                    <div key={post._id} className="w-full h-auto bg-gray-200">
                      <CldImage
                        src={post.imageUrl}
                        alt={post.caption || "Post image"}
                        className=""
                        width={400}
                        height={300}
                       
                      />
                    </div>
                  );
                })}
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
        {selectedTab !== "posts" && (
          <div className="text-center text-gray-400">
            Feature not available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default PostAndSave;
