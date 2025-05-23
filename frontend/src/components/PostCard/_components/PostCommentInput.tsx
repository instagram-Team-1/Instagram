"use client";

import { FC, FormEvent } from "react";
import { useState } from "react";

interface PostCommentInputProps {
  comment: string; // ✅ input утга
  onCommentChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  currentUserUsername: string;
  comments: any[];
  onCommentSubmit: (e: React.FormEvent) => void;
  currentUserAvatarImage:string;
}

const PostCommentInput: FC<PostCommentInputProps> = ({
  comment,
  onCommentChange,
  onSubmit,
  currentUserUsername,
  comments,
  onCommentSubmit,
  currentUserAvatarImage,
}) => {
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onCommentChange(value.trim());
  };
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [commentList, setCommentList] = useState<any[]>(comments);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        comment: comment.trim(),
        _id: `${Date.now()}`,
        userId: {
          _id: "userId",
          username: currentUserUsername,
          avatarImage: currentUserAvatarImage || "/img/default-avatar.png",
        },
      };
      setCommentList((prev) => [...prev, newComment]);
      onCommentSubmit(e);
      onCommentChange(""); // clear input after submit
    }
  };

  return (
    <div className="flex items-center px-4 pt-3 pb-3 border-b dark:border-neutral-800">
      <form onSubmit={onSubmit} className="flex items-center w-full">
        <input
          type="text"
          value={comment}
          placeholder="Add a comment..."
          onChange={handleCommentChange}
          className="bg-transparent dark:text-white text-sm flex-1 outline-none placeholder-gray-500"
        />

      </form>
    </div>
  );
};

export default PostCommentInput;
