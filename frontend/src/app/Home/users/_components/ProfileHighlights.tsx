import React from "react";

type Props = {
  onClick: () => void;
};

export default function ProfileHighlights({ onClick }: Props) {
  return (
    <div className="w-full">
      <div
        role="tab"
        className="w-[89px] flex flex-col items-center cursor-pointer"
        onClick={onClick}
      >
        <div className="w-[89px] h-[89px] rounded-full border border-gray-300 flex items-center justify-center">
          <div className="w-[77px] h-[77px] rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            {/* Icon can be placed here */}
          </div>
        </div>
      </div>
    </div>
  );
}
