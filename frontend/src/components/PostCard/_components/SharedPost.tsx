"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Heart, MessageCircle, Send } from "lucide-react";
import PostCommentInput from "./PostCommentInput";

interface Comment {
  comment: string;
  user: {
    username: string;
    avatarImage?: string; // → нэмэгдүүлсэн хэсэг
  };
}

interface SharedPostProps {
  imageUrl: string;
  user: { username: string; avatarImage?: string };
  caption: string;
  comments: Comment[];
  likesCount: number;
  liked: boolean;
  onLike: () => void;
  onShare: () => void;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  comment: string;
}

const SharedPost: FC<SharedPostProps> = ({
  imageUrl,
  user,
  caption,
  comments,
  likesCount,
  liked,
  onLike,
  onShare,
  onCommentChange,
  onCommentSubmit,
  onClose,
  comment,
}) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const fullCaption = caption || "";
  const shortCaption = fullCaption.slice(0, 100);

  const toggleCaption = () => setShowFullCaption((prev) => !prev);

  return (
    <div className="fixed inset-0  bg-opacity-90 flex items-center justify-center ">
      <div className="bg-black rounded-lg overflow-hidden flex w-[90%] max-w-6xl h-[80%]">
        <div className="w-1/2 relative bg-black">
          <Image
            src={imageUrl}
            alt={`Постын зураг`}
            fill
            className="object-cover"
          />
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center justify-between py-4 px-6 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <Avatar className="w-[32px] h-[32px]">
                <AvatarImage
                  src={user.avatarImage || "/img/default-avatar.png"}
                />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <span className="text-white font-semibold text-sm">
                {user.username}
              </span>
            </div>
          </div>
          <div className="flex gap-3 items-center px-6 py-3 text-white text-sm border-b border-neutral-800">
            <Avatar className="w-[32px] h-[32px]">
              <AvatarImage
                src={user.avatarImage || "/img/default-avatar.png"}
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">{user.username}</span>{" "}
            {showFullCaption ? fullCaption : shortCaption}
            {fullCaption.length > 100 && (
              <button
                onClick={toggleCaption}
                className="text-gray-400 ml-1 focus:outline-none"
              >
                {showFullCaption ? "бага" : "дэлгэрэнгүй"}
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">

            {comments.length === 0 ? (
              <div className="text-gray-500 text-sm">No comment.</div>
            ) : (
              comments.map((cmt, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start border-b border-neutral-800 py-3"
                >
                  <div className="flex gap-3 items-center">
                    <Avatar className="w-[32px] h-[32px] mt-1">
                      <AvatarImage
                        src={cmt.user?.avatarImage || "/img/default-avatar.png"}
                      />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>
                        <span className="font-semibold mr-1">
                          {cmt.user?.username ?? "Тодорхойгүй хэрэглэгч"}
                        </span>
                        {cmt.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-neutral-800 p-4">
            <div className="flex items-center gap-4 pb-3">
              <Heart
                onClick={onLike}
                className={`cursor-pointer ${
                  liked ? "text-red-500 fill-red-500" : "text-white"
                }`}
              />
              <MessageCircle className="text-white cursor-pointer" />
              <Send onClick={onShare} className="text-white cursor-pointer" />
            </div>
            <div className="text-white text-sm font-semibold pb-3">
              {likesCount.toLocaleString()} likes
            </div>
            <PostCommentInput
              comment={comment}
              onCommentChange={onCommentChange}
              onSubmit={onCommentSubmit}
              currentUserUsername={user.username}
              comments={comments}
              onCommentSubmit={onCommentSubmit}
              currentUserAvatarImage={user.avatarImage || "/img/default-avatar.png"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedPost;
