"use client";

type Story = {
  id: string;
  avatar: string;
  username: string;
};

type Props = {
  stories: Story[];
  onClick: (story: Story) => void;
};

const StoriesPath = ({ stories, onClick }: Props) => {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 py-2">
      {stories.map((story) => (
        <div
          key={story.id}
          onClick={() => onClick(story)}
          className="cursor-pointer flex flex-col items-center"
        >
          <img
            src={story.avatar}
            alt={`${story.username}'s story`}
            className="w-16 h-16 rounded-full border-2 border-pink-500 object-cover"
          />
          <p className="text-xs text-white text-center mt-1">
            {story.username}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StoriesPath;
