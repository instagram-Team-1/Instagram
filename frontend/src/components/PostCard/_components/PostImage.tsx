"use client";

import { FC } from "react";
import Image from "next/image";

interface PostImageProps {
  imageUrl: string;
}

const PostImage: FC<PostImageProps> = ({ imageUrl }) => {
  return (
    <div className="relative w-full aspect-[4/5] bg-black overflow-hidden">
      <Image
        src={imageUrl}
        alt={`Постын зураг: "Тодорхойгүй хэрэглэгч"`}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
    </div>
  );
};

export default PostImage;
