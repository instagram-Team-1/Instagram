import React from "react";
import { UserDataType } from "@/lib/types";

type Props = {
  user: UserDataType;
};

export default function ProfileImage({ user }: Props) {
  return (
    <div className="w-[283.67px] h-[181px]">
      <div
        className="relative w-[150px] h-[150px] bg-gray-300 box-border rounded-full overflow-hidden group bg-cover bg-center"
        style={{
          backgroundImage: `url(${user.avatarImage})`,
        }}
      ></div>
    </div>
  );
}
