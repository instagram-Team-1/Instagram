import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API } from "@/utils/api";

interface DecodedToken {
  id: string;
  email: string;
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

export default function PostsGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Токеныг шалгах
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("Decoded Token:", decoded); // Декодлогдсон токеныг шалгах
      setUserId(decoded.id);
    } catch (err) {
      console.error("Invalid token:", err);
      setError("Invalid token. Please log in again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      console.log("No userId, skipping fetch");
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/api/posts/user/${userId}`);
        console.log("API Response:", response.data); // API хариуг шалгах
        setPosts(response.data.posts || response.data); // Зөв өгөгдлийг авах
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (loading) {
    return (
      <p className="col-span-3 text-center text-gray-500">Ачааллаж байна...</p>
    );
  }

  if (error) {
    return <p className="col-span-3 text-center text-red-500">{error}</p>;
  }

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
                {/* Image URL-г шалгахын тулд console-д хэвлэх */}
                {console.log("Rendering Image URL:", post.imageUrl)}
              </>
            ) : (
              <p className="text-center text-gray-500">Зураг байхгүй</p>
            )}
          </div>
        ))
      ) : (
        <p className="col-span-3 text-center text-gray-500">
          Яг одоо пост алга...
        </p>
      )}
    </div>
  );
}
