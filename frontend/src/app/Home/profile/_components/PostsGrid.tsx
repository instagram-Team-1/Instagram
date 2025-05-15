"use client";

import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import axios from "axios";
import { API } from "@/utils/api";
import CommentModal from "./CommentModal";
import { UserDataType } from "@/lib/types";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { Skeleton } from "@/components/ui/skeleton";
import socket from "@/lib/socket";

interface PostsGridProps {
  username: string;
  user: string;
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
interface Comment {
  _id: string;
  comment: string;
  user: {
    _id: string;
    username: string;
    avatarImage: string;
  };
}

export default function PostsGrid({ username, user }: PostsGridProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [tokenData, setTokenData] = useState<UserDataType | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState("");
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentPostId, setCurrentPostId] = useState<string>("");
  // const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode<{ id: string; username: string }>(token);
    setUserId(decoded.id);
    setCurrentUsername(decoded.username);
    // setUsername(decoded.username);
  }, []);

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
    if (!selectedPost) return;

    const fetchPostDetails = async () => {
      try {
        const [likeRes, commentRes] = await Promise.all([
          axios.get(`${API}/api/check-like`, {
            params: { userId, postId: selectedPost._id },
          }),
          axios.get(`${API}/api/posts/comment/${selectedPost._id}`),
        ]);

        setLiked(likeRes.data.liked);
        setLikesCount(selectedPost.likes?.length || 0);
        setComments(commentRes.data);
      } catch (error) {
        toast.error("Failed to load post details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [selectedPost, userId]);

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

      // toast.success(response.data.message);
      if (response.data.likes) {
        setLikesCount(response.data.likes.length);
      }

      if (user !== userId) {
        socket.emit("sendNotification", {
          senderId: userId,
          receiverId: user,
          type: wasLiked ? "unlike" : "like",
        });
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

  //   useEffect(() => {
  //   const checkIfLiked = async () => {
  //     try {
  //       const response = await axios.get(`${API}/api/check-like`, {
  //         params: { userId, postId: currentPostId },
  //       });
  //       setLiked(response.data.liked);
  //     } catch (error) {
  //       console.error("Like төлвийг шалгахад алдаа гарлаа:", error);
  //       toast.error("Постын төлвийг ачааллахад алдаа гарлаа");
  //     }
  //   };

  //   if (currentPostId && userId) {
  //     checkIfLiked();
  //   }

  //   console.log("likes", liked);
  // }, [currentPostId, userId]);

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
        _id: userId,
        comment,
        user: {
          _id: userId,
          username: currentUsername,
          avatarImage: "",
        },
      };
      setComments((prev) => [...prev, newComment]);
      setComment("");

      if (user !== userId) {
        socket.emit("sendNotification", {
          senderId: userId,
          receiverId: user,
          type: "comment",
        });
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      toast.error("Коммент бичихэд алдаа гарлаа");
    }
  };

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

  const handlePostClick = async (post: Post) => {
    setCurrentPostId(post._id);
    setLikesCount(post.likes?.length || 0);

    try {
      const [likeRes, commentRes] = await Promise.all([
        axios.get(`${API}/api/check-like`, {
          params: { userId, postId: post._id },
        }),
        axios.get(`${API}/api/posts/comment/${post._id}`),
      ]);

      setLiked(likeRes.data.liked);
      setComments(commentRes.data);
    } catch (error) {
      toast.error("Failed to load post details");
      console.error(error);
    }

    setSelectedPost(post);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      postComment();
    }
  };

  const SkeletonPostCard = () => (
    <div className="w-full h-[400px]">
      <Skeleton className="w-full h-full rounded-md" />
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonPostCard key={i} />)
        ) : error ? (
          <div>{error}</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="w-full h-90 bg-gray-200 overflow-hidden cursor-pointer"
              onClick={() => handlePostClick(post)}
            >
              {post.imageUrl ? (
                <div className="relative group w-full h-full aspect-square overflow-hidden">
                  <CldImage
                    src={post.imageUrl}
                    alt={post.caption || "Post image"}
                    className="w-full h-full box-border object-cover"
                    width={300}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <div className="flex items-center gap-1 text-white text-lg font-semibold">
                      ❤️ {post.likes?.length ?? 0}
                    </div>
                    <div className="flex items-center gap-1 text-white text-lg font-semibold">
                      💬 {post.comments?.length ?? 0}
                    </div>
                  </div>
                </div>
              ) : (
                <h2 className="text-[24px] text-center font-semibold mb-2">
                  No post yet
                </h2>
              )}
            </div>
          ))
        ) : (
          <h2 className="text-[24px] text-center font-semibold mb-2">
            No post yet
          </h2>
        )}
      </div>

      {/* Modal */}
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
          comment={comment}
          currentUserUsername={""}
          currentUserAvatarImage={""}
        />
      )}
    </>
  );
}
