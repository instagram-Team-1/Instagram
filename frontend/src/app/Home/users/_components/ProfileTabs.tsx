import React from "react";

export default function ProfileTabs() {
  return (
    <div className="flex flex-row justify-center gap-[30px] border-t border-gray-200 dark:border-gray-600">
      {["Posts", "Saved", "Tagged"].map((tab) => (
        <a
          key={tab}
          aria-selected="false"
          role="tab"
          className="text-[16px] font-medium text-gray-500 hover:text-gray-600 dark:hover:text-white hover:border-t border-t-[var(--foreground)]"
        >
          <p className="mt-[20px]">{tab}</p>
        </a>
      ))}
    </div>
  );
}
