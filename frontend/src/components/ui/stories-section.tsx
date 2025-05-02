// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// const stories = [
//   { name: "jiu_dresser", isLive: true, img: "/avatars/1.jpg" },
//   { name: "tarot_mer...", img: "/avatars/2.jpg" },
//   { name: "maral", img: "/avatars/3.jpg" },
//   { name: "Jennie_ruby", img: "/avatars/4.jpg" },
//   { name: "Kohaox", img: "/avatars/5.jpg" },
//   { name: "Lala", img: "/avatars/5.jpg" },
//   { name: "Jolo", img: "/avatars/5.jpg" },
//   { name: "Nick", img: "/avatars/5.jpg" },
// ];

// export function StoriesBar() {
//   return (
//     <div className="flex gap-1 overflow-x-auto py-4 px-4  scrollbar-hide">
//       {stories.map((story, index) => (
//         <div key={index} className="flex flex-col items-center min-w-[70px]">
//           <div className="relative">
//             <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500">
//               <Avatar className="border-2 border-black w-14 h-14">
//                 <AvatarImage src={story.img} alt={story.name} />
//                 <AvatarFallback>{story.name[0]}</AvatarFallback>
//               </Avatar>
//             </div>
//             {story.isLive && (
//               <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-semibold px-2 py-[1px] rounded-sm">
//                 LIVE
//               </span>
//             )}
//           </div>
//           <span className="text-xs text-white mt-2 text-center w-16 truncate">
//             {story.name}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import StoryModal from "./storymodal";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Story = {
  _id: string;
  media: string;
  text?: string;
  owner: string;
};

export function StoriesBar() {
  const { data: session } = useSession();
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/story/upload/${session?.user?.id}`
        );
        setStories(res.data);
      } catch (err) {
        console.error("Failed to fetch stories", err);
      }
    };

    if (session?.user?.id) {
      fetchStories();
    }
  }, [session]);

  const handleAddStory = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("backgroundMedia", file);
        formData.append("text", "");

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/story/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${session?.user?.token}`,
              },
            }
          );

          setStories((prev) => [...prev, res.data.savedStory]);
        } catch (err) {
          console.error("Story upload failed", err);
          alert("Story upload амжилтгүй боллоо");
        }
      }
    };

    input.click();
  };

  return (
    <>
      <div className="w-full border-t border-gray-800 bg-[#121212]">
        <div className="flex gap-4 overflow-x-auto py-4 px-4 scrollbar-hide">
          {/* Add story */}
          <div
            onClick={handleAddStory}
            className="flex flex-col items-center min-w-[70px] cursor-pointer group"
          >
            <div className="relative w-14 h-14 p-[2px] rounded-full bg-white group-hover:scale-105 transition">
              <Image
                src={(session?.user as any)?.image || "/default-avatar.png"}
                alt="Your Story"
                fill
                sizes="56px"
                className="rounded-full object-cover border-2 border-black"
              />
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-[2px]">
                <Plus className="text-white w-4 h-4" />
              </div>
            </div>
            <span className="text-xs text-white mt-2 text-center w-16 truncate">
              Your Story
            </span>
          </div>

          {/* Other stories */}
          {stories.map((story, index) => (
            <div
              key={index}
              onClick={() => setSelectedStory(story)}
              className="flex flex-col items-center min-w-[70px] cursor-pointer group"
            >
              <div className="relative w-14 h-14 p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 group-hover:scale-105 transition">
                <Image
                  src={story.media}
                  alt={story.owner}
                  fill
                  sizes="56px"
                  className="rounded-full object-cover border-2 border-black"
                />
              </div>
              <span className="text-xs text-white mt-2 text-center w-16 truncate">
                {story.owner}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedStory && (
        <StoryModal
          isOpen={true}
          onClose={() => setSelectedStory(null)}
          mediaUrl={selectedStory.media}
          type={
            selectedStory.media.endsWith(".mp4") ||
            selectedStory.media.endsWith(".mov")
              ? "video"
              : "image"
          }
        />
      )}
    </>
  );
}
