"use client";

import Image from "next/image";
import { Heart, MessageCircle, Bookmark, Send } from "lucide-react";
import { useState } from "react";

export function PostCard() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(654890);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [shared, setShared] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);

  const fullCaption =
    "On April 10 KST, MyMusicTaste announced that “HWASA Live Tour [Twits] in Europe,” which was originally scheduled to kick off next month, had been postponed to the fourth quarter of 2025 due to “internal circumstances.";
  const shortCaption = fullCaption.slice(0, 100);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleAddComment = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && comment.trim() !== "") {
      setComments((prev) => [...prev, comment]);
      setComment("");
    }
  };

  const handleSave = () => {
    setSaved((prev) => !prev);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => {
      setShared(false);
    }, 2000);
  };

  const handleShowComments = () => {
    setShowComments((prev) => !prev);
  };

  const toggleCaption = () => {
    setShowFullCaption((prev) => !prev);
  };

  return (
    <div className="rounded-md bg-white dark:bg-black max-w-md mx-auto my-6 relative">
      {shared && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-neutral-800 text-white px-4 py-2 rounded-md text-sm">
          Shared!
        </div>
      )}

      <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-500 rounded-full" />
          <span className="text-white text-sm font-medium">Hwasa97</span>
        </div>
        <button className="text-white text-lg">•••</button>
      </div>

      <div className="relative w-full aspect-[4/5] bg-black overflow-hidden">
        <Image
          src="/img/image copy.png"
          alt="Post image"
          fill
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <Heart
            onClick={handleLike}
            className={`cursor-pointer ${liked ? "text-red-500 fill-red-500" : "text-white"}`}
          />
          <MessageCircle
            className="text-white cursor-pointer"
            onClick={handleShowComments}
          />
          <Send className="text-white cursor-pointer" onClick={handleShare} />
        </div>
        <Bookmark
          onClick={handleSave}
          className={`cursor-pointer ${saved ? "text-white-400 fill-white" : "text-white"}`}
        />
      </div>

      {/* Likes */}
      <div className="text-sm text-white px-4 pt-2 font-semibold">
        {likesCount.toLocaleString()} likes
      </div>

      {/* Caption */}
      <div className="text-sm text-white px-4 pt-1">
        <span className="font-semibold">username</span>{" "}
        {showFullCaption ? fullCaption : shortCaption}
        {fullCaption.length > 100 && (
          <button
            onClick={toggleCaption}
            className="text-gray-400 ml-1 focus:outline-none"
          >
            {showFullCaption ? "less" : "more"}
          </button>
        )}
      </div>

      {/* Comments toggle */}
      <div
        className="text-sm text-gray-400 px-4 pt-1 cursor-pointer"
        onClick={handleShowComments}
      >
        {showComments
          ? "Hide comments"
          : `View all ${comments.length + 128} comments`}
      </div>

      {showComments && (
        <div className="px-4">
          {comments.map((cmt, index) => (
            <div key={index} className="text-sm text-white pt-1">
              <span className="font-semibold">you</span> {cmt}
            </div>
          ))}
        </div>
      )}

      {/* Add comment */}
      <div className="flex items-center px-4 pt-3 pb-3 border-b border-neutral-800">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleAddComment}
          className="bg-transparent text-white text-sm flex-1 outline-none placeholder-gray-500"
        />
        <span className="text-2xl">😄</span>
      </div>
    </div>
  );
}
