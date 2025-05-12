"use client";

import { FC } from "react";
import Image from "next/image";
import { Post } from "@/lib/types";

interface PostPreviewProps {
  posts: Post[];
}

const PostPreview: FC<PostPreviewProps> = ({ posts }) => {
  if (!posts?.length) return null;

  return (
    <div className="grid grid-cols-3 gap-1 mt-4 max-h-48 overflow-y-auto pr-1">
      {posts.map((post) => (
        <Image
          key={post._id}
          src={post.imageUrl}
          alt={post.caption}
          width={90}
          height={90}
          className="object-cover w-full h-24 rounded-sm"
        />
      ))}
    </div>
  );
};

export default PostPreview;
