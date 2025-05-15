"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { API } from "@/utils/api";
import { parseJwt } from "@/utils/JwtParse";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { HighlightType, StoryType } from "@/lib/types";
import { StoryViewer } from "../../users/_components/Storyviewo-delete";

type GroupedStory = {
  user: {
    _id: string;
    username: string;
    avatarImage: string;
  };
  stories: StoryType[];
};

const MyStoriesAndHighlight = () => {
  const [stories, setStories] = useState<StoryType[]>([]);
  const [highlights, setHighlights] = useState<HighlightType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [highlightTitle, setHighlightTitle] = useState("");
  const [selectedStories, setSelectedStories] = useState<StoryType[]>([]);
  const [selectedHighlightGroup, setSelectedHighlightGroup] =
    useState<GroupedStory | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const decode = parseJwt(token || "undefined");
  const userId = decode?.id;
  const username = decode?.username || "unknown";
  const avatarImage = decode?.avatarImage || "/default-avatar.png";
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [storyRes, highlightRes] = await Promise.all([
          axios.get(`${API}/api/story/all/${userId}`),
          axios.get(`${API}/api/highlight/user/${userId}`),
        ]);
        setStories(storyRes.data);
        setHighlights(highlightRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const handleToggleStory = (story: StoryType) => {
    setSelectedStories((prev) =>
      prev.find((s) => s._id === story._id)
        ? prev.filter((s) => s._id !== story._id)
        : [...prev, story]
    );
  };

  const handleCreateHighlight = async () => {
    if (!highlightTitle.trim() || selectedStories.length === 0) return;

    try {
      const res = await axios.post(`${API}/api/highlight/add`, {
        userId,
        title: highlightTitle.trim(),
        stories: selectedStories.map((s) => s._id),
      });

      setHighlights((prev) => [...prev, res.data]);
      setHighlightTitle("");
      setSelectedStories([]);
      setShowHighlightModal(false);
    } catch (err) {
      console.error("Failed to create highlight:", err);
    }
  };

  return (
    <div className="w-screen flex flex-col items-center mt-6">
      <div className="w-[1125px]">
        <div className="flex gap-4 items-center mt-6">
          {/* Create New */}
          <div
            className="w-[89px] flex flex-col items-center cursor-pointer"
            onClick={() => setShowHighlightModal(true)}
          >
            <div className="w-[89px] h-[89px] rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center">
              <div className="w-[77px] h-[77px] rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <Plus className="w-16" />
              </div>
            </div>
            <div>New</div>
          </div>

          {/* Highlight List */}
          <div className="flex gap-4 overflow-x-auto">
            {highlights.map((highlight) => (
              <div
                key={highlight._id}
                className="w-[89px] flex-shrink-0 flex flex-col items-center cursor-pointer"
                onClick={() =>
                  setSelectedHighlightGroup({
                    user: { _id: userId, username, avatarImage },
                    stories: highlight.stories,
                  })
                }
              >
                <div className="w-[89px] h-[89px] rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                  <div className="w-[77px] h-[77px] rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md flex items-center justify-center" />
                </div>
                <div className="truncate max-w-[89px] text-sm">
                  {highlight.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {showHighlightModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#353535] p-6 rounded-xl shadow-lg w-[300px]">
              <h2 className="text-lg font-semibold mb-4">New Highlight</h2>
              <Input
                type="text"
                value={highlightTitle}
                onChange={(e) => setHighlightTitle(e.target.value)}
                placeholder="Highlight name"
                className="w-full mb-4 dark:bg-[#191919]"
              />
              <div className="grid grid-cols-3 gap-2 mb-4">
                {stories.map((story) => (
                  <div
                    key={story._id}
                    onClick={() => handleToggleStory(story)}
                    className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                      selectedStories.find((s) => s._id === story._id)
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-[100px] object-cover hover:scale-110 transition-transform"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowHighlightModal(false)}>
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={handleCreateHighlight}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedHighlightGroup && (
        <StoryViewer
          storyGroup={selectedHighlightGroup}
          stories={[selectedHighlightGroup]}
          setSelectedStoryGroup={setSelectedHighlightGroup}
          userId={userId}
        />
      )}
    </div>
  );
};

export default MyStoriesAndHighlight;
