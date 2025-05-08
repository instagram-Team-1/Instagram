import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API } from "@/utils/api";
import { CommentModal } from "../../users/_components/CommentModal";

interface PostsGridProps {
  username: string;
}

interface Comment {
  comment: string;
  user: {
    username: string;
  };
}

interface Post {
  _id: string;
  userId: string;
  caption: string;
  imageUrl: string;
  likes: any[];
  shares: number;
  comments: Comment[];
  createdAt: string;
}

export default function PostsGrid({ username }: PostsGridProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserUsername, setCurrentUserUsername] = useState<string | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);


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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      setCurrentUserId(decoded.id);
      setCurrentUserUsername(decoded.username);
    }
  }, []);
  

  return (
    <div className="grid grid-cols-3 gap-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="w-full h-70 bg-gray-200 overflow-hidden rounded-lg"
            onClick={() => {
              setSelectedPostId(post._id);
              setShowCommentModal(true);
            }}
          >
            {post.imageUrl ? (
              <div
              key={post._id}
              className="relative group w-full aspect-square overflow-hidden rounded-lg"
              >
                <CldImage
                  src={post.imageUrl}
                  alt={post.caption || "Post image"}
                  className="w-full h-full object-cover"
                  width={400}
                  height={400}
                />
               <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-60 transition-opacity flex items-center justify-center gap-6">
                <div className="flex items-center gap-1 text-white text-lg font-semibold">
                  ❤️ {post.likes?.length ?? 0}
                </div>
                <div className="flex items-center gap-1 text-white text-lg font-semibold">
                  💬 {post.comments?.length ?? 0}
                </div>
              </div>
              </div>
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

      {selectedPostId && (
        <CommentModal
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          postId={selectedPostId}
          currentUserId={"Таны-одоогийн-UserID"} // Жишээ нь, context эсвэл localStorage-оос авна
          currentUserUsername={"Таны-username"}
        />
      )}
    </div>
    
  );
}
