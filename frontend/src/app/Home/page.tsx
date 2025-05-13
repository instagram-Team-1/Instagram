"use client";


import { useFeed } from "./Context/FeedPage";
import PostCard from "@/components/PostCard/post-card";
import { SuggestionsSidebar } from "@/components/Suggestions/suggested-sidebar";
import { StoriesBar } from "./components/stories/story";


export default function FeedPage() {
  const data = useFeed();

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-white dark:bg-black w-screen min-h-screen px-4 lg:px-8">
      <div className="w-full max-w-[630px]">
        <StoriesBar
          userId={{ id: data.userId }}
          username={{ username: data.username }}
        />
        {data.posts.map((post) => (
          <PostCard
            key={post._id}
            imageUrl={post.imageUrl}
            caption={
              typeof post.caption === "string"
                ? post.caption
                : "No caption provided"
            }
            userId={post.userId}
            likes={post.likes || 0}
            comments={post.comments || []}
            postId={post._id}
            currentUserId={data.userId}
            currentUserUsername={data.username}
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
