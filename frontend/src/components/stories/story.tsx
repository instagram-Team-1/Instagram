"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/utils/api";
import { StoryAvatar } from "./_components/StoryAvatar";
import { AddStoryButton } from "./_components/AddStoryButton";
import { StoryViewer } from "./_components/StoryViewer";

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
  const [stories, setStories] = useState<GroupedStory[]>([]);
  const [selectedStoryGroup, setSelectedStoryGroup] =
    useState<GroupedStory | null>(null);
  const [viewedStoryIds, setViewedStoryIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStories = async () => {
    if (!userId?.id) return;
    try {
      const res = await axios.get(API + `/api/Getstory/${userId.id}`);
      const storiesData = res.data;

      const storyIds = storiesData.flatMap((userStory: any) =>
        userStory.stories.map((story: any) => story._id)
      );

      const viewRes = await axios.post(API + `/api/storyHasView`, {
        userId: userId.id,
        storyIds,
      });

      const viewedStoryIds: string[] = viewRes.data.viewedStoryIds;
      setViewedStoryIds(viewedStoryIds);

      const storiesWithViewedFlag = storiesData.map((userStory: any) => {
        const updatedStories = userStory.stories.map((story: any) => ({
          ...story,
          viewed: viewedStoryIds.includes(story._id),
        }));
        return { ...userStory, stories: updatedStories };
      });

      setStories(storiesWithViewedFlag);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Story-Instagram");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const imageUrl = await handleImageUpload(file);
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(API + `/api/story/${userId?.id}`, { imageUrl });
      await fetchStories();
    } catch (error) {
      console.error("Failed to create story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [userId?.id]);

  return (
    <div className="flex gap-1 overflow-x-auto py-4 px-4 scrollbar-hide">
      {stories.length > 0 && (
        <AddStoryButton
          username={username?.username || "Username"}
          isLoading={isLoading}
          onFileChange={handleFileChange}
        />
      )}

      {stories
        .filter((group) => group.user._id !== userId?.id)
        .map((group) => (
          <StoryAvatar
            key={group.user._id}
            user={group.user}
            hasViewedAll={group.stories.every((story) =>
              viewedStoryIds.includes(story._id)
            )}
            onClick={() => {
              setSelectedStoryGroup(group);
            }}
          />
        ))}

      {selectedStoryGroup && (
        <StoryViewer
          storyGroup={selectedStoryGroup}
          stories={stories}
          setSelectedStoryGroup={setSelectedStoryGroup}
          userId={userId?.id || ""}
        />
      )}
    </div>
  );
}
