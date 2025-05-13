type NavigationArrowsProps = {
  currentIndex: number;
  stories: { _id: string; imageUrl: string }[];
  storiesList: GroupedStory[];
  setCurrentIndex: (index: number) => void;
  setSelectedStoryGroup: (group: GroupedStory | null) => void;
  currentGroup: GroupedStory;
};

type GroupedStory = {
  user: { _id: string; username: string; avatarImage: string };
  stories: { _id: string; imageUrl: string }[];
};

export function NavigationArrows({
  currentIndex,
  stories,
  storiesList,
  setCurrentIndex,
  setSelectedStoryGroup,
  currentGroup,
}: NavigationArrowsProps) {
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    const isLastStory = currentIndex >= stories.length - 1;
    if (!isLastStory) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const currentGroupIndex = storiesList.findIndex(
        (g) => g.user._id === currentGroup.user._id
      );
      const nextGroup = storiesList[currentGroupIndex + 1];
      if (nextGroup) {
        setSelectedStoryGroup(nextGroup);
        setCurrentIndex(0);
      } else {
        setSelectedStoryGroup(null);
      }
    }
  };

  return (
    <>
      <div
        className="absolute left-4 text-white text-2xl cursor-pointer z-10"
        onClick={handlePrev}
      >
        ‹
      </div>
      <div
        className="absolute right-4 text-white text-2xl cursor-pointer z-10 "
        onClick={handleNext}
      >
        ›
      </div>
    </>
  );
}
