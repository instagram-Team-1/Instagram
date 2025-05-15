"use client";

import { FC, useState } from "react";

interface PostCaptionProps {
  caption: string;
  username: string;
}

const PostCaption: FC<PostCaptionProps> = ({ caption, username }) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const fullCaption = caption || "";
  const shortCaption = fullCaption.slice(0, 100);

  const toggleCaption = () => setShowFullCaption((prev) => !prev);

  return (
    <div className="text-sm  px-4 pt-1">
      <span className="font-semibold">{username}</span>{" "}
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
  );
};

export default PostCaption;
