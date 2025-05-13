// components/PostCardSkeleton.tsx
import React from "react";

const PostCardSkeleton = () => {
  return (
    <div className="rounded-md bg-white dark:bg-black max-w-md mx-auto my-6 animate-pulse">
      <div className="flex items-center px-4 py-3 gap-3">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
      </div>

      <div className="w-full h-[400px] bg-gray-300 dark:bg-gray-700" />

      <div className="flex justify-start px-4 pt-3 gap-4">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>

      <div className="px-4 pt-2">
        <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded mb-1" />
        <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      <div className="px-4 pt-2">
        <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded mb-1" />
        <div className="w-full h-10 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export default PostCardSkeleton;
