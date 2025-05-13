import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import axios from "axios";
import { API } from "@/utils/api";

interface PostsGridProps {
  username: string;
}

interface Post {
  _id: string;
  username: string;
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
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);


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
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="w-full h-70 bg-gray-200 overflow-hidden rounded-lg"
            onClick={() => {
              setSelectedPost(post);
              setShowModal(true);
            }}
          >
            {post.imageUrl ? (
              <div className="relative group w-full aspect-square overflow-hidden rounded-lg">
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
              <h2 className="text-[24px] text-center font-semibold mb-2">No post yet</h2>
            )}
          </div>
        ))
      ) : (
        <h2 className="text-[24px] text-center font-semibold mb-2">No post yet</h2>
      )}
      {showModal && selectedPost && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-80">
    <div className="bg-black w-full max-w-5xl h-[80vh] flex rounded-lg overflow-hidden">
      
      <div className="w-1/2 relative">
        <CldImage
          src={selectedPost.imageUrl}
          alt="selected post"
          fill
          className="object-cover"
        />
      </div>

      <div className="w-1/2 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <span className="text-white font-bold">{selectedPost.username}</span>
          <button
            onClick={() => setShowModal(false)}
            className="text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="text-white p-4 text-sm border-b border-neutral-800">
          {selectedPost.caption}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedPost.comments?.length === 0 ? (
            <p className="text-neutral-400 text-sm">No comments yet.</p>
          ) : (
            selectedPost.comments?.map((comment, idx) => (
              <div key={idx} className="text-white text-sm py-2 border-b border-neutral-800">
                <span className="font-semibold">{comment?.user?.username }</span> {comment.comment}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

