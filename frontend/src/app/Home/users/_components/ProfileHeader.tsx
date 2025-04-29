import React from "react";
import { Button } from "@/components/ui/button";
import { UserDataType } from "@/lib/types";

type Props = {
  user: UserDataType;
};

export default function ProfileHeader({ user }: Props) {
  return (
    <div className="flex flex-col ml-[20px] gap-[30px]">
      <div className="text-[20px] font-normal flex flex-row items-center gap-[8px]">
        <div>{user.username}</div>
        <Button variant="secondary" className="bg-blue-400 text-white hover:bg-blue-500">Follow</Button>
        <Button variant="secondary" className="hover:bg-gray-200">Message</Button>
      </div>
      <div className="text-[16px] text-gray-400 flex flex-row gap-[30px]">
        <div>posts</div>
        <div>followers</div>
        <div>following</div>
      </div>
      <div className="text-[16px] text-gray-500">Bio goes here</div>
    </div>
  );
}
