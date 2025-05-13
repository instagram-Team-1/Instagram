"use client";

import { FC, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PostHeader from "./_components/PostCardHeader";
import PostImage from "./_components/PostImage";
import PostActions from "./_components/PostActions";
import PostCaption from "./_components/PostCaption";
import PostCommentInput from "./_components/PostCommentInput";
import ShareModal from "./_components/ShareModal";
import CommentModal from "./_components/CommentModal";
import { API } from "@/utils/api";
import { PostCardProps, Post, Comment } from "@/lib/types";
import PostCardSkeleton from "./_components/PostCardSkeleton";

const PostCard: FC<PostCardProps> = ({
  imageUrl,
  caption,
  userId,
  likes,
  postId,
  currentUserId,
  currentUserUsername,
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [likesCount, setLikesCount] = useState(likes || 0);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isSaved = savedPosts.some(
      (post) => post._id.toString() === postId.toString()
    );
    setSaved(isSaved);
  }, [savedPosts, postId]);

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await axios.get(`${API}/api/check-like`, {
          params: { userId: currentUserId, postId },
        });
        setLiked(response.data.liked);
      } catch (error) {
        console.error("Like төлвийг шалгахад алдаа гарлаа:", error);
        toast.error("Постын төлвийг ачааллахад алдаа гарлаа");
      }
    };

    if (postId && currentUserId) {
      checkIfLiked();
    }
  }, [postId, currentUserId]);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/posts/comment/${postId}`);
        setComments(res.data);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}/api/getSavePost/${currentUserId}`
        );
        setSavedPosts(response.data.savedPosts);
      } catch (err) {
        console.error("Failed to fetch saved posts", err);
        toast.error("Couldn't fetch saved posts");
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchSavedPosts();
    }
  }, [currentUserId]);

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
        userId: currentUserId,
        postId,
      });

      toast.success(response.data.message);
      if (response.data.likes) {
        setLikesCount(response.data.likes.length);
      }
    } catch (error) {
      console.error("Like/unlike үйлдэлд алдаа гарлаа:", error);
      toast.error("Like үйлдэлд алдаа гарлаа");
      setLiked(wasLiked);
      setLikesCount(prevLikes);
    } finally {
      setIsLoading(false);
    }
  };

  const postComment = async () => {
    try {
      const res = await axios.post(`${API}/api/posts/comment/${postId}`, {
        userId: currentUserId,
        comment,
      });

      const newComment = {
        comment,
        user: { username: currentUserUsername },
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

  const toggleSave = async () => {
    try {
      setSaved((prev) => !prev);
      if (saved) {
        await axios.post(`${API}/api/unsavePost/${postId}`, {
          userId: currentUserId,
        });
        toast.success("Пост хадгалагдсаныг устгалаа");
      } else {
        await axios.post(`${API}/api/savePost/${currentUserId}`, {
          userId: currentUserId,
          postId,
        });
        toast.success("Post saved");
      }
    } catch (error) {
      console.error("Пост хадгалах/устгахад алдаа гарлаа:", error);
      toast.error("Пост хадгалах/устгахад алдаа гарлаа");
      setSaved((prev) => !prev);
    }
  };

  if (loading)
    return <PostCardSkeleton/>;

  return (
    <div className="rounded-md bg-white dark:bg-black max-w-md mx-auto my-6 relative">
      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          postId={postId} // ⬅️ пост ID-г дамжуулж байна
        />
      )}
      {showComments && (
        <CommentModal
          imageUrl={imageUrl}
          user={userId}
          caption={caption}
          comments={comments}
          likesCount={likesCount}
          liked={liked}
          onLike={handleLike}
          onShare={() => setShowShareModal(true)}
          onCommentChange={setComment}
          onCommentSubmit={handleSubmit}
          onClose={() => setShowComments(false)}
          comment={comment}
        />
      )}
      <div className="bg-black rounded-md overflow-hidden">
        <PostHeader user={userId} />
        <PostImage imageUrl={imageUrl} username={userId.username} />
        <PostActions
          liked={liked}
          saved={saved}
          onLike={handleLike}
          onComment={() => setShowComments(true)}
          onShare={() => setShowShareModal(true)}
          onSave={toggleSave}
        />
        <div className="text-sm text-white px-4 pt-2 font-semibold">
          {likesCount.toLocaleString()} likes
        </div>
        <PostCaption caption={caption} username={userId.username} />
        <div
          className="text-sm text-gray-400 px-4 pt-1 cursor-pointer"
          onClick={() => setShowComments(true)}
        >
          {comments.length > 0
            ? `View all ${comments.length} comments`
            : "No comments"}
        </div>
        <PostCommentInput
          comment={comment}
          onCommentChange={setComment}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default PostCard;
