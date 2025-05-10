import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API } from "@/utils/api";
import { StoryView } from "@/components/stories/_components/story-view";
import { Pause, Play } from "lucide-react";
import { ProgressBar } from "./_components/ProgressBar";
import { NavigationArrows } from "./_components/NavigationArrows";

type StoryViewerProps = {
  storyGroup: GroupedStory;
  stories: GroupedStory[];
  setSelectedStoryGroup: (group: GroupedStory | null) => void;
  userId: string;
};

type GroupedStory = {
  user: { _id: string; username: string; avatarImage: string };
  stories: { _id: string; imageUrl: string }[];
};

export function StoryViewer({
  storyGroup,
  stories,
  setSelectedStoryGroup,
  userId,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Story-г API-аас татах
  const fetchViewers = async (storyId: string) => {
    try {
      await axios.post(`${API}/api/ViewStory`, { userId, storyId });
    } catch (error) {
      console.error("Failed to fetch viewers:", error);
    }
  };

  useEffect(() => {
    if (storyGroup.stories[currentIndex]) {
      const storyId = storyGroup.stories[currentIndex]._id;
      fetchViewers(storyId);
    }
  }, [userId, storyGroup, currentIndex]);

  // Story progress-г удирдах
  useEffect(() => {
    if (!storyGroup || isPaused) return;

    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [storyGroup, currentIndex, isPaused]);

  // Progress дуусахад дараагийн story эсвэл group руу шилжих
  useEffect(() => {
    if (progress < 100) return;

    const isLastStoryInGroup = currentIndex >= storyGroup.stories.length - 1;
    if (!isLastStoryInGroup) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const currentGroupIndex = stories.findIndex(
        (g) => g.user._id === storyGroup.user._id
      );
      const nextGroup = stories[currentGroupIndex + 1];

      if (nextGroup) {
        setSelectedStoryGroup(nextGroup);
        setCurrentIndex(0);
      } else {
        setSelectedStoryGroup(null);
      }
    }
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <ProgressBar
        stories={storyGroup.stories}
        currentIndex={currentIndex}
        progress={progress}
      />
      <button
        onClick={() => setIsPaused((prev) => !prev)}
        className="absolute top-4 right-10 bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded z-50 transition"
      >
        {isPaused ? <Play /> : <Pause />}
      </button>
      <div
        className="absolute top-4 right-4 text-white text-xl cursor-pointer z-50"
        onClick={() => setSelectedStoryGroup(null)}
      >
        ✕
      </div>
      <StoryView
        imageUrl={storyGroup.stories[currentIndex].imageUrl}
        username={storyGroup.user.username}
        avatarImage={storyGroup.user.avatarImage}
        timeAgo={"1h ago"}
      />
      <NavigationArrows
        currentIndex={currentIndex}
        stories={storyGroup.stories}
        storiesList={stories}
        setCurrentIndex={setCurrentIndex}
        setSelectedStoryGroup={setSelectedStoryGroup}
        currentGroup={storyGroup}
      />
    </div>
  );
}
