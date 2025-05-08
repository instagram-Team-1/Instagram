'use client';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

type Props = {
  selectedUsers: { name: string; id: string }[];
  currentUserId: string | null;
  searchValue: string;
  setSearchValue: (value: string) => void;
};

export const UserSearchInput = ({
  selectedUsers,
  currentUserId,
  searchValue,
  setSearchValue,
}: Props) => {
  return (
    <div className="flex flex-col gap-[15px]">
      <Separator />
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-white">To:</p>
        {selectedUsers
          .filter((user) => user.id !== currentUserId)
          .map((user, i) => (
            <div key={i} className="py-[5px] px-[10px] bg-gray-800 rounded-[10px] text-white text-sm">
              {user.name}
            </div>
          ))}
        <Input
          placeholder="Search person"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full sm:w-auto"
        />
      </div>
      <Separator />
    </div>
  );
};
