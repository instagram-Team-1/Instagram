"use client"
import React from 'react'


import * as Avatar from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { parseJwt } from "@/utils/JwtParse";
import { API } from "@/utils/api";
import { useRouter } from "next/navigation";

const page = () => {

     const [suggestions, setSuggestions] = useState<any[]>([]);
     const token = localStorage.getItem("token");
        const router = useRouter();
     const decoded = parseJwt(token || undefined);
     console.log("Decoded JWT:", decoded);

     const userId = decoded.id;

     useEffect(() => {
       const fetchSuggestedUsers = async () => {
         try {
           const response = await axios.get(API + `/api/suggested/${userId}`);
           setSuggestions(response.data);
           console.log("Suggested users:", response.data);
         } catch (error) {
           console.error("Error fetching suggested users:", error);
         }
       };

       fetchSuggestedUsers();
     }, [userId]);
     

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col overflow-scroll">
      <div className="flex justify-start items-start">Suggested</div>
      <div className="space-y-4 ">
        {suggestions.slice().map((user, i) => (
          <div key={i} className="flex justify-between items-center space-x-30">
            <div className="flex justify-between items-center ">
              <div className="flex items-center gap-3 ">
                <Avatar.Root className="h-10 w-10 rounded-full overflow-hidden bg-gray-800">
                  <Avatar.Image
                    src={user.avatarImage || "/avatars/default.jpg"} // зураг байхгүй тохиолдолд default зураг
                    alt={user.username}
                    className="object-cover w-full h-full"
                  />
                  <Avatar.Fallback className="text-white flex items-center justify-center h-full w-full text-xs uppercase">
                    {user.username.charAt(0)}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div
                  className="flex flex-col leading-4 cursor-pointer"
                  onClick={() => router.push("/Home/users/" + user.username)}
                >
                  <span className="text-sm font-semibold">{user.username}</span>
                  <span className="text-xs text-[#B3B3B3] max-w-[160px] truncate">
                    {user.fullname}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="text-[#0095F6] text-xs font-bold hover:text-white"
              onClick={() => router.push("/Home/users/" + user.username)}
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page