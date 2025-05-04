// "use client";

// import { Send, Check } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Separator } from '@/components/ui/separator';
// import { Input } from '@/components/ui/input';
// import { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// type User = {
//   username: string;
//   _id: string;
// };
// const addGroup = () => {
//   const currentId = localStorage.getItem('id');
//   const parsedCurrentId = currentId ? JSON.parse(currentId).id : null; 
//   const [users, setUsers] = useState<User[]>([]);
//   const [searchValue, setSearchValue] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');
//   const [selectedUsers, setSelectedUsers] = useState<{ name: string; id: string }[]>([]);
//   const router = useRouter();
//   useEffect(() => {
//     // Initialize selectedUsers with the logged-in user if available
//     if (parsedCurrentId) {
//       setSelectedUsers((prev) => [
//         ...prev,
//         { name: "Your Name", id: parsedCurrentId }, // Replace "Your Name" with the actual user's name if available
//       ]);
//     }
//   }, [parsedCurrentId]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchValue);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [searchValue]);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!debouncedSearch) {
//         setUsers([]);
//         return;
//       }
//       try {
//         const res = await axios.get(`http://localhost:9000/api/auth/messages/${debouncedSearch}`);
//         const filteredUsers = res.data.filter((user: User) => user._id !== parsedCurrentId); // Exclude the logged-in user
//         setUsers(filteredUsers);
//       } catch (error) {
//         console.error(error);
//         setUsers([]);
//       }
//     };
//     fetchUser();
//   }, [debouncedSearch]);
  

//   const select = useCallback((name: string, id: string) => {
//     setSelectedUsers((prev) => {
//       const exists = prev.find(user => user.id === id);
//       return exists
//         ? prev.filter(user => user.id !== id)
//         : [...prev, { name, id }];
//     });
//   }, []);

//   const createChatRoom = async () => {
//     const data = await axios.post('http://localhost:9000/api/auth/Room', selectedUsers);
//     if (data.data === 'room created') {
//       router.push('/chat');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center w-full bg-black h-[100vh]">
//       <div className="flex items-center flex-col gap-[10px]">
//         <div className="rounded-full p-[15px] border border-white w-[200px] h-[200px] flex items-center justify-center">
//           <Send size={100} strokeWidth="default" className="text-white" />
//         </div>
//         <h1 className="text-white">Your messages</h1>
//         <p className="text-white/50">Send a message to start a chat.</p>

//         <Dialog>
//           <DialogTrigger>
//             <Button className="bg-blue-500 text-white">Send message</Button>
//           </DialogTrigger>

//           <DialogContent className="bg-black">
//             <DialogHeader>
//               <p className="text-center text-white">New message</p>
//             </DialogHeader>

//             <div className="flex flex-col gap-[15px]">
//               <Separator />
//               <div className="flex items-center gap-2 flex-wrap">
//                 <p className="text-white">To:</p>
//                 {selectedUsers.length > 0 &&
//   selectedUsers
//     .filter((selectedUser) => selectedUser.id !== currentId) // Exclude logged-in user
//     .map((selectedUser, index) => (
//       <div
//         key={index}
//         className="py-[5px] px-[10px] bg-gray-800 rounded-[10px] text-white text-sm"
//       >
//         {selectedUser.name}
//       </div>
//     ))}
//                 <Input
//                   placeholder="Search person"
//                   value={searchValue}
//                   onChange={(e) => setSearchValue(e.target.value)}
//                   className="w-full sm:w-auto"
//                 />
//               </div>
//               <Separator />
//             </div>

//             {debouncedSearch === "" ? null : users.length === 0 ? (
//               <div className="text-center text-white/50">User not found</div>
//             ) : (
//               <div className="flex flex-col gap-2 mt-4">
//                 {users.map((user, index) => {
//                   const isSelected = selectedUsers.some(
//                     (selected) => selected.id === user._id
//                   );
//                   return (
//                     <div
//                       key={index}
//                       className={`p-2 border rounded-lg hover:bg-white/30 flex justify-between items-center cursor-pointer ${
//                         isSelected ? "bg-white/20" : ""
//                       }`}
//                       onClick={() => select(user.username, user._id)}
//                     >
//                       <span className="text-white">{user.username}</span>
//                       {isSelected ? (
//                         <div className="border w-[20px] h-[20px] rounded-full border-white flex items-center justify-center bg-white">
//                           <Check className="text-black w-[14px] h-[14px]" />
//                         </div>
//                       ) : (
//                         <div className="border rounded-full w-[20px] h-[20px]"></div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {/* Hook up to "create chat" here */}
//             <Button className="bg-blue-500" onClick={createChatRoom}>
//               Chat
//             </Button>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default addGroup;