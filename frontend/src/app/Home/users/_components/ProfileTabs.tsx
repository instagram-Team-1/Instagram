import React from "react";
import { useState } from "react";

export default function ProfileTabs() {
  const [selectedTab, setSelectedTab] = useState<"posts" | "saved" | "tagged">(
      "posts"
    );
  return (
    <div className="flex flex-row justify-center gap-[30px] border-t border-gray-200 dark:border-gray-600">
        <button
          role="tab"
          aria-selected={selectedTab === "posts"}
          onClick={() => setSelectedTab("posts")}
          className={`text-[16px] font-medium ${
            selectedTab === "posts"
              ? "text-white border-t border-t-[var(--foreground)]"
              : "text-gray-500 dark:hover:text-white hover:text-gray-700 hover:border-t border-t-transparent "
          } `}
        >
          <p className="mt-[20px]">Posts</p>
        </button>
        <button
          role="tab"
          aria-selected={selectedTab === "saved"}
          onClick={() => setSelectedTab("saved")}
          className={`text-[16px] font-medium ${
            selectedTab === "saved"
              ? "text-white border-t border-t-[var(--foreground)]"
              : "text-gray-500 hover:text-white hover:border-t border-t-transparent"
          }`}
        >
          <p className="mt-[20px]">Saved</p>
        </button>
        <button
          role="tab"
          aria-selected={selectedTab === "tagged"}
          onClick={() => setSelectedTab("tagged")}
          className={`text-[16px] font-medium ${
            selectedTab === "tagged"
              ? "text-white border-t border-t-[var(--foreground)]"
              : "text-gray-500 hover:text-white hover:border-t border-t-transparent"
          }`}
        >
          <p className="mt-[20px]">Tagged</p>
        </button>
      </div>
  );
}

