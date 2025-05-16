"use client";

import { FC, useState } from "react";
import {
  Heart,
  MessageCircle,
  Link,
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
  username: string;
}

const PostActions: FC<PostActionsProps> = ({
  liked,
  saved,
  onLike,
  onComment,
  onSave,
  username,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/Home/users/${username}`;
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
          className={`cursor-pointer dark:hover:text-white/50 hover:text-black/50 ${
            liked ? "text-red-500 fill-red-500 hover:text-red-500" : ""
          }`}
        />
        <MessageCircle
          onClick={onComment}
          className=" cursor-pointer dark:hover:text-white/50 hover:text-black/50"
        />
        <button onClick={handleCopyLink} className="flex flex-col items-center">
          {copied ? (
            <Link className="dark:text-white/50 text-black/50" size={20} />
          ) : (
            <Link className="dark:text-white cursor-pointer" size={20} />
          )}
        </button>
      </div>
      <button onClick={onSave}>
        {saved ? <BookmarkMinus size={22} className=" cursor-pointer dark:hover:text-white/50 hover:text-black/50"/> : <Bookmark size={22} className=" cursor-pointer dark:hover:text-white/50 hover:text-black/50"/>}
      </button>
    </div>
  );
};

export default PostActions;
