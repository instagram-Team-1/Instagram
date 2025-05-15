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
              ? " border-t border-t-[var(--foreground)]"
              : "text-gray-500 dark:hover:text-white hover:text-gray-700 hover:border-t border-t-transparent "
          } `}
        >
          <p className="mt-[20px]">Posts</p>
        </button>
   
      </div>
  );
}

