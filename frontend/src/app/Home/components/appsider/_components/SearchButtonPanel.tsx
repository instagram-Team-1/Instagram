import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { API } from "@/utils/api";
import { CircleX, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { parseJwt } from "@/utils/JwtParse";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface UserType {
  _id: string;
  username: string;
  fullname: string;
  avatarImage?: string;
}

type ActivePanelType = "none" | "search" | "messages" | "notifications";

interface SearchButtonPanelProps {
  activePanel: ActivePanelType;
}

function SearchButtonPanel({ activePanel }: SearchButtonPanelProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [hideSuggestions, setHideSuggestions] = useState(false);
  const [userData, setUserData] = useState<{
    _id?: string;
    avatarImage?: string;
    followers?: string[];
    following?: string[];
    posts?: string[];
  } | null>(null);
  const token = localStorage.getItem("token");
  const router = useRouter();
  const decoded = parseJwt(token || undefined);
  const userId = decoded.id;
  const image = decoded.avatarImage;
  const fullname = decoded.fullname;

 useEffect(() => {
   if (!searchValue) {
     setUsers([]);
     setHideSuggestions(false);
     return;
   }

   setHideSuggestions(true);

   const delayDebounce = setTimeout(() => {
     const fetchUserDetails = async () => {
       setLoading(true);
       try {
         const response = await axios.get(
           API + `/api/users/search?query=${encodeURIComponent(searchValue)}`
         );
         setUsers(response.data);
       } catch (error) {
         console.error("Search Error:", error);
       } finally {
         setLoading(false);
       }
     };
     fetchUserDetails();
   }, 500);

   return () => clearTimeout(delayDebounce);
 }, [searchValue]);

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
    <div>
      <div
        className={`${
          activePanel === "search"
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } transition-all duration-400 ease-in-out fixed top-0 left-0 h-screen ml-[75px] bg-white dark:bg-black border-r border-gray-200 dark:border-zinc-800 p-4`}
        style={{ minWidth: "400px" }}
      >
        <div className="h-[160px] w-[400px] p-5 border-b-[1px] mb-6">
          <h2 className="text-lg font-semibold mb-6 ">Search</h2>
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search"
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              value={searchValue}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="border-none h-[45px] text-base w-full focus-visible:ring-0 shadow-none bg-zinc-100 dark:bg-zinc-800 pr-10 [&::-webkit-search-cancel-button]:appearance-none"
            />
            <CircleX
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 cursor-pointer"
              onClick={() => setSearchValue("")}
              size={18}
            />
          </div>
        </div>
        {!hideSuggestions &&
          suggestions.slice(0, 5).map((user, i) => (
            <div
              key={i}
              className="flex  flex-col justify-between items-center w-[400px]  "
            >
              <div className="flex items-center gap-3 px-4 h-[60px] w-[360px] bg-white dark:bg-black   dark:border-zinc-700 ">
                <Avatar className="w-[44px] h-[44px] rounded-full overflow-hidden bg-gray-800">
                  <AvatarImage
                    src={user.avatarImage || "/default-avatar.png"}
                    alt={user.username}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="text-white flex items-center justify-center h-full w-full text-xs uppercase">
                    {user.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="flex flex-col leading-4 cursor-pointer"
                  onClick={() => router.push("/Home/users/" + user.username)}
                >
                  <span className="text-sm font-semibold">{user.username}</span>
                  <span className="text-xs text-[#B3B3B3] max-w-[160px] truncate">
                    @{user.fullname}
                  </span>
                </div>
              </div>
            </div>
          ))}

        {isFocused && searchValue && (
          <div className="w-[400px] flex justify-center items-center">
            <div className="w-[360px] bg-white dark:bg-zinc-900   dark:border-zinc-700 ">
              {loading ? (
                <p className="text-center text-gray-500 dark:text-gray-400 p-4">
                  Loading ...
                </p>
              ) : users.length > 0 ? (
                users.slice(0, 5).map((user) => (
                  <Link
                    href={`/Home/users/${user.username}`}
                    key={user._id}
                    onClick={() => setSearchValue("")}
                  >
                    <div className=" h-[60px] flex items-center gap-4 px-4 py-3 hover:bg-gray-100 p-1 dark:hover:bg-zinc-800 transition-colors cursor-pointer overflow-hidden">
                      <div className="w-[44px] h-[44px] flex items-center justify-center object-cover">
                        {" "}
                        <Avatar className="w-[44px] h-[44px]">
                          <AvatarImage
                            src={user.avatarImage || "/default-avatar.png"}
                          />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          {user.fullname}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 p-4">
                  Not found user.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchButtonPanel;
