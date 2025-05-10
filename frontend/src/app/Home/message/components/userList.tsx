'use client';
import { Check } from 'lucide-react';

type User = {
  username: string;
  _id: string;
};

type Props = {
  users: User[];
  selectedUsers: { name: string; id: string }[];
  onSelect: (name: string, id: string) => void;
};

export const UserList = ({ users, selectedUsers, onSelect }: Props) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      {users.map((user, i) => {
        const isSelected = selectedUsers.some((sel) => sel.id === user._id);
        return (
          <div
            key={i}
            className={`p-2 border rounded-lg hover:bg-white/30 flex justify-between items-center cursor-pointer ${isSelected ? 'bg-white/20' : ''}`}
            onClick={() => onSelect(user.username, user._id)}
          >
            <span className="text-white">{user.username}</span>
            {isSelected ? (
              <div className="border w-[20px] h-[20px] rounded-full border-white flex items-center justify-center bg-white">
                <Check className="text-black w-[14px] h-[14px]" />
              </div>
            ) : (
              <div className="border rounded-full w-[20px] h-[20px]"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
