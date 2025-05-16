import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MessageCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API } from '@/utils/api';
import axios from 'axios';

type UserType = {
  _id: string;
  username: string;
  avatarImage?: string;
};

const ResponsiveHeader = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedSearch) return setUsers([]);
      try {
        const res = await axios.get(`${API}/api/auth/messages/${debouncedSearch}`);
        setUsers(res.data);
        setShowDropdown(true);
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [debouncedSearch]);

  const jump = () => {
    router.push('/Home/message');
  };

  const handleUserSelect = (username: string) => {
    router.push(`/Home/users/${username}`);
    setShowDropdown(false);
    setSearchValue('');
  };

  return (
    <div className="relative w-full flex flex-col h-fit lg:hidden items-center p-2">
      <div className="w-full flex items-center justify-between gap-2">
        <div className="font-bold text-xl text-white">Logo</div>
        <div className="relative w-full max-w-[300px]">
          <Input
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            onFocus={() => setShowDropdown(true)}
          />
      
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-md max-h-[250px] overflow-y-auto transition-all duration-200 transform origin-top scale-y-100 border-1 border-white z-100 bg-black">
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => handleUserSelect(user.username)}
                  >
                    {user.avatarImage ? (
                      <img
                        src={user.avatarImage}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 mr-3">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <span className="text-gray-800 font-medium">{user.username}</span>
                  </div>
                ))
              ) : debouncedSearch ? (
                <div className="px-4 py-2 text-center text-gray-500">No users found</div>
              ) : null}
            </div>
          )}
        </div>

        <button
          onClick={jump}
          className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors"
        >
          <MessageCircle className="text-blue-500" />
        </button>
      </div>
    </div>
  );
};

export default ResponsiveHeader;
