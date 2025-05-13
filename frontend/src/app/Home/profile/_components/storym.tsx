"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/utils/api";
import { StoryAvatar } from "@/components/stories/_components/StoryAvatar";
import { StoryViewer } from "@/components/stories/_components/StoryViewer";

type StoriesBarProps = {
  userId: { id: string } | null;
  username: { username: string } | null;
};

type UserInfo = {
  _id: string;
  username: string;
  avatarImage: string;
};

type StoryItem = {
  _id: string;
  imageUrl: string;
  createdAt?: string;
  expiresAt?: string;
};

type GroupedStory = {
  user: UserInfo;
  stories: StoryItem[];
};

export function StoriesBar({ userId, username }: StoriesBarProps) {
  const [myStoryGroup, setMyStoryGroup] = useState<GroupedStory | null>(null);
  const [selectedStoryGroup, setSelectedStoryGroup] =
    useState<GroupedStory | null>(null);
  const [viewedStoryIds, setViewedStoryIds] = useState<string[]>([]);

  const fetchStories = async () => {
    if (!userId?.id) return;
    try {
      const res = await axios.get(API + `/api/Getstory/${userId.id}`);
      const storiesData: GroupedStory[] = res.data;

      const myStory = storiesData.find(
        (storyGroup) => storyGroup.user._id === userId.id
      );

      if (!myStory) {
        setMyStoryGroup(null);
        return;
      }

      const storyIds = myStory.stories.map((story) => story._id);

      const viewRes = await axios.post(API + `/api/storyHasView`, {
        userId: userId.id,
        storyIds,
      });

      const viewedStoryIds: string[] = viewRes.data.viewedStoryIds;
      setViewedStoryIds(viewedStoryIds);

      const updatedStories = myStory.stories.map((story) => ({
        ...story,
        viewed: viewedStoryIds.includes(story._id),
      }));

      setMyStoryGroup({ ...myStory, stories: updatedStories });
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [userId?.id]);

  if (!myStoryGroup) return null;

  return (
    <div className="flex gap-1 overflow-x-auto py-4 px-4 scrollbar-hide">
      <StoryAvatar
        key={myStoryGroup.user._id}
        user={myStoryGroup.user}
        hasViewedAll={myStoryGroup.stories.every((story) =>
          viewedStoryIds.includes(story._id)
        )}
        onClick={() => setSelectedStoryGroup(myStoryGroup)}
      />

      {selectedStoryGroup && (
        <StoryViewer
          storyGroup={selectedStoryGroup}
          stories={[myStoryGroup]} // зөвхөн өөрийн story дамжуулна
          setSelectedStoryGroup={setSelectedStoryGroup}
          userId={userId?.id || ""}
        />
      )}
    </div>
  );
}
