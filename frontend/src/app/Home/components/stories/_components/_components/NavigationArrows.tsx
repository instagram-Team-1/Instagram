import React from "react";
import { GroupedStory } from "@/lib/types";

type NavigationArrowsProps = {
  currentIndex: number;
  stories: { _id: string; imageUrl: string }[];
  storiesList: GroupedStory[];
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectedStoryGroup: (group: GroupedStory | null) => void;
  currentGroup: GroupedStory;
};

export function NavigationArrows({
  currentIndex,
  stories,
  storiesList,
  setCurrentIndex,
  setSelectedStoryGroup,
  currentGroup,
}: NavigationArrowsProps) {
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      const currentGroupIndex = storiesList.findIndex(
        (g) => g._id === currentGroup._id
      );
      const prevGroup = storiesList[currentGroupIndex - 1];

      if (prevGroup) {
        setSelectedStoryGroup(prevGroup);
        setCurrentIndex(prevGroup.stories.length - 1);
      }
    }
  };

  const goNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const currentGroupIndex = storiesList.findIndex(
        (g) => g._id === currentGroup._id
      );
      const nextGroup = storiesList[currentGroupIndex + 1];

      if (nextGroup) {
        setSelectedStoryGroup(nextGroup);
        setCurrentIndex(0);
      }
    }
  };

  return (
    <div className="absolute inset-0 flex justify-between items-center px-2 z-30">
      <button
        onClick={goPrev}
        className="bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded"
      >
        Prev
      </button>
      <button
        onClick={goNext}
        className="bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded"
      >
        Next
      </button>
    </div>
  );
}
