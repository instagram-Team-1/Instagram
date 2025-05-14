"use client";

import { FC } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  BookmarkMinus,
} from "lucide-react";

interface PostActionsProps {
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
}

const PostActions: FC<PostActionsProps> = ({
  liked,
  saved,
  onLike,
  onComment,
  onShare,
  onSave,
}) => {

  console.log(liked , 'mtgo');
  
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
        <Send onClick={onShare} className="text-white cursor-pointer" />
      </div>
      <button onClick={onSave}>
        {saved ? <BookmarkMinus size={22} /> : <Bookmark size={22} />}
      </button>
    </div>
  );
};

export default PostActions;
