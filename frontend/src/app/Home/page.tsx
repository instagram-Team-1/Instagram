"use client";

import { useFeed } from "./Context/FeedPage";
import PostCard from "@/components/PostCard/post-card";
import { SuggestionsSidebar } from "@/components/Suggestions/suggested-sidebar";
import { StoriesBar } from "./components/stories/story";
import { useEffect, useState } from "react";
import ResponsiveHeader from "./actualRoom/component/responsiveHeader";

export default function FeedPage() {
  const data = useFeed();

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userData = {
    userId: data.userId,
    username: data.username,
    avatarImage: data.avatarImage
  };
  console.log(data ,  "wew");
  
  
  return (
    <div className="flex justify-center bg-white dark:bg-black w-screen min-h-screen px-4 lg:px-8">
      <div className="w-full max-w-[630px]">
<ResponsiveHeader/>
        <StoriesBar
          userId={{ id: data.userId }}
          username={{ username: data.username }}
        />
        {data.posts.map((post) => (
          <PostCard
            key={post._id}
            postId={post._id}
            imageUrl={post.imageUrl}
            caption={post.caption}
            user={post.userId}
            likes={post.likes}
            comments={post.comments}
            currentUserId={userData.userId}
            currentUserUsername={userData.username}
            currentUserAvatarImage={userData.avatarImage}
            isLiked={false}
            isSaved={false}
          />
        ))}
      </div>

      <div className="hidden lg:block w-[320px] pl-10 pt-8">
        <div className="sticky top-20">
          <SuggestionsSidebar username={{ username: data.username }} />
        </div>
      </div>
    </div>
  );
}
