"use client";

import { FC, FormEvent } from "react";

interface PostCommentInputProps {
  comment: string;
  onCommentChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

const PostCommentInput: FC<PostCommentInputProps> = ({
  comment,
  onCommentChange,
  onSubmit,
}) => {
  return (
    <div className="flex items-center px-4 pt-3 pb-3 border-b border-neutral-800">
      <form onSubmit={onSubmit} className="flex items-center w-full">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          className="bg-transparent text-white text-sm flex-1 outline-none placeholder-gray-500"
        />
      </form>
    </div>
  );
};

export default PostCommentInput;
