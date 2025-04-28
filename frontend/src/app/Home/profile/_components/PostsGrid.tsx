import { PostType } from "@/lib/types";
import { API } from "@/utils/api";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

type PostsGridProps = {
  posts: PostType[];
};



export default function PostsGrid({}: PostsGridProps) {

  const [posts, setPosts] = useState<PostType[]>([]);

  const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found!");
      return;
    }

    interface DecodedToken {
      id: string;
      email: string;
    }

    const decoded = jwtDecode<DecodedToken>(token);
    const userId = decoded.id;

  // Fetch posts from the backend when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(API+`/api/posts/user/${userId}`); // Adjust the URL to match your API
        if (response.ok) {
          const data = await response.json();
          setPosts(data); // Store posts in the state
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="grid grid-cols-3 gap-4">
      {posts.map((post) => (
        <div key={post.id} className="w-full h-60 bg-gray-200">
          <img
            src={post.image}
            alt={post.caption || "Post image"}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
