// "use client";

// import { useRef } from "react";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Plus } from "lucide-react";
// import { useRouter } from "next/navigation";

// export function StoriesBar() {
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const router = useRouter();

//   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // route руу явуулах, upload биш
//     const fileObjectUrl = URL.createObjectURL(file);
//     router.push(`/story-upload?preview=${encodeURIComponent(fileObjectUrl)}`);
//     sessionStorage.setItem("story_file", JSON.stringify(file)); // файл хадгалах
//   };

//   return (
//     <div className="flex gap-2 overflow-x-auto py-4 px-4 scrollbar-hide">
//       <div
//         className="flex flex-col items-center min-w-[70px] cursor-pointer"
//         onClick={() => inputRef.current?.click()}
//       >
//         <div className="relative">
//           <div className="p-[2px] rounded-full bg-gray-300 dark:bg-gray-700">
//             <Avatar className="border-2 border-black w-14 h-14">
//               <AvatarImage src="/avatars/your-avatar.jpg" alt="Your Story" />
//               <AvatarFallback>Y</AvatarFallback>
//             </Avatar>
//           </div>
//           <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-black">
//             <Plus className="w-3 h-3 text-white" />
//           </div>
//         </div>
//         <span className="text-xs text-white mt-2 text-center w-16 truncate">
//           Your Story
//         </span>
//         <input
//           type="file"
//           accept="image/*,video/*"
//           hidden
//           ref={inputRef}
//           onChange={handleFileSelect}
//         />
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import StoryModal from "./storymodal";
// import { Plus } from "lucide-react";
// import Image from "next/image";
// import CloudinaryUpload from "../ui/cloudinary-upload";

// type Story = {
//   _id: string;
//   media: string;
//   text?: string;
//   owner: string;
// };

// export function StoriesBar() {
//   const { data: session } = useSession();
//   const [stories, setStories] = useState<Story[]>([]);
//   const [selectedStory, setSelectedStory] = useState<Story | null>(null);

//   useEffect(() => {
//     const fetchStories = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/story/upload/${session?.user?.id}`
//         );
//         setStories(res.data);
//       } catch (err) {
//         console.error("Failed to fetch stories", err);
//       }
//     };

//     if (session?.user?.id) {
//       fetchStories();
//     }
//   }, [session]);

//   // Cloudinary-с upload хийсэн файлын URL-ийг backend рүү илгээж хадгалах функц
//   const handleImageUpload = async (cloudUrl: string) => {
//     const formData = new FormData();

//     // Cloudinary-с авсан URL-г илгээж байна
//     formData.append("backgroundMedia", cloudUrl);
//     formData.append("text", ""); // хүсвэл текст нэмэж болно

//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/story/upload`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${session?.user?.token}`,
//           },
//         }
//       );

//       // Backend-с буцаж ирсэн story-г нэмнэ
//       setStories((prev) => [...prev, res.data.savedStory]);
//     } catch (err) {
//       console.error("Story upload failed", err);
//       alert("Story upload амжилтгүй боллоо");
//     }
//   };

//   const triggerCloudinaryUpload = () => {
//     const input = document.getElementById(
//       "storyUploadInput"
//     ) as HTMLInputElement;
//     if (input) input.click();
//   };

//   return (
//     <>
//       {/* Cloudinary upload input (hidden) */}
//       <CloudinaryUpload onUpload={handleImageUpload} />

//       <div className="w-full border-t border-gray-800 bg-[#121212]">
//         <div className="flex gap-4 overflow-x-auto py-4 px-4 scrollbar-hide">
//           {/* Add story */}
//           <div
//             onClick={triggerCloudinaryUpload}
//             className="flex flex-col items-center min-w-[70px] cursor-pointer group"
//           >
//             <div className="relative w-14 h-14 p-[2px] rounded-full bg-white group-hover:scale-105 transition">
//               <Image
//                 src={(session?.user as any)?.image || "/default-avatar.png"}
//                 alt="Your Story"
//                 fill
//                 sizes="56px"
//                 className="rounded-full object-cover border-2 border-black"
//               />
//               <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-[2px]">
//                 <Plus className="text-white w-4 h-4" />
//               </div>
//             </div>
//             <span className="text-xs text-white mt-2 text-center w-16 truncate">
//               Your Story
//             </span>
//           </div>

//           {/* Other stories */}
//           {stories.map((story, index) => (
//             <div
//               key={index}
//               onClick={() => setSelectedStory(story)}
//               className="flex flex-col items-center min-w-[70px] cursor-pointer group"
//             >
//               <div className="relative w-14 h-14 p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 group-hover:scale-105 transition">
//                 <Image
//                   src={story.media}
//                   alt={story.owner}
//                   fill
//                   sizes="56px"
//                   className="rounded-full object-cover border-2 border-black"
//                 />
//               </div>
//               <span className="text-xs text-white mt-2 text-center w-16 truncate">
//                 {story.owner}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Story Modal */}
//       {selectedStory && (
//         <StoryModal
//           isOpen={true}
//           onClose={() => setSelectedStory(null)}
//           mediaUrl={selectedStory.media}
//           type={
//             selectedStory.media.endsWith(".mp4") ||
//             selectedStory.media.endsWith(".mov")
//               ? "video"
//               : "image"
//           }
//         />
//       )}
//     </>
//   );
// }

// "use client";
// import React, { useState, useRef } from "react";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import StoriesPath from "./storiespath";

// type Props = {
//   onUpload: (url: string) => void;
// };

// const CloudinaryUpload = ({ onUpload }: Props) => {
//   const handleUpload = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "Covaar");

//     const res = await fetch(
//       "https://api.cloudinary.com/v1_1/dvfl0oxmj/image/upload",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await res.json();
//     if (data.secure_url) {
//       onUpload(data.secure_url);
//     } else {
//       alert("Upload failed");
//     }
//   };

//   return { handleUpload };
// };

// export const StoriesBar = () => {
//   const [stories, setStories] = useState([
//     { name: "jiu_dresser", isLive: true, img: "/avatars/1.jpg" },
//     { name: "tarot_mer...", img: "/avatars/2.jpg" },
//     { name: "maral", img: "/avatars/3.jpg" },
//     { name: "Jennie_ruby", img: "/avatars/4.jpg" },
//     { name: "Kohaox", img: "/avatars/5.jpg" },
//   ]);

//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [selectedStory, setSelectedStory] = useState<null | {
//     name: string;
//     img: string;
//     isLive?: boolean;
//   }>(null);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { handleUpload } = CloudinaryUpload({
//     onUpload: (url: string) => {
//       setStories((prev) => [{ name: "You", img: url, isLive: false }, ...prev]);
//       setPreviewUrl(null);
//     },
//   });

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//       await handleUpload(file);
//     }
//   };

//   return (
//     <div>
//       <div className="flex gap-3 overflow-x-auto py-4 px-4 scrollbar-hide">
//         {/* Upload story avatar */}
//         <div
//           className="flex flex-col items-center min-w-[70px] cursor-pointer transition-transform hover:scale-105 active:scale-95"
//           onClick={() => fileInputRef.current?.click()}
//         >
//           <div className="relative">
//             <div className="p-[2px] rounded-full bg-gradient-to-tr from-gray-400 to-gray-600">
//               <Avatar className="border-2 border-black w-14 h-14">
//                 <AvatarImage src="/avatars/your-profile.jpg" alt="You" />
//                 <AvatarFallback>+</AvatarFallback>
//               </Avatar>
//             </div>
//             <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm border-2 border-black">
//               +
//             </div>
//           </div>
//           <span className="text-xs text-white mt-2 text-center w-16 truncate">
//             Your Story
//           </span>
//         </div>

//         {/* Existing stories */}
//         {stories.map((story, index) => (
//           <div
//             key={index}
//             className="flex flex-col items-center min-w-[70px] cursor-pointer transition-transform hover:scale-105 active:scale-95"
//             onClick={() => setSelectedStory(story)}
//           >
//             <div className="relative">
//               <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500">
//                 <Avatar className="border-2 border-black w-14 h-14">
//                   <AvatarImage src={story.img} alt={story.name} />
//                   <AvatarFallback>{story.name[0]}</AvatarFallback>
//                 </Avatar>
//               </div>
//               {story.isLive && (
//                 <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-semibold px-2 py-[1px] rounded-sm">
//                   LIVE
//                 </span>
//               )}
//             </div>
//             <span className="text-xs text-white mt-2 text-center w-16 truncate">
//               {story.name}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Hidden file input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*,video/*"
//         className="hidden"
//         onChange={handleFileChange}
//       />

//       {/* Preview section */}
//       {previewUrl && (
//         <div className="mt-6 px-4 flex justify-center">
//           <div className="flex flex-col items-center">
//             <img
//               src={previewUrl}
//               alt="Preview"
//               className="w-28 h-28 object-cover rounded-full border-2 border-pink-500"
//             />
//             <p className="text-white text-sm mt-2">Story Preview</p>
//           </div>
//         </div>
//       )}

//       {/* Fullscreen Story Viewer */}
//       {selectedStory && (
//         <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-black via-neutral-900 to-black text-white">
//           {/* Top progress bar */}
//           <div className="w-full h-1 bg-white/30">
//             <div className="h-full bg-white animate-[progress_5s_linear_forwards]" />
//           </div>

//           {/* Header section */}
//           <div className="flex items-center justify-between px-4 py-3">
//             <div className="flex items-center gap-3">
//               <Avatar className="w-9 h-9 border border-white">
//                 <AvatarImage src={selectedStory.img} />
//                 <AvatarFallback>{selectedStory.name[0]}</AvatarFallback>
//               </Avatar>
//               <div className="flex flex-col text-sm leading-tight">
//                 <span className="font-semibold">{selectedStory.name}</span>
//                 <span className="text-xs text-gray-300">Sponsored</span>
//               </div>
//             </div>
//             <button
//               onClick={() => setSelectedStory(null)}
//               className="text-xl font-bold text-white"
//             >
//               ✕
//             </button>
//           </div>

//           {/* Story content */}
//           <div className="flex-grow flex justify-center items-center px-4">
//             <img
//               src={selectedStory.img}
//               alt={selectedStory.name}
//               className="max-h-[80%] max-w-full rounded-lg object-contain shadow-lg"
//             />
//           </div>

//           {/* Caption text */}
//           <div className="px-4 pb-6 text-sm font-medium">
//             {selectedStory.name} Live at AIC Steppe Arena 🎶
//           </div>

//           {/* Keyframes for progress bar animation */}
//           <style>
//             {`
//               @keyframes progress {
//                 0% { width: 0%; }
//                 100% { width: 100%; }
//               }
//             `}
//           </style>
//         </div>
//       )}
//     </div>
//   );
// };
