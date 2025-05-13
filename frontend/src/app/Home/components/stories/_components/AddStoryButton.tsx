import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type AddStoryButtonProps = {
  username: string;
  isLoading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AddStoryButton({
  username,
  isLoading,
  onFileChange,
}: AddStoryButtonProps) {
  return (
    <div className="flex flex-col items-center min-w-[70px]">
      <div className="relative">
        <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500">
          <Avatar className="border-2 border-black w-14 h-14">
            <AvatarImage />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </div>
        <label className="absolute inset-0 flex items-center justify-center text-white text-2xl cursor-pointer">
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
          ) : (
            "+"
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </label>
      </div>
      <span className="text-xs text-white mt-2 text-center w-16 truncate">
        {username}
      </span>
    </div>
  );
}
