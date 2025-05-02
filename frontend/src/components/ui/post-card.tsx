"use client";

import Image from "next/image";
import { Heart, MessageCircle, Bookmark, Send, X, Copy } from "lucide-react";
import { useState } from "react";
import { API } from "@/utils/api";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { CldImage } from "next-cloudinary";

type PostCardProps = {
  imageUrl: string;
  caption: string;
  userId: {
    username: string;
    avatarImage: string;
  };
  likes: number;
  comments: string[];
  postId: string;
  currentUserId: string;
};

export function PostCard({
  imageUrl,
  caption,
  userId,
  likes,
  comments,
  postId,
  currentUserId,
}: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(likes || 0);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fullCaption = caption || "Тайлбар байхгүй.";
  const shortCaption = fullCaption.slice(0, 100);

  const friends = [
    { name: "Juliana", image: "/img/user1.png" },
    { name: "Pine", image: "/img/user2.png" },
  ];

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await axios.get(API + `/api/check-like`, {
          params: { userId: currentUserId, postId },
        });
        setLiked(response.data.liked);
      } catch (error) {
        console.error("Like төлвийг шалгахад алдаа гарлаа:", error);
        toast.error("Постын төлвийг ачааллахад алдаа гарлаа");
      }
    };

    if (postId && currentUserId) {
      checkIfLiked();
    }
  }, [postId, currentUserId]);
  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const wasLiked = liked;
    const prevLikes = likesCount;

    setLiked((prev) => !prev);
    setLikesCount((prev) => prev + (wasLiked ? -1 : 1));

    try {
      const endpoint = wasLiked ? "/api/unlike" : "/api/like";
      const response = await axios.post(API + endpoint, {
        userId: currentUserId,
        postId,
      });

      toast.success(response.data.message);

      // Server response-оос like тоог шинэчлэх (optional)
      if (response.data.likes) {
        setLikesCount(response.data.likes.length);
      }
    } catch (error) {
      console.error("Like/unlike үйлдэлд алдаа гарлаа:", error);
      toast.error("Like үйлдэлд алдаа гарлаа");

      // UI-г буцаах
      setLiked(wasLiked);
      setLikesCount(prevLikes);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSave = () => {
    setSaved((prev) => !prev);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleShowComments = () => {
    setShowComments(true);
  };

  const toggleCaption = () => {
    setShowFullCaption((prev) => !prev);
  };

  const handleCloseComments = () => {
    setShowComments(false);
  };

  const handleCloseShare = () => {
    setShowShareModal(false);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rounded-md bg-white dark:bg-black max-w-md mx-auto my-6 relative">
      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg w-[90%] max-w-md p-4 relative">
            <button
              onClick={handleCloseShare}
              className="absolute top-3 right-3 text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-white text-lg font-semibold text-center mb-4">
              Хуваалцах
            </h2>
            <input
              type="text"
              placeholder="Хайх"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-800 text-white p-2 rounded-md mb-4 outline-none placeholder-gray-400 text-sm"
            />
            <div className="flex flex-wrap gap-4 overflow-y-auto max-h-48 mb-4">
              {filteredFriends.map((friend, idx) => (
                <div key={idx} className="flex flex-col items-center w-20">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-600">
                    <Image
                      src={friend.image}
                      alt={`${friend.name}-н профайлын зураг`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white text-xs mt-1 text-center truncate">
                    {friend.name}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-around border-t border-neutral-700 pt-4">
              <div className="flex flex-col items-center">
                <Copy className="text-white mb-1" size={20} />
                <span className="text-white text-xs">Холбоос хуулах</span>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src="/img/fb.png"
                  alt="Facebook"
                  width={20}
                  height={20}
                  className="mb-1"
                />
                <span className="text-white text-xs">Facebook</span>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src="/img/messenger.png"
                  alt="Messenger"
                  width={20}
                  height={20}
                  className="mb-1"
                />
                <span className="text-white text-xs">Messenger</span>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src="/img/whatsapp.png"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                  className="mb-1"
                />
                <span className="text-white text-xs">WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMMENT MODAL */}
      {showComments ? (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-black rounded-lg overflow-hidden flex w-[90%] max-w-6xl h-[80%]">
            <div className="w-1/2 relative bg-black">
              <Image
                src={imageUrl}
                alt={`Постын зураг: ${userId.username}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between py-4 px-6 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-500 rounded-full">
                    <Image
                      src={userId.avatarImage || "/img/default-avatar.png"}
                      alt={`${userId.username}-н профайлын зураг`}
                      width={32}
                      height={32}
                      className="object-cover rounded-full"
                    />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {userId.username}
                  </span>
                </div>
                <button
                  onClick={handleCloseComments}
                  className="text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="px-6 py-3 text-white text-sm border-b border-neutral-800">
                <span className="font-semibold">{userId.username}</span>{" "}
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
                  <div className="text-gray-500 text-sm">Коммент байхгүй.</div>
                ) : (
                  comments.map((cmt, index) => (
                    <div
                      key={index}
                      className="text-sm text-white pt-2 border-b border-neutral-800 pb-2"
                    >
                      <span className="font-semibold">you</span> {cmt}
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-neutral-800 p-4">
                <div className="flex items-center gap-4 pb-3">
                  <Heart
                    onClick={handleLike}
                    className={`cursor-pointer ${
                      liked ? "text-red-500 fill-red-500" : "text-white"
                    } ${isLoading ? "opacity-50" : ""}`} // Ачаалалтай үед opacity бууруулах
                   
                  />
                  <MessageCircle className="text-white cursor-pointer" />
                  <Send
                    onClick={handleShare}
                    className="text-white cursor-pointer"
                  />
                </div>
                <div className="text-white text-sm font-semibold pb-3">
                  {likesCount.toLocaleString()} таалагдсан
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Коммент бичих..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 bg-transparent text-white outline-none placeholder-gray-500 text-sm"
                  />
                  <span className="text-2xl">😄</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : showOptions ? (
        /* OPTIONS MODAL */
        <div className="fixed inset-0 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg w-[100%] max-w-xs p-4 relative">
            <button
              onClick={() => setShowOptions(false)}
              className="absolute top-3 right-3 text-white"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col space-y-4 mt-6">
              <button className="text-red-500 text-center font-semibold">
                Мэдээлэх
              </button>
              <button className="text-red-500 text-center font-semibold">
                Дагахаа болих
              </button>
              <button className="text-white text-center">
                Дуртайдаа нэмэх
              </button>
              <button className="text-white text-center">Пост руу очих</button>
              <button className="text-white text-center">Хуваалцах...</button>
              <button className="text-white text-center">Холбоос хуулах</button>
              <button className="text-white text-center">Embed</button>
              <button className="text-white text-center">
                Энэ хаягийн тухай
              </button>
              <button
                onClick={() => setShowOptions(false)}
                className="text-white text-center font-semibold mt-2"
              >
                Цуцлах
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-black rounded-md overflow-hidden">
          <div className="flex items-center justify-between py-3 px-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-500 rounded-full">
                <Image
                  src={userId.avatarImage || "/img/default-avatar.png"}
                  alt={`${userId.username}-н профайлын зураг`}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <span className="text-white text-sm font-medium">
                {userId.username}
              </span>
            </div>
            <button
              className="text-white text-lg"
              onClick={() => setShowOptions(true)}
            >
              •••
            </button>
          </div>

          <div className="relative w-full aspect-[4/5] bg-black overflow-hidden">
            <Image
              src={imageUrl}
              alt={`Постын зураг: ${userId.username}`}
              width={468}
              height={585}
              className=""
            />
          </div>

          <div className="flex items-center justify-between px-4 pt-3">
            <div className="flex items-center gap-4">
              <Heart
                onClick={handleLike}
                className={`cursor-pointer ${
                  liked ? "text-red-500 fill-red-500" : "text-white"
                }`}
              />
              <MessageCircle
                className="text-white cursor-pointer"
                onClick={handleShowComments}
              />
              <Send
                onClick={handleShare}
                className="text-white cursor-pointer"
              />
            </div>
            <Bookmark
              onClick={handleSave}
              className={`cursor-pointer ${
                saved ? "text-white-400 fill-white" : "text-white"
              }`}
            />
          </div>

          <div className="text-sm text-white px-4 pt-2 font-semibold">
            {likesCount.toLocaleString()} таалагдсан
          </div>

          <div className="text-sm text-white px-4 pt-1">
            <span className="font-semibold">{userId.username}</span>{" "}
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

          <div
            className="text-sm text-gray-400 px-4 pt-1 cursor-pointer"
            onClick={handleShowComments}
          >
            {comments.length > 0
              ? `Бүх ${comments.length} комментийг харах`
              : "Коммент байхгүй"}
          </div>

          <div className="flex items-center px-4 pt-3 pb-3 border-b border-neutral-800">
            <input
              type="text"
              placeholder="Коммент бичих..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-transparent text-white text-sm flex-1 outline-none placeholder-gray-500"
            />
            <span className="text-2xl">😄</span>
          </div>
        </div>
      )}
    </div>
  );
}
