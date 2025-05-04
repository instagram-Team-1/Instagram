

"use client";

import StoryBoard from "@/components/ui/stories/story-board";
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
  comments: {
    userId: string;
    comment: string;
    createdAt: string;
    _id: string;
  }[];
  createdAt: string;
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setId] = useState<{ id: string } | null>(null);
  const [username, setusername] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parsedToken = getUserIdFromToken(token);

    if (parsedToken?.id) {
      setId({ id: parsedToken.id });
    } else {
      setId(null);
    }
    if (parsedToken?.username) {
      setusername({ username: parsedToken.username });
    } else {
      setusername(null);
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

  return (
    <div className="flex justify-center bg-white dark:bg-black w-screen min-h-screen px-4 lg:px-8">
      <div className="w-full max-w-[630px]">
        <StoryBoard />
        {posts.map((post) => (
          <PostCard
            key={post._id}
            imageUrl={post.imageUrl}
            caption={
              typeof post.caption === "string"
                ? post.caption
                : "No caption provided"
            }
            userId={post.userId}
            likes={
              typeof post.likes === "string"
                ? parseInt(post.likes, 10)
                : post.likes || 0
            }
            comments={post.comments || []}
            postId={post._id}
            currentUserId={userId?.id || ""}
            currentUserUsername={username?.username || ""}
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
