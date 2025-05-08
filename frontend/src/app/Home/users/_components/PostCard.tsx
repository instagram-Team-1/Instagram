import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";   
import { Heart, MessageCircle, Send, User, Bookmark, BookmarkMinus } from "lucide-react";
import Image from "next/image";

interface Post {
  _id: string;
  userId: {
    username: string;
    avatarImage: string;
  };
  caption: string;
  imageUrl: string;
  likes: { userId: string }[];
  shares: number;
  comments: {
    userId: string;
    comment: string;
    createdAt: string;
    _id: string;
  }[];
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onOpenModal: (post: Post) => void;
}

export default function PostCard({ post, onOpenModal }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [comment, setComment] = useState("");

  const likesCount = post.likes.length;
  const shortCaption = post.caption.slice(0, 100);
  const fullCaption = post.caption;

  const toggleCaption = () => setShowFullCaption((prev) => !prev);
  const toggleSave = () => setSaved((prev) => !prev);
  const handleLike = () => setLiked((prev) => !prev);
  const handleShowComments = () => onOpenModal(post);
  const handleShare = () => alert("Share clicked"); // Түр хугацааны placeholder
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Comment:", comment);
    setComment("");
  };

  return (
    <div className="bg-black rounded-md overflow-hidden cursor-pointer" onClick={() => onOpenModal(post)}>
      <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-[32px] h-[32px]">
            <AvatarImage
              src={post.userId?.avatarImage || "/img/default-avatar.png"}
            />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <span className="text-white text-sm font-medium">
            {post.userId?.username || "@unknown"}
          </span>
        </div>
        <button className="text-white text-lg">•••</button>
      </div>

      <div className="relative w-full aspect-[4/5] bg-black overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={`Постын зураг: ${post.userId?.username || "Тодорхойгүй хэрэглэгч"}`}
          width={468}
          height={585}
          className="object-cover"
        />
      </div>

      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <Heart
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className={`cursor-pointer ${liked ? "text-red-500 fill-red-500" : "text-white"}`}
          />
          <MessageCircle
            className="text-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleShowComments();
            }}
          />
          <Send
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="text-white cursor-pointer"
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSave();
          }}
        >
          {saved ? <BookmarkMinus size={22} /> : <Bookmark size={22} />}
        </button>
      </div>

      <div className="text-sm text-white px-4 pt-2 font-semibold">
        {likesCount.toLocaleString()} таалагдсан
      </div>

      <div className="text-sm text-white px-4 pt-1">
        <span className="font-semibold">{post.userId.username}</span>{" "}
        {showFullCaption ? fullCaption : shortCaption}
        {fullCaption.length > 100 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCaption();
            }}
            className="text-gray-400 ml-1 focus:outline-none"
          >
            {showFullCaption ? "бага" : "дэлгэрэнгүй"}
          </button>
        )}
      </div>

      <div
        className="text-sm text-gray-400 px-4 pt-1 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleShowComments();
        }}
      >
        {post.comments.length > 0
          ? `Бүх ${post.comments.length} комментийг харах`
          : "Коммент байхгүй"}
      </div>

      <div
        className="flex items-center px-4 pt-3 pb-3 border-b border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex items-center w-full">
          <input
            type="text"
            placeholder="Коммент бичих..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-transparent text-white text-sm flex-1 outline-none placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="ml-2 text-white text-lg disabled:text-gray-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
