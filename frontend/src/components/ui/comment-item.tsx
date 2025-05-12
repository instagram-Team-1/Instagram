import { useState } from "react";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Comment {
  user: {
    avatarImage: string | null;
    username: string;
  };
  comment: string;
}

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex justify-between items-start border-b border-neutral-800 py-3">
      <div className="flex gap-3 items-center">
        <Avatar className="w-[32px] h-[32px] mt-1">
          <AvatarImage
            src={comment.user.avatarImage || "/img/default-avatar.png"}
          />
          <AvatarFallback>👤</AvatarFallback>
        </Avatar>
        <div>
          <p>
            <span className="font-semibold mr-1">{comment.user.username}</span>
            {comment.comment}
          </p>
        </div>
      </div>
      <button
        onClick={() => setLiked(!liked)}
        className="text-gray-400 hover:text-white"
      >
        <Heart
          size={16}
          className={`${liked ? "text-red-500 fill-red-500" : ""}`}
        />
      </button>
    </div>
  );
}
