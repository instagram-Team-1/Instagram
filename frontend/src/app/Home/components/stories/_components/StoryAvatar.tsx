import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type StoryAvatarProps = {
  user: { _id: string; username: string; avatarImage: string };
  hasViewedAll: boolean;
  onClick: () => void;
};

export function StoryAvatar({ user, hasViewedAll, onClick }: StoryAvatarProps) {
  const borderColorClass = hasViewedAll
    ? "bg-gray-400"
    : "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500";

  return (
    <div
      className="flex flex-col items-center min-w-[70px] cursor-pointer"
      onClick={onClick}
    >
      <div className={`p-[2px] rounded-full ${borderColorClass}`}>
        <Avatar className="border-2 border-black w-14 h-14">
          <AvatarImage src={user.avatarImage} alt={user.username} />
          <AvatarFallback>
            {user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <span className="text-xs text-white mt-2 text-center w-16 truncate">
        {user.username}
      </span>
    </div>
  );
}
