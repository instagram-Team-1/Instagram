"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API } from "@/utils/api";
import { StoryView } from "../../components/stories/_components/story-view";
import { Pause, Play, MoreVertical } from "lucide-react";
import { ProgressBar } from "../../components/stories/_components/_components/ProgressBar";
import { NavigationArrows } from "../../components/stories/_components/_components/NavigationArrows";
import { GroupedStory } from "@/lib/types";

type StoryViewerProps = {
  storyGroup: GroupedStory;
  stories: GroupedStory[];
  setSelectedStoryGroup: (group: GroupedStory | null) => void;
  userId: string;
};

function getTimeAgo(dateString: string) {
  const createdAt = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function StoryViewer({
  storyGroup,
  stories,
  setSelectedStoryGroup,
  userId,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchViewers = async (storyId: string) => {
    try {
      await axios.post(`${API}/api/ViewStory`, { userId, storyId });
    } catch (error) {
      console.error("Failed to fetch viewers:", error);
    }
  };

  const handleDeleteStory = async () => {
    const story = storyGroup.stories[currentIndex];

    try {
      await axios.delete(
        `${API}/api/highlight/${storyGroup._id}/story/${story._id}`
      );

      const updatedStories = storyGroup.stories.filter(
        (s) => s._id !== story._id
      );

      if (updatedStories.length > 0) {
        storyGroup.stories = updatedStories;
        setCurrentIndex(0);
      } else {
        setSelectedStoryGroup(null);
      }

      setShowOptions(false);
    } catch (error) {
      console.error("Failed to remove story from highlight:", error);
    }
  };

  useEffect(() => {
    const story = storyGroup.stories[currentIndex];
    if (story?.createdAt) {
      fetchViewers(story._id);
    }
  }, [userId, storyGroup, currentIndex]);

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

  const currentStory = storyGroup.stories[currentIndex];
  const timeAgo =
    currentStory?.createdAt !== undefined
      ? getTimeAgo(currentStory.createdAt)
      : "";

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <ProgressBar
        stories={storyGroup.stories}
        currentIndex={currentIndex}
        progress={progress}
      />

      <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className="bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded transition"
        >
          {isPaused ? <Play /> : <Pause />}
        </button>

        <div className="relative">
          <div
            className="text-white text-2xl cursor-pointer"
            onClick={() => setShowOptions((prev) => !prev)}
          >
            <MoreVertical />
          </div>

          {showOptions && (
            <div className="absolute right-0 mt-2 bg-pink-100 text-red-600 text-center text-bold rounded shadow-md w-32 p-2">
              <button
                onClick={handleDeleteStory}
                className="w-full text-left px-2 py-1 hover:bg-gray-600 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div
          className="text-white text-xl cursor-pointer"
          onClick={() => setSelectedStoryGroup(null)}
        >
          ✕
        </div>
      </div>

      <StoryView
        imageUrl={currentStory.imageUrl}
        username={storyGroup.user.username}
        avatarImage={storyGroup.user.avatarImage}
        timeAgo={timeAgo}
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
