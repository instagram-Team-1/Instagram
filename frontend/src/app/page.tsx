import { StoriesBar } from "@/components/ui/stories-section";
import { PostCard } from "@/components/ui/post-card";
import { SuggestionsSidebar } from "@/components/ui/suggested-sidebar";

export default function FeedPage() {
  return (
    <div className="flex justify-center bg-black min-h-screen px-4 lg:px-8">
      <div className="w-full max-w-[630px]">
        <StoriesBar />
        <PostCard />
        <PostCard />
        <PostCard />
      </div>

      <div className="hidden lg:block w-[320px] pl-10 pt-8">
        <div className="sticky top-20">
          <SuggestionsSidebar />
        </div>
      </div>
    </div>
  );
}
