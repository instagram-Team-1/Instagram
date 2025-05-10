type ProgressBarProps = {
  stories: { _id: string; imageUrl: string }[];
  currentIndex: number;
  progress: number;
};

export function ProgressBar({
  stories,
  currentIndex,
  progress,
}: ProgressBarProps) {
  return (
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
                i < currentIndex
                  ? "100%"
                  : i === currentIndex
                  ? `${progress}%`
                  : "0%",
            }}
          />
        </div>
      ))}
    </div>
  );
}
