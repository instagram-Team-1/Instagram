import React from "react";
import { FC, useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { UserDataType } from "@/lib/types";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API } from "@/utils/api";
import CommentModal from "@/components/PostCard/_components/CommentModal";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@radix-ui/react-avatar";

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

  interface Comment {
    _id: string;
    comment: string;
    userId: {
      _id: string;
      username: string;
      avatarImage: string;
    };
  }


const PostAndSave = () => {
  const [selectedTab, setSelectedTab] = useState<"posts" | "saved" | "tagged">(
    "posts"
  );
  const [likesCount, setLikesCount] = useState<number>(0);
  const [currentPostId, setCurrentPostId] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<UserDataType | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode<{ id: string; username: string }>(token);
    setUserId(decoded.id);
    setCurrentUsername(decoded.username);
    setUsername(decoded.username);
  }, []);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setCurrentPostId(post._id);
    setLikesCount(post.likes?.length || 0);
    setShowModal(true);
  };

  useEffect(() => {
    if (!userId ) return;

    const fetchSavedPosts = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API}/api/getSavePost/${userId}`);

        setSavedPosts(response.data.savedPosts);
      } catch (err) {
        console.error("Failed to fetch saved posts", err);
        setError("Couldn't fetch saved posts");
      } finally {
        setLoading(false);
      }
    };

    if (selectedTab === "saved") {
      fetchSavedPosts();
    }
  }, [selectedTab, tokenData]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/api/getPostsUserId/${userId}`);
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

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const wasLiked = liked;
    const prevLikes = likesCount;

    setLiked((prev) => !prev);
    setLikesCount((prev) => prev + (wasLiked ? -1 : 1));

    try {
      const endpoint = wasLiked ? "/api/unlike" : "/api/like";
      const response = await axios.post(`${API}${endpoint}`, {
        userId,
        postId: currentPostId,
      });

      toast.success(response.data.message);
      if (response.data.likes) {
        setLikesCount(response.data.likes.length);
      }
    } catch (error) {
      console.error("Error to like/unlike:", error);
      toast.error("Error to like");
      setLiked(wasLiked);
      setLikesCount(prevLikes);
    } finally {
      setIsLoading(false);
    }
  };

  const postComment = async () => {
      try {
        const res = await axios.post(
          `${API}/api/posts/comment/${currentPostId}`,
          {
            userId,
            postId: currentPostId,
            username: currentUsername,
            comment,
          }
        );

        const newComment: Comment = {
          _id: res.data.comment?._id,
          comment,
          userId: {
            _id: userId,
            username: currentUsername,
            avatarImage: "", 
          },
        };
        setComments((prev) => [...prev, newComment]);
        setComment("");
      } catch (err) {
        console.error("Error posting comment:", err);
        toast.error("Коммент бичихэд алдаа гарлаа");
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      postComment();
    }
  };

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await axios.get(`${API}/api/check-like`, {
          params: { userId, postId: currentPostId },
        });
        setLiked(response.data.liked);
      } catch (error) {
        console.error("Like төлвийг шалгахад алдаа гарлаа:", error);
        toast.error("Постын төлвийг ачааллахад алдаа гарлаа");
      }
    };

    if (currentPostId && userId) {
      checkIfLiked();
    }

    console.log("likes", liked);
  }, [currentPostId, userId]);

  useEffect(() => {
    if (!currentPostId) return;
      const fetchComments = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            `${API}/api/posts/comment/${currentPostId}`
          );
          setComments(res.data);
          console.log(res.data, "mycomment");
        } catch (error) {
          console.error("Failed to load comments:", error);
        } finally {
          setLoading(false);
        }
      };

    fetchComments();
  }, [currentPostId]);

  useEffect(() => {
    if (!selectedPost) return;

    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`${API}/api/check-like`, {
          params: { userId, postId: selectedPost._id },
        });
        setLiked(response.data.liked);
        setLikesCount(selectedPost.likes?.length || 0);
      } catch (error) {
        console.error("Failed to load likes:", error);
      }
    };

    fetchLikeStatus();
  }, [selectedPost]);

  useEffect(() => {
    if (!selectedPost) return;
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API}/api/posts/comment/${selectedPost._id}`
        );
        setComments(res.data);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [selectedPost]);

  const SkeletonPostCard = () => (
    <div className="w-full h-[400px]">
      <Skeleton className="w-full h-full rounded-md" />
    </div>
  );

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

        {selectedTab === "tagged" && (
          <div className="text-center mt-24">
            <h2 className="text-[24px] font-semibold mb-2">No Tagged Posts</h2>
            <p className="text-gray-400">
              You haven't been tagged in any posts yet.
            </p>
          </div>
        )}
      </div>

      <div>
        {selectedTab === "posts" && (
          <>
            {loading ? (
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonPostCard key={i} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mt-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="relative w-full h-auto group bg-gray-200"
                    onClick={() => handlePostClick(post)}
                  >
                    <CldImage
                      src={post.imageUrl}
                      alt={post.caption || "Post image"}
                      width={300}
                      height={300}
                      className="object-cover box-border overflow-hidden w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 text-white text-lg font-semibold">
                        ❤️ {post.likes?.length ?? 0}
                      </div>
                      <div className="flex items-center gap-1 text-white text-lg font-semibold">
                        💬 {post.comments?.length ?? 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mt-24">
                <h2 className="text-[24px] font-semibold mb-2">Share Photos</h2>
                <p className="text-gray-400">
                  When you share photos, they will appear on your profile.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <div>
        {selectedTab === "saved" && (
          <>
            {loading ? (
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonPostCard key={i} />
                ))}
              </div>
            ) : savedPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mt-6">
                {savedPosts.map((post) => (
                  <div
                    key={post._id}
                    className="relative w-full h-auto group bg-gray-200"
                    onClick={() => {
                      setSelectedPost(post);
                      setShowModal(true);
                    }}
                  >
                    <CldImage
                      src={post.imageUrl}
                      alt={post.caption || "Post image"}
                      width={300}
                      height={300}
                      className="object-cover box-border overflow-hidden w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 text-white text-lg font-semibold">
                        ❤️ {post.likes?.length ?? 0}
                      </div>
                      <div className="flex items-center gap-1 text-white text-lg font-semibold">
                        💬 {post.comments?.length ?? 0}
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-[24px] font-semibold mb-2 mt-24">
                  No Saved Posts
                </h2>
                <p className="text-gray-400">
                  You haven't saved any posts yet.
                </p>
              </div>
            )}
          </>
        )}
        {/* {selectedTab === "saved" && (
          <>
            {loading ? (
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonPostCard key={i} />
                ))}
              </div>
            ) : savedPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mt-6">
                {savedPosts.map((post) => (
                  <div key={post._id} className="w-full h-auto bg-gray-200">
                    <CldImage
                      src={post.imageUrl}
                      alt={post.caption || "Saved Post"}
                      width={400}
                      height={300}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-[24px] font-semibold mb-2 mt-24">
                  No Saved Posts
                </h2>
                <p className="text-gray-400">
                  You haven't saved any posts yet.
                </p>
              </div>
            )}
          </>
        )} */}
      </div>

      {showModal && selectedPost && (
        <CommentModal
          imageUrl={selectedPost.imageUrl}
          user={{
            username: selectedPost.username,
            avatarImage: "/placeholder.jpg",
          }}
          caption={selectedPost.caption}
          comments={comments}
          likesCount={likesCount}
          liked={liked}
          onLike={handleLike}
          onShare={() => setShowShareModal(true)}
          onCommentChange={setComment}
          onCommentSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          comment={comment} currentUserUsername={""} currentUserAvatarImage={""}        />
      )}
    </div>
  );
};

export default PostAndSave;
