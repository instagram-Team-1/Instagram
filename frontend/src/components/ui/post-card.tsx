import Image from "next/image";
import { Heart, MessageCircle, Bookmark, Send } from "lucide-react";

export function PostCard() {
  return (
    <div className=" rounded-md bg-white dark:bg-black max-w-md mx-auto my-6">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-500 rounded-full" />
          <span className="text-white text-sm font-medium">Hwasa97</span>
        </div>
        <button className="text-white text-lg">•••</button>
      </div>

      <div className="relative w-full aspect-square bg-black overflow-hidden h-150">
        <Image
          src="/img/image copy.png"
          alt="Post image"
          fill
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <Heart className="text-white hover:text-red-500 cursor-pointer" />
          <MessageCircle className="text-white cursor-pointer" />
          <Send className="text-white cursor-pointer" />
        </div>
        <Bookmark className="text-white cursor-pointer" />
      </div>

      {/* Likes */}
      <div className="text-sm text-white px-4 pt-2 font-semibold">
        654,890 likes
      </div>

      {/* Caption */}
      <div className="text-sm text-white px-4 pt-1">
        <span className="font-semibold">username</span> Heart...
        <button className="text-gray-400 ml-1">more</button>
      </div>

      {/* Comments */}
      <div className="text-sm text-gray-400 px-4 pt-1 cursor-pointer">
        View all 128 comments
      </div>

      {/* Add comment */}
      <div className="flex items-center px-4 pt-3 pb-3 border-b border-neutral-800">
        <input
          type="text"
          placeholder="Add a comment..."
          className="bg-transparent text-white text-sm flex-1 outline-none placeholder-gray-500"
        />
        <span className="text-2xl">😄</span>
      </div>
    </div>
  );
}
