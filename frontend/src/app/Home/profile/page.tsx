"use client";

import React from "react";

import UserHeaderTab from "./_components/UserHeaderTab";
import Highlight from "./_components/Highligth";
import PostAndSave from "./_components/PostAndSave";
import Footer from "./_components/Footer";

export default function ProfilePage() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-[935px] h-full px-[20px] pt-[30px] flex flex-col">
        <div className="flex flex-col gap-[30px]">
          <UserHeaderTab />
          <Highlight />
        </div>
        <PostAndSave />
        <Footer />
      </div>
    </div>
  );
}
