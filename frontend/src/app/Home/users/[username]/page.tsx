"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React from "react";
import { useState, useEffect } from "react";
import PostsGrid from "../../profile/_components/PostsGrid";
import { useParams } from "next/navigation";
import { fetchUser } from "@/lib/api";
import { UserDataType } from "@/lib/types";
import { PostType } from "@/lib/types";

export default function ProfilePage() {
  const {username} = useParams()
  const [userPosts, setUserPosts] = useState<PostType[]>([]);


  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [user, setUser] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const getUser = async () => {
      try {
        if (typeof username === "string") {
          const userData = await fetchUser(username);
          setUser(userData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, [username]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (typeof username !== "string") return;
        const res = await fetch(`/api/posts/user/username/${username}`);
        const data = await res.json();
        setUserPosts(data.posts);
      } catch (error) {
        console.error("Failed to fetch user posts", error);
      }
    };
  
    fetchUserPosts();
  }, [username]);
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-[935px] h-full px-[20px] pt-[30px] flex flex-col">
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-row">
            {/* profile image */}
            <div className="w-[283.67px] h-[181px] ">
              <div 
                className="relative w-[150px] h-[150px] bg-gray-300 box-border rounded-full overflow-hidden group bg-cover bg-center" 
                // style={{ backgroundImage: `url(https://shorturl.at/y2FNH)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                style={{
                  backgroundImage: `url(https://i.pinimg.com/originals/0f/78/5d/0f785d55cea2a407ac8c1d0c6ef19292.jpg 
                  )`,
                }}
              >
              </div>
            </div>
            <div className="flex flex-col ml-[20px] gap-[30px]">
              <div className="text-[20px] font-normal flex flex-row items-center gap-[8px]">
                <div>{user.username}</div>
                <Button
                  variant="secondary"
                  // onClick={() => (window.location.href = "/accounts/edit/")}
                  className="bg-blue-400 text-white hover:bg-blue-500"
                >
                  Follow
                </Button>
                <Button variant="secondary" className="hover:bg-gray-200">Message</Button>
              </div>
              <div className="text-[16px] text-gray-400 flex flex-row gap-[30px]">
                <div>posts</div>
                <div>followers</div>
                <div>following</div>
              </div>
              <div className="text-[16px] text-gray-500">Bio goes here</div>
            </div>
          </div>

          {/* highlights section */}
          <div className="w-full">
            <div
              role="tab"
              className="w-[89px] flex flex-col items-center cursor-pointer"

              onClick={() => setShowHighlightModal(true)}

            >
              <div className="w-[89px] h-[89px] rounded-full border border-gray-300 flex items-center justify-center">
                <div className="w-[77px] h-[77px] rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  {/* <Plus className="w-16"/> */}
                </div>
              </div>
              <div>New</div>
            </div>

            {/* {showHighlightModal && (
              <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
                <div className="bg-gray-700 p-6 rounded-xl shadow-lg w-[300px]">
                  <h2 className="text-lg font-semibold mb-4">New Highlight</h2>
                  <Input
                    type="text"
                    placeholder="Highlight name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="text-gray-600 hover:text-black"
                      onClick={() => setShowHighlightModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        // Highlight creation logic here
                        setShowHighlightModal(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )} */}


          </div>
        </div>

        <div className="flex flex-col mt-[30px]">
          <div className="flex flex-row justify-center gap-[30px] border-t border-gray-200 dark:border-gray-600">
            <a
              aria-selected="true"
              role="tab"
              className="text-[16px] font-medium text-gray-500 hover:text-gray-600 dark:hover:text-white hover:border-t border-t-[var(--foreground)]"

            >
              <p className="mt-[20px]">Posts</p>
            </a>
            <a
              aria-selected="false"
              role="tab"

              className="text-[16px] font-medium text-gray-500 hover:text-gray-600 dark:hover:text-white hover:border-t border-t-[var(--foreground)]"
            >
              <p className="mt-[20px]">Saved</p>

            </a>
            <a
              aria-selected="false"
              role="tab"
              className="text-[16px] font-medium text-gray-500 hover:text-gray-600 dark:hover:text-white hover:border-t border-t-[var(--foreground)]"
            >
              <p className="mt-[20px]">Tagged</p>
            </a>
          </div>
          <div className="mt-[20px]">
            <PostsGrid />
          </div>
        </div>

        <footer className="w-full mt-auto py-[20px] border-gray-300 text-center text-gray-500 text-[14px]">
          <div className="w-full flex justify-center gap-[15px] mt-[10px]">
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              Blog
            </a>
            <a href="#" className="hover:underline">
              Help
            </a>
            <a href="#" className="hover:underline">
              Locations
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
          <p>
            &copy; {new Date().getFullYear()} Instagram Clone
          </p>
        </footer>
      </div>
    </div>
  );
}
