'use client';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API } from "@/utils/api";
import { useRouter } from "next/navigation";
import { UserSearchInput } from "./userSearchInput";
import { UserList } from '../components/userList';

type User = {
  username: string;
  _id: string;
};

export const NewMessageDialog = () => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{ name: string; id: string }[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('id');
    try {
      const parsed = stored ? JSON.parse(stored) : null;
      const id = typeof parsed === 'object' && parsed?.id ? parsed.id : stored;
      setCurrentUserId(id);
    } catch {
      setCurrentUserId(stored);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      setSelectedUsers((prev) => {
        const alreadyAdded = prev.some(user => user.id === currentUserId);
        return alreadyAdded ? prev : [...prev, { name: 'You', id: currentUserId }];
      });
    }
  }, [currentUserId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!debouncedSearch) return setUsers([]);
      try {
        const res = await axios.get(API + `/api/auth/messages/${debouncedSearch}`);
        const filtered = res.data.filter((user: User) => user._id !== currentUserId);
        setUsers(filtered);
      } catch {
        setUsers([]);
      }
    };
    fetchUser();
  }, [debouncedSearch, currentUserId]);

  const selectUser = useCallback((name: string, id: string) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((user) => user.id === id);
      return exists ? prev.filter((user) => user.id !== id) : [...prev, { name, id }];
    });
  }, []);

  const createChatRoom = async () => {
    const res = await axios.post(API + '/api/auth/Room', selectedUsers);
    if (res.data.message === "Room created successfully") {
      router.push(`/actualRoom/${res.data.roomId}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-blue-500 text-white">Send message</Button>
      </DialogTrigger>
      <DialogContent className="bg-black">
        <DialogHeader>
          <p className="text-center text-white">New message</p>
        </DialogHeader>

        <UserSearchInput
          selectedUsers={selectedUsers}
          currentUserId={currentUserId}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

        {debouncedSearch === '' ? null : users.length === 0 ? (
          <div className="text-center text-white/50">User not found</div>
        ) : (
          <UserList users={users} selectedUsers={selectedUsers} onSelect={selectUser} />
        )}

        <Button className="bg-blue-500 mt-4" onClick={createChatRoom}>
          Chat
        </Button>
      </DialogContent>
    </Dialog>
  );
};
