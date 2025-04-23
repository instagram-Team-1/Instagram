import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const stories = [
  { name: "jiu_dresser", isLive: true, img: "/avatars/1.jpg" },
  { name: "tarot_mer...", img: "/avatars/2.jpg" },
  { name: "maral", img: "/avatars/3.jpg" },
  { name: "Jennie_ruby", img: "/avatars/4.jpg" },
  { name: "Kohaox", img: "/avatars/5.jpg" },
  { name: "Lala", img: "/avatars/5.jpg" },
  { name: "Jolo", img: "/avatars/5.jpg" },
  { name: "Nick", img: "/avatars/5.jpg" },
];

export function StoriesBar() {
  return (
    <div className="flex gap-1 overflow-x-auto py-4 px-4  scrollbar-hide">
      {stories.map((story, index) => (
        <div key={index} className="flex flex-col items-center min-w-[70px]">
          <div className="relative">
            <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500">
              <Avatar className="border-2 border-black w-14 h-14">
                <AvatarImage src={story.img} alt={story.name} />
                <AvatarFallback>{story.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            {story.isLive && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-semibold px-2 py-[1px] rounded-sm">
                LIVE
              </span>
            )}
          </div>
          <span className="text-xs text-white mt-2 text-center w-16 truncate">
            {story.name}
          </span>
        </div>
      ))}
    </div>
  );
}
