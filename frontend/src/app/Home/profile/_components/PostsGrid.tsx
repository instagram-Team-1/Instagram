import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API } from "@/utils/api";

interface PostsGridProps {
  username: string;
}

interface Post {
  _id: string;
  userId: string;
  caption: string;
  imageUrl: string;
  likes: any[];
  shares: number;
  comments: any[];
  createdAt: string;
}

export default function PostsGrid({ username }: PostsGridProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/api/posts/user/${username}`);
        setPosts(response.data.posts || response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPosts();
    }
  }, [username]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="w-full h-80 bg-gray-200 overflow-hidden rounded-lg"
          >
            {post.imageUrl ? (
              <>
                <CldImage
                  src={post.imageUrl}
                  alt={post.caption || "Post image"}
                  className="w-full h-full object-cover"
                  width={400}
                  height={400}
                />
                {console.log("Rendering Image URL:", post.imageUrl)}
              </>
            ) : (
              <h2 className="text-[24px] font-semibold mb-2">
                No post yet
              </h2>
            )}
          </div>
        ))
      ) : (
        <h2 className="text-[24px] font-semibold mb-2">
          No post yet
        </h2>
      )}
    </div>
  );
}
