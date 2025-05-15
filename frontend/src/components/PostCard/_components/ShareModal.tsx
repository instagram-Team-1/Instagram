"use client";

import { FC, useState } from "react";
import { Copy } from "lucide-react";

interface ShareButtonProps {
  onClose: () => void;
  postId: string;
}

const ShareButton: FC<ShareButtonProps> = ({postId }) => {

  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/Home/post/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Хуулж чадсангүй:", err);
    }
  };

  return ( 
    <div>
      <button onClick={handleCopyLink} className="flex flex-col items-center">
        <Copy className="text-white mb-1" size={20} />
        <span className="text-white text-xs">
          {copied ? "Copied!" : "Copy link"}
        </span>
      </button>
    </div>
  );
};

export default ShareButton;
