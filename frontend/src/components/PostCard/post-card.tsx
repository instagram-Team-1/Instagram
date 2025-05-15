"use client";

import { FC, useState } from "react";
import PostHeader from "./_components/PostCardHeader";
import PostImage from "./_components/PostImage";
import PostActions from "./_components/PostActions";
import PostCaption from "./_components/PostCaption";
import PostCommentInput from "./_components/PostCommentInput";
import ShareModal from "./_components/ShareModal";
import CommentModal from "./_components/CommentModal";
import { PostCardProps } from "@/lib/types";
import socket from "@/lib/socket";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "@/utils/api";

const PostCard: FC<PostCardProps> = ({
  postId,
  imageUrl,
  caption,
  user,
  likes,
  comments,
  isLiked,
  isSaved,
  currentUserId,
  currentUserUsername,
  currentUserAvatarImage,
}) => {
  const [liked, setLiked] = useState(() =>
    likes.some((likeUser) => likeUser._id === currentUserId)
  );
  const [saved, setSaved] = useState(isSaved);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [commentList, setCommentList] = useState(comments);

  console.log(likes, " mee");

  const handleLike = async () => {
    try {
      const wasLiked = liked;
      setLiked(!wasLiked);
      setLikesCount((prev) => prev + (wasLiked ? -1 : 1));

      const endpoint = wasLiked ? "/api/unlike" : "/api/like";
      const response = await axios.post(`${API}${endpoint}`, {
        userId: currentUserId,
        postId,
      });

      if (response.data.likes) {
        setLikesCount(response.data.likes.length);
      }

      if (user._id !== currentUserId) {
        socket.emit("sendNotification", {
          senderId: currentUserId,
          receiverId: user._id,
          type: wasLiked ? "unlike" : "like",
        });
      }
    } catch (err) {
      console.error("Like error:", err);
      toast.error("Failed to like/unlike post");
    }
  };

  const postComment = async () => {
    try {
      const res = await axios.post(`${API}/api/posts/comment/${postId}`, {
        userId: currentUserId,
        comment,
      });

      const newComment = {
        _id: res.data._id,
        comment,
        userId: {
          _id: currentUserId,
          username: currentUserUsername,
          avatarImage: "", // optional: add avatar if you have
        },
        createdAt: new Date().toISOString(),
      };

      setCommentList((prev) => [...prev, newComment]);
      setComment("");

      if (user._id !== currentUserId) {
        socket.emit("sendNotification", {
          senderId: currentUserId,
          receiverId: user._id,
          type: "comment",
        });
      }
    } catch (err) {
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
      setSaved(!saved);
      if (!saved) {
        await axios.post(`${API}/api/savePost/${currentUserId}`, {
          postId,
          userId: currentUserId,
        });
        toast.success("Post saved");
      } else {
        await axios.post(`${API}/api/unsavePost/${postId}`, {
          userId: currentUserId,
        });
        toast.success("Save removed");
      }
    } catch (err) {
      toast.error("Error saving post");
      setSaved((prev) => !prev);
    }
  };

  return (
    <div className="rounded-md bg-white dark:bg-black max-w-md mx-auto my-6 relative">
      {showShareModal && (
        <ShareModal postId={postId} onClose={() => setShowShareModal(false)} />
      )}
      {showComments && (
        <CommentModal
          imageUrl={imageUrl}
          user={user}
          caption={caption}
          likesCount={likesCount}
          liked={liked}
          onLike={handleLike}
          onShare={() => setShowShareModal(true)}
          onCommentChange={setComment}
          onCommentSubmit={handleSubmit}
          onClose={() => setShowComments(false)}
          comment={comment}
          comments={comments}
          currentUserUsername={currentUserUsername}
          currentUserAvatarImage={currentUserAvatarImage}
        />
      )}
      <div className="bg-black rounded-md overflow-hidden">
        <PostHeader user={user} />
        <PostImage imageUrl={imageUrl} />

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
        {user && user.username && (
          <PostCaption caption={caption} username={user.username} />
        )}
        <div
          className="text-sm text-gray-400 px-4 pt-1 cursor-pointer"
          onClick={() => setShowComments(true)}
        >
          {commentList.length > 0
            ? `View all ${commentList.length} comments`
            : "No comments"}
        </div>
        <PostCommentInput
          comment={comment}
          onCommentChange={setComment}
          onSubmit={handleSubmit}
          currentUserUsername={currentUserUsername}
          currentUserAvatarImage={currentUserAvatarImage}
          comments={commentList} onCommentSubmit={function (e: React.FormEvent): void {
            throw new Error("Function not implemented.");
          } }        />
      </div>
    </div>
  );
};

export default PostCard;
