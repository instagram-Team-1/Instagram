import React from "react";

type ActivePanelType = "none" | "search" | "messages" | "notifications";

interface SearchButtonPanelProps {
  activePanel: ActivePanelType;
}

function SearchButtonPanel({ activePanel }: SearchButtonPanelProps) {
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
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-md border dark:bg-black"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchButtonPanel;
