"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Heart, MessageCircle, Send } from "lucide-react";
import PostCommentInput from "./PostCommentInput";
import { CommentModalProps , Comment } from "@/utils/CommentsType";



const CommentModal: FC<CommentModalProps> = ({
  imageUrl,
  user,
  caption,
  likesCount,
  liked,
  onLike,
  onShare,
  onCommentChange,
  onCommentSubmit,
  onClose,
  comments,
  comment,
  currentUserUsername,
  currentUserAvatarImage,
}) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [commentList, setCommentList] = useState<Comment[]>(comments);
  const fullCaption = caption || "";
  const shortCaption = fullCaption.slice(0, 100);

  console.log(currentUserUsername , "odooo");
  
  
  const toggleCaption = () => setShowFullCaption((prev) => !prev);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment: Comment = {
        _id: `${Date.now()}`,
        comment: comment.trim(),
        user: {
          _id: "userId",
          username: "You",
          avatarImage: currentUserAvatarImage || "",
        },
      };
      setCommentList((prev) => [...prev, newComment]);
      onCommentSubmit(e); 
      onCommentChange(""); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg overflow-hidden flex w-[90%] max-w-6xl h-[80%]">
        {/* Зүүн хэсэг: Постын зураг */}
        <div className="w-1/2 relative bg-black">
          <Image
            src={imageUrl}
            alt="Постын зураг"
            fill
            className="object-cover"
          />
        </div>
        {/* Баруун хэсэг: Мэдээлэл, комментууд */}
        <div className="w-1/2 flex flex-col">
          {/* Header: Хэрэглэгчийн нэр, хаах товч */}
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
            <button onClick={onClose} className="text-white text-2xl">
              ✕
            </button>
          </div>
          {/* Caption хэсэг */}
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
          {/* Комментуудын жагсаалт */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {commentList.length === 0 ? (
              <div className="text-gray-500 text-sm">No comments</div>
            ) : (
              commentList.map((cmt) => (
                <div
                  key={cmt._id ?? cmt.comment}
                  className="flex justify-between items-start border-b border-neutral-800 py-3"
                >
                  <div className="flex gap-3 items-center">
                    <Avatar className="w-[32px] h-[32px] mt-1">
                      <AvatarImage
                        src={
                          cmt.user?.avatarImage || "/img/default-avatar.png"
                        }
                      />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>
                        <span className="font-semibold mr-1">
                          {cmt.user.username ?? "Тодорхойгүй хэрэглэгч"}
                        </span>
                        {cmt.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Footer: Like, коммент оруулах */}
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
              onSubmit={handleSubmit}
              currentUserUsername={currentUserUsername}
              currentUserAvatarImage={currentUserAvatarImage}
              comments={commentList}
              onCommentSubmit={handleSubmit} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
