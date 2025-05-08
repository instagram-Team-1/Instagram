import React, { useState, useEffect, useRef } from "react";

interface Story {
  name: string;
  img: string;
  isLive?: boolean;
  timestamp: number;
}

interface StoryViewerProps {
  stories: Story[];
  onClose: () => void;
  initialIndex: number;
  onDeleteStory: (index: number) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  onClose,
  initialIndex,
  onDeleteStory,
}) => {
  const [current, setCurrent] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startRef = useRef<number>(performance.now());

  const STORY_DURATION = 5000;

  useEffect(() => {
    if (stories.length === 0) {
      onClose();
      return;
    }

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const percent = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(percent);

      if (percent < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        goToNext();
      }
    };

    startRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [current, stories.length]);

  const goToNext = () => {
    if (current < stories.length - 1) {
      setCurrent((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPrev = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    const width = window.innerWidth;
    if (clientX < width / 2) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteStory(current);

    if (current >= stories.length - 1) {
      setCurrent((prev) => Math.max(prev - 1, 0));
    }
    setProgress(0);
  };

  const story = stories[current];

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onClick={handleTap}
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 w-full px-2 py-2 z-50 flex gap-1">
        {stories.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100 linear"
              style={{
                width:
                  i < current ? "100%" : i === current ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Story image */}
      <div className="flex-1 flex items-center justify-center relative">
        <img
          src={story.img}
          alt={story.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Reply input */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4">
        <input
          type="text"
          placeholder={`Reply to ${story.name}...`}
          className="w-full px-4 py-2 rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20 text-sm placeholder-white outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 text-white text-3xl font-light z-50"
      >
        &times;
      </button>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-4 left-4 text-white text-sm bg-red-600 px-3 py-1 rounded z-50"
      >
        Delete
      </button>
    </div>
  );
};
