"use client";

import { FC, useState } from "react";
import {
  Heart,
  MessageCircle,
  Copy,
  Bookmark,
  BookmarkMinus,
  CopyCheckIcon,
} from "lucide-react";

interface PostActionsProps {
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  postId: string;
}

const PostActions: FC<PostActionsProps> = ({
  liked,
  saved,
  onLike,
  onComment,
  onShare,
  onSave,
  postId,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/Home/post/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000); 
    } catch (err) {
      console.error("Хуулж чадсангүй:", err);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 pt-3">
      <div className="flex items-center gap-4">
        <Heart
          onClick={onLike}
          className={`cursor-pointer ${
            liked ? "text-red-500 fill-red-500" : "text-white"
          }`}
        />
        <MessageCircle
          onClick={onComment}
          className="text-white cursor-pointer"
        />
        <button onClick={handleCopyLink} className="flex flex-col items-center">
          {copied ? (
            <CopyCheckIcon className="text-green-500 mb-1" size={20} />
          ) : (
            <Copy className="text-white mb-1" size={20} />
          )}
        </button>
      </div>
      <button onClick={onSave}>
        {saved ? <BookmarkMinus size={22} /> : <Bookmark size={22} />}
      </button>
    </div>
  );
};

export default PostActions;
