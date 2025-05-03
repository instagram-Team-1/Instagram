import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

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
            "https://instabackend-eight.vercel.app/api/users"
          );
          const filteredUsers = response.data.filter(
            (user: UserType) =>
              user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
              user.fullname.toLowerCase().includes(searchValue.toLowerCase())
          );
          setUsers(filteredUsers);
        } catch (error) {
          console.log(error);
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
          <div className="xl:w-[577px] w-[335px] h-auto overflow-hidden rounded-lg dark:bg-customText bg-white p-2 mt-2 absolute right-10 xl:right-[550px] ">
            {loading ? (
              <p className="text-center text-gray-500 mt-4">Уншиж байна...</p>
            ) : users.length > 0 ? (
              users.slice(0, 5).map((user) => (
                <Link
                  href={`/Home/users/${user.username}`}
                  key={user._id}
                  onClick={() => setSearchValue("")}
                >
                  <div className="p-2 border-b shadow-sm xl:w-[553px] flex items-center gap-4">
                    <Image
                      src={user.avatarImage || "/default-avatar.png"}
                      alt="avatar"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{user.fullname}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">
                Хэрэглэгч олдсонгүй.
              </p>
            )}
            <Link href={`/search?searching=${searchValue}`}>
              <div className="text-sm font-semibold mt-3 ml-2">
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
