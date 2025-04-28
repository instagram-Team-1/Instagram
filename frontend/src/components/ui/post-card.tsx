"use client";

import Image from "next/image";
import { Heart, MessageCircle, Bookmark, Send, X, Copy } from "lucide-react";
import { useState } from "react";

export function PostCard() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(654890);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const fullCaption =
    "On April 10 KST, MyMusicTaste announced that 'HWASA Live Tour [Twits] in Europe,' which was originally scheduled to kick off next month, had been postponed to the fourth quarter of 2025 due to internal circumstances.";
  const shortCaption = fullCaption.slice(0, 100);

  const friends = [
    { name: "Juliana", image: "/img/user1.png" },
    { name: "Pine", image: "/img/user2.png" },
    { name: "Nick", image: "/img/user3.png" },
    { name: "Robert", image: "/img/user4.png" },
    { name: "Kohaox", image: "/img/user5.png" },
    { name: "Monica", image: "/img/user6.png" },
    { name: "Amber", image: "/img/user7.png" },
    { name: "Jolo", image: "/img/user8.png" },
  ];

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => prev + (liked ? -1 : 1));
  };

  const handleAddComment = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && comment.trim() !== "") {
      setComments((prev) => [...prev, comment]);
      setComment("");
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
              Share
            </h2>
            <input
              type="text"
              placeholder="Search"
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
                      alt={friend.name}
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
                <span className="text-white text-xs">Copy Link</span>
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
                src="/img/image copy.png"
                alt="Post image"
                fill
                className="object-cover"
              />
            </div>
            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between py-4 px-6 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-500 rounded-full" />
                  <span className="text-white font-semibold text-sm">
                    Hwasa97
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
                <span className="font-semibold">username</span>{" "}
                {showFullCaption ? fullCaption : shortCaption}
                {fullCaption.length > 100 && (
                  <button
                    onClick={toggleCaption}
                    className="text-gray-400 ml-1 focus:outline-none"
                  >
                    {showFullCaption ? "less" : "more"}
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {comments.length === 0 ? (
                  <div className="text-gray-500 text-sm">No comments yet.</div>
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
                    className={`cursor-pointer ${liked ? "text-red-500 fill-red-500" : "text-white"}`}
                  />
                  <MessageCircle className="text-white cursor-pointer" />
                  <Send
                    onClick={handleShare}
                    className="text-white cursor-pointer"
                  />
                </div>
                <div className="text-white text-sm font-semibold pb-3">
                  {likesCount.toLocaleString()} likes
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={handleAddComment}
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
                Report
              </button>
              <button className="text-red-500 text-center font-semibold">
                Unfollow
              </button>
              <button className="text-white text-center">
                Add to favorites
              </button>
              <button className="text-white text-center">Go to post</button>
              <button className="text-white text-center">Share to...</button>
              <button className="text-white text-center">Copy link</button>
              <button className="text-white text-center">Embed</button>
              <button className="text-white text-center">
                About this account
              </button>
              <button
                onClick={() => setShowOptions(false)}
                className="text-white text-center font-semibold mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-black rounded-md overflow-hidden">
          <div className="flex items-center justify-between py-3 px-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-500 rounded-full" />
              <span className="text-white text-sm font-medium">Hwasa97</span>
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
              src="/img/image copy.png"
              alt="Post image"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex items-center justify-between px-4 pt-3">
            <div className="flex items-center gap-4">
              <Heart
                onClick={handleLike}
                className={`cursor-pointer ${liked ? "text-red-500 fill-red-500" : "text-white"}`}
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
              className={`cursor-pointer ${saved ? "text-white-400 fill-white" : "text-white"}`}
            />
          </div>

          <div className="text-sm text-white px-4 pt-2 font-semibold">
            {likesCount.toLocaleString()} likes
          </div>

          <div className="text-sm text-white px-4 pt-1">
            <span className="font-semibold">username</span>{" "}
            {showFullCaption ? fullCaption : shortCaption}
            {fullCaption.length > 100 && (
              <button
                onClick={toggleCaption}
                className="text-gray-400 ml-1 focus:outline-none"
              >
                {showFullCaption ? "less" : "more"}
              </button>
            )}
          </div>

          <div
            className="text-sm text-gray-400 px-4 pt-1 cursor-pointer"
            onClick={handleShowComments}
          >
            View all {comments.length + 128} comments
          </div>

          <div className="flex items-center px-4 pt-3 pb-3 border-b border-neutral-800">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleAddComment}
              className="bg-transparent text-white text-sm flex-1 outline-none placeholder-gray-500"
            />
            <span className="text-2xl">😄</span>
          </div>
        </div>
      )}
    </div>
  );
}
