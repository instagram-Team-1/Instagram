"use client";

import { useEffect, useState } from "react";
import { StoriesBar } from "@/components/ui/stories-section";
import { PostCard } from "@/components/ui/post-card";
import { SuggestionsSidebar } from "@/components/ui/suggested-sidebar";
import { API } from "@/utils/api";
import { getUserIdFromToken } from "@/utils/TokenParse";

// Постын төрөл тодорхойлох
type Post = {
  imageUrl: string;
  _id: string;
  image: string;
  caption: string;
  userId: {
    _id: string;
    username: string;
    avatarImage: string;
  };
  likes: number | string; // Ensure likes is a number or string that represents a number
  comments: string[];
  createdAt: string;
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setId] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    console.log("Token:", token);
    console.log("Parsed User ID:", userId);

    if (userId) {
      setId({ id: userId });
    } else {
      console.warn("User ID not found in token");
      setId(null);
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId?.id) {
        console.warn("Cannot fetch posts: userId is null");
        return;
      }

      try {
        const res = await fetch(API + `/api/users/feed/${userId.id}`);

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched posts:", data);

        // If likes are an array, convert them to a number
        const processedPosts = data.map((post: Post) => ({
          ...post,
          likes: Array.isArray(post.likes) ? post.likes.length : post.likes,
        }));

        setPosts(processedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, [userId]);
  localStorage.setItem('id', JSON.stringify(userId));

  return (
    <div className="flex justify-center bg-white dark:bg-black w-screen min-h-screen px-4 lg:px-8">
      <div className="w-full max-w-[630px]">
        <StoriesBar />
        {posts.map((post) => (
          <PostCard
            key={post._id}
            imageUrl={post.imageUrl}
            caption={post.caption || "No caption provided"}
            userId={post.userId}
            likes={
              typeof post.likes === "string"
                ? parseInt(post.likes, 10)
                : post.likes || 0
            }
            comments={post.comments || []}
            postId={post._id}
            currentUserId={userId?.id || ""} 
          />
        ))}
      </div>

      <div className="hidden lg:block w-[320px] pl-10 pt-8">
        <div className="sticky top-20">
          <SuggestionsSidebar />
        </div>
      </div>
    </div>
  );
}
