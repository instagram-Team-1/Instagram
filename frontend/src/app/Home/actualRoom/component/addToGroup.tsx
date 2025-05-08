'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { API } from '@/utils/api';
import { Input } from '@/components/ui/input';

const AddToGroup = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const params = useParams();
  const roomId = params?.id;
  const fetchUsers = async () => {
    if (!input.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await axios.post(`${API}/api/chat/users/${roomId}`, {
        username: input,
      });
      setResults(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleUserSelect = (user: any) => {
    if (selectedUsers.some(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const addUsersToGroup = async () => {
    const userIds = selectedUsers.map(user => user._id);

    try {
      const res = await axios.patch(`${API}/api/chat/add/${roomId}`, { userIds });
      console.log('Users added to group:', res.data);

      setInput('');
      setSelectedUsers([]);
      setResults([]);
      alert('Users added successfully to the group!');
    } catch (err) {
      console.error('Error adding users to group:', err);
    }
  };

  const closeModal = () => {
    setInput('');
    setSelectedUsers([]);
    setResults([]);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [input]);

  return (
    <div className="p-4">
      <h1 className="text-center text-xl font-bold mb-4">Add people</h1>

      <div className="mb-6">
        <p className="mb-1 font-medium">To:</p>
        <Input
          placeholder="Search by username"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
      </div>

      <p className="font-semibold">Suggested</p>
      <ul className="mt-2">
        {results.map((user: any) => (
          <li
            key={user._id}
            className={`py-1 px-2 hover:bg-gray-100 cursor-pointer ${selectedUsers.some(u => u._id === user._id) ? 'bg-blue-100' : ''}`}
            onClick={() => handleUserSelect(user)}
          >
            {user.username}
          </li>
        ))}
      </ul>

      {selectedUsers.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={addUsersToGroup}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Add to Group
          </button>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={closeModal}
          className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default AddToGroup;
