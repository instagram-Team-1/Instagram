import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { API } from "@/utils/api";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


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

  useEffect(() => {
    if (!searchValue) {
      setUsers([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const fetchUserDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            API + `/api/users/search?query=${encodeURIComponent(searchValue)}`
          );
          setUsers(response.data);
        } catch (error) {
          console.log(error);

          if (axios.isAxiosError(error)) {
            console.log(
              "Error details:",
              error.response?.data,
              error.response?.status
            );
          } else {
            console.log("An unexpected error occurred:", error);
          }
          setError("Хэрэглэгчийн мэдээллийг татахад алдаа гарлаа.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchValue]);

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
          <Input
            type="search"
            placeholder="Хэрэглэгч хайх..."
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            value={searchValue}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="border-none h-[45px] text-base w-full focus-visible:ring-0 shadow-none bg-zinc-100 dark:bg-zinc-800 "
          />
        </div>

        {isFocused && searchValue && (
          <div className="w-[400px] flex justify-center items-center">
            <div className="w-[360px] bg-white dark:bg-zinc-900   dark:border-zinc-700 ">
              {loading ? (
                <p className="text-center text-gray-500 dark:text-gray-400 p-4">
                  Уншиж байна...
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
                          <AvatarFallback><User/></AvatarFallback>
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
                  Хэрэглэгч олдсонгүй.
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
