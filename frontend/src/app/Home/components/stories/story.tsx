"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API } from "@/utils/api";
import { StoryAvatar } from "./_components/StoryAvatar";
import { AddStoryButton } from "./_components/AddStoryButton";
import { StoryViewer } from "./_components/StoryViewer";
import { StoryAvatarSkeleton } from "./_components/StoryLoading";

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
  viewed?: boolean;
};

type GroupedStory = {
  user: UserInfo;
  stories: StoryItem[];
};

export function StoriesBar({ userId, username }: StoriesBarProps) {
  const [stories, setStories] = useState<GroupedStory[]>([]);
  const [selectedStoryGroup, setSelectedStoryGroup] =
    useState<GroupedStory | null>(null);
  const [viewedStoryIds, setViewedStoryIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchStories = useCallback(async () => {
    if (!userId?.id) return;
    setIsLoading(true);

    try {
      const res = await axios.get(API + `/api/Getstory/${userId.id}`);
      const data: GroupedStory[] = res.data;

      const allStoryIds = data.flatMap((group) =>
        group.stories.map((story) => story._id)
      );

      const viewedRes = await axios.post(API + `/api/storyHasView`, {
        userId: userId.id,
        storyIds: allStoryIds,
      });

      const viewedIds = new Set<string>(viewedRes.data.viewedStoryIds);

      const finalData = data.map((group) => ({
        ...group,
        stories: group.stories.map((story) => ({
          ...story,
          viewed: viewedIds.has(story._id),
        })),
      }));

      setStories(finalData);
      setViewedStoryIds(viewedIds);
      setIsLoading(false);
      
    } catch (err) {
      console.error("❌ Failed to fetch stories:", err);
    } finally {
      setIsLoading(false); // ✅ Заавал энд хийнэ
    }
  }, [userId?.id]);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Story-Instagram");

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("❌ Upload error:", err);
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
    } catch (err) {
      console.error("❌ Failed to post story:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

 

  return (
    <div className="flex gap-1 overflow-x-auto py-4 px-4 scrollbar-hide">
      <AddStoryButton
        username={username?.username || "You"}
        isLoading={isLoading}
        onFileChange={handleFileChange}
      />

      {isLoading
        ? [...Array(5)].map((_, idx) => <StoryAvatarSkeleton key={idx} />)
        : stories
            .filter((group) => group.user._id !== userId?.id)
            .map((group) => (
              <StoryAvatar
                key={group.user._id}
                user={group.user}
                hasViewedAll={group.stories.every((story) => story.viewed)}
                onClick={() => setSelectedStoryGroup(group)}
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
