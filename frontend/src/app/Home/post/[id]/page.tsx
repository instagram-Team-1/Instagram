"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API } from "@/utils/api";
import SharedPost from "@/components/PostCard/_components/SharedPost";
import axios from "axios";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API}/api/post/${id}`);
        console.log(res);

        if (res.status !== 200) throw new Error("Post not found");
        const data = res.data;
        console.log(data);

        setPost(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (id) fetchPost();
  }, []);

  const handleLike = () => setLiked(!liked);
  const handleShare = () => alert("Share clicked");
  const handleCommentChange = (val: string) => setComment(val);
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Comment submitted: ${comment}`);
    setComment("");
  };

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  if (!post)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );

  return (
    <SharedPost
      imageUrl={post.imageUrl}
      user={post.userId} // эсвэл { username: post.userId.username, avatarImage: ... }
      caption={post.caption}
      comments={post.comments || []}
      likesCount={post.likes?.length || 0}
      liked={liked}
      onLike={handleLike}
      onShare={handleShare}
      onCommentChange={handleCommentChange}
      onCommentSubmit={handleCommentSubmit}
      onClose={() => history.back()}
      comment={comment}
    />
  );
}
