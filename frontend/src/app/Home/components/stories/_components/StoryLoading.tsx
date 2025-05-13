export function StoryAvatarSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-16 gap-1 animate-pulse">
      <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-700" />
      <div className="w-10 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
  );
}
