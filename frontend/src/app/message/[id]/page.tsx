"use client";

import { Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Chat from '../component/chat'

const Page = () => {
   
    const [users, setUsers] = useState<{ username: string }[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchValue]);

    useEffect(() => {
        const fetchUser = async () => {
            if (!debouncedSearch) {
                setUsers([]);
                return;
            }
            try {
                const res = await axios.get(`http://localhost:9000/api/auth/messages/${debouncedSearch}`);
                setUsers(res.data);
                console.log(res.data);
            } catch (error) {
                console.error(error);
                setUsers([]);
            }
        };
        fetchUser();
    }, [debouncedSearch]);

    const select = useCallback((name: string) => {
        setSelectedUsers(prev =>
            prev.includes(name)
                ? prev.filter(user => user !== name)
                : [...prev, name]
        );
    }, [setSelectedUsers]);
    const chat = ()=>{
        
    }
console.log(selectedUsers);

    return (
        <div className="flex items-center justify-center w-full bg-black h-[100vh]">
            <div className="flex items-center flex-col gap-[10px]">
                <div className="rounded-full p-[15px] border border-white w-[200px] h-[200px] flex items-center justify-center">
                    <Send size={100} strokeWidth="default" className='text-white' />
                </div>
                <h1 className='text-white'>Your messages</h1>
                <p className="text-white/50">Send a message to start a chat.</p>

                <Dialog>
                    <DialogTrigger>
                        <Button className="bg-blue-500 text-white">Send message</Button>
                    </DialogTrigger>

                    <DialogContent className='bg-black'>
                        <DialogHeader>
                            <p className="text-center">New message</p>
                        </DialogHeader>

                        <div className="flex flex-col gap-[15px]">
                            <Separator />
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-white">To:</p>
                                {selectedUsers.length > 0 && selectedUsers.map((selectedUser, index) => (
                                    <div key={index} className='py-[5px] px-[10px] bg-gray-800 rounded-[10px] text-white text-sm'>
                                        {selectedUser}
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

                        {debouncedSearch === '' ? null : (
                            users.length === 0 ? (
                                <div className="text-center text-white/50">User not found</div>
                            ) : (
                                <div className="flex flex-col gap-2 mt-4">
                                    {users.map((user, index) => {
                                        const isSelected = selectedUsers.includes(user.username);
                                        return (
                                            <div
                                                key={index}
                                                className={`p-2 border rounded-lg hover:bg-white/30 flex justify-between items-center cursor-pointer ${isSelected ? 'bg-white/20' : ''}`}
                                                onClick={() => select(user.username)}
                                            >
                                                <span className="text-white">{user.username}</span>
                                                {isSelected ? (
                                                    <div className='border w-[20px] h-[20px] rounded-full border-white flex items-center justify-center bg-white'>
                                                        <Check className='text-black w-[14px] h-[14px]' />
                                                    </div>
                                                ) : (
                                                    <div className='border rounded-full w-[20px] h-[20px]'></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        )}
                        <Button className='bg-blue-500' onClick={chat}>Chat</Button>
                    </DialogContent>
                </Dialog>
<Chat />
            </div>
        </div>
    );
};

export default Page;
