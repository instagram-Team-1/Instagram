// context/FeedContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getUserIdFromToken } from "@/utils/TokenParse";
import { API } from "@/utils/api";

interface Post {
  imageUrl: string;
  _id: string;
  image: string;
  caption: string;
  userId: {
    _id: string;
    username: string;
    avatarImage: string;
    posts: never[];
    followers: number;
    following: number;
  };
  likes: number;
  comments: {
    userId: string;
    comment: string;
    createdAt: string;
    _id: string;
  }[];
  createdAt: string;
}

interface FeedData {
  userId: string;
  username: string;
  posts: Post[];
}

const FeedContext = createContext<FeedData | null>(null);

export const FeedProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<FeedData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parsedToken = getUserIdFromToken(token);

    if (!parsedToken?.id) return;

    const fetchData = async () => {
      try {
        const [userRes, postRes] = await Promise.all([
          axios.get(API + `/api/users/ConvertUsername/${parsedToken.id}`),
          fetch(API + `/api/users/feed/${parsedToken.id}`).then((res) =>
            res.json()
          ),
        ]);

        const posts = postRes.map((post: Post) => ({
          ...post,
          likes: Array.isArray(post.likes) ? post.likes.length : post.likes,
        }));

        setData({
          userId: parsedToken.id || "",
          username: userRes.data.username,
          posts,
        });
      } catch (error) {
        console.error("Failed to load feed data", error);
      }
    };

    fetchData();
  }, []);

  return <FeedContext.Provider value={data}>{children}</FeedContext.Provider>;
};

export const useFeed = () => useContext(FeedContext);

