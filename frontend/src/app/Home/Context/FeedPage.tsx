"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getUserIdFromToken } from "@/utils/TokenParse";
import { API } from "@/utils/api";

interface Post {
  user: { _id: string; username: string; avatarImage: string };
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
  likes: {
    _id: string;
    username: string;
    avatarImage: string;
  }[];
  comments: {
    userId: {
      _id: string;
      username: string;
      avatarImage: string;
    };
    comment: string;
    _id: string;
  }[];
  createdAt: string;
}

interface FeedData {
  userId: string;
  username: string;
  avatarImage:string;
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
        const [userRes, postResRaw] = await Promise.all([
          axios.get(API + `/api/users/ConvertUsername/${parsedToken.id}`),
          fetch(API + `/api/users/feed/${parsedToken.id}`).then((res) =>
            res.json()
          ),
        ]);
        const posts = Array.isArray(postResRaw) ? postResRaw : [];

        const formattedPosts = posts.map((post: Post) => ({
          ...post,
          likes: Array.isArray(post.likes) ? post.likes : [],
        }));
        setData({
          userId: parsedToken.id || "",
          username: userRes.data.username,
          posts: formattedPosts,
          avatarImage: userRes.data.avatarImage
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

