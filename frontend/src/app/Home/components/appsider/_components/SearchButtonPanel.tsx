import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { API } from "@/utils/api";

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
          API+`/api/users/search?query=${encodeURIComponent(searchValue)}`
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
        <div className="h-[160px] w-[400px] p-5 border-b-[1px]">
          <h2 className="text-lg font-semibold mb-4">Search</h2>
          <Input
            type="search"
            placeholder="Хэрэглэгч хайх..."
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            value={searchValue}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="border-none text-base w-full focus-visible:ring-0 shadow-none"
          />
        </div>

        {isFocused && searchValue && (
          <div className="absolute z-50 top-[180px] left-[80px] w-[360px] bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700">
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
                  <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                    <Image
                      src={user.avatarImage || "/default-avatar.png"}
                      alt="avatar"
                      width={44}
                      height={44}
                      className="rounded-full object-cover"
                    />
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
            <Link href={`/search?searching=${searchValue}`}>
              <div className="text-center py-3 text-sm font-medium text-blue-600 dark:text-blue-400 border-t border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                “{searchValue}” хайлтын бүх үр дүнг харах
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchButtonPanel;
