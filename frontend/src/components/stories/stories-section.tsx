import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import FileUploadButton from "./file-upload-button";
import { StoryViewer } from "./story-viewer";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { useCurrentUser } from "@/hooks/use-current-user";
import axios from "axios";
import { API } from "@/utils/api";

interface Story {
  _id?: string;
  name: string;
  img: string;
  isLive?: boolean;
  timestamp: number;
  userId: string;
}

export function StoriesBar() {
  const { user } = useCurrentUser();
  const [storiesList, setStoriesList] = useState<Story[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [viewingStories, setViewingStories] = useState<Story[]>([]);

  const fetchStories = async () => {
    const res = await axios.get(API+"/api/story");
    setStoriesList(res.data);
  };

  useEffect(() => { 
    fetchStories();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      const newStory = {
        img: uploadedUrl,
        userId: user.id,
      };

      await axios.post(API+"/api/story", newStory);
      fetchStories();
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDeleteStory = async (index: number) => {
    const storyToDelete = viewingStories[index];
    if (!storyToDelete._id) return;

    await axios.delete(API+`/api/story/${storyToDelete._id}`);
    fetchStories();

    const remaining = viewingStories.filter((_, i) => i !== index);
    setViewingStories(remaining);
    if (remaining.length === 0) setShowModal(false);
  };

  const yourStories = storiesList.filter((s) => s.userId === user?.id);

  return (
    <>
      <div className="flex gap-1 overflow-x-auto py-4 px-4 scrollbar-hide">
        {/* Your story */}
        <div
          className="flex flex-col items-center min-w-[70px] cursor-pointer"
          onClick={() => {
            if (yourStories.length > 0) {
              setViewingStories(yourStories);
              setShowModal(true);
            }
          }}
        >
          <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500">
            <FileUploadButton
              onChange={handleUpload}
              className="w-14 h-14 border-2 border-black rounded-full overflow-hidden bg-gray-800 flex items-center justify-center text-white text-xl"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="your profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                "+"
              )}
            </FileUploadButton>
          </div>
          <span className="text-xs text-white mt-2 w-16 text-center truncate">
            {user?.name || "Your Story"}
          </span>
        </div>

        {/* Other users */}
        {storiesList
          .filter((story) => story.userId !== user?.id)
          .map((story, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[70px] cursor-pointer"
              onClick={() => {
                const userStories = storiesList.filter(
                  (s) => s.userId === story.userId
                );
                setViewingStories(userStories);
                setShowModal(true);
              }}
            >
              <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500">
                <Avatar className="border-2 border-black w-14 h-14">
                  <AvatarImage src={story.img} alt={story.name} />
                  <AvatarFallback>{story.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs text-white mt-2 w-16 text-center truncate">
                {story.name}
              </span>
            </div>
          ))}
      </div>

      {showModal && (
        <StoryViewer
          stories={viewingStories}
          initialIndex={0}
          onClose={() => setShowModal(false)}
          onDeleteStory={handleDeleteStory}
        />
      )}
    </>
  );
}
