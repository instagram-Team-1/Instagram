"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Home,
  Compass,
  Search,
  Settings,
  MessageCircleHeart,
  Heart,
  PlusSquare,
  CircleUserRound,
  AlignJustify,
} from "lucide-react";
import { DarkModeButton } from "./DarkModeButton";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";

const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Search", url: "#", icon: Search },
  { title: "Explore", url: "#", icon: Compass },
  { title: "Messages", url: "#", icon: MessageCircleHeart },
  { title: "Notifications", url: "#", icon: Heart },
  { title: "Create", url: "#", icon: PlusSquare },
  { title: "Profile", url: "#", icon: CircleUserRound },
];

export function AppSidebar() {
  const [activePanel, setActivePanel] = useState<
    "none" | "search" | "messages" | "notifications"
  >("none");

  const togglePanel = (panel: "search" | "messages" | "notifications") => {
    setActivePanel((prev) => (prev === panel ? "none" : panel)); // Toggle panel: close if already open, open if not
  };

  return (
    <div className={`flex h-screen`}>
      <Sidebar
        className={`transition-all duration-300 ${
          activePanel === "search" ||
          activePanel === "messages" ||
          activePanel === "notifications"
            ? "max-w-[75px]"
            : "w-[336px]"
        } h-screen fixed left-0 top-0`}
      >
        <SidebarContent className="flex flex-col justify-between h-full py-[35px] px-[20px]">
          <div>
            <SidebarGroup>
              <SidebarGroupLabel>Instagram</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className="w-[300px] h-[50px] flex gap-5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        asChild
                        onClick={() => {
                          if (item.title === "Search") {
                            togglePanel("search");
                          } else if (item.title === "Messages") {
                            togglePanel("messages");
                          } else if (item.title === "Notifications") {
                            togglePanel("notifications");
                          }
                        }}
                      >
                        <a href={item.url}>
                          <item.icon
                            style={{ width: "25px", height: "25px" }}
                          />
                          {(activePanel === "none" ||
                            activePanel === "search" ||
                            activePanel === "messages" ||
                            activePanel === "notifications") && (
                            <span className="text-[15px] font-bold">
                              {item.title}
                            </span>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>

          <DarkModeButton />
          <div>
            <SidebarMenu>
              <SidebarMenuItem className="w-[300px] h-[50px]">
                <SidebarMenuButton
                  className="w-[300px] h-[50px] flex gap-5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  asChild
                >
                  <Popover>
                    <PopoverTrigger>
                      <AlignJustify style={{ width: "25px", height: "25px" }} />
                    </PopoverTrigger>
                    <PopoverContent>
                      Place content for the popover here.
                    </PopoverContent>
                  </Popover>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
      </Sidebar>

      <div
        className={`${
          activePanel === "search"
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        } transition-all duration-400 ease-in-out fixed top-0 left-0 h-screen ml-[75px] bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-4`}
        style={{ minWidth: "400px" }}
      >
        <div className="h-[160px] w-[400px] p-5 border-b-[1px]">
          <h2 className="text-lg font-semibold mb-4">Search</h2>
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-md border dark:bg-zinc-800"
          />
        </div>
      </div>

      <div
        className={`${
          activePanel === "messages"
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        } transition-all duration-400 ease-in-out fixed top-0 left-0 h-screen ml-[75px] bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-4`}
        style={{ minWidth: "400px" }}
      >
        <div className="h-[160px] w-[400px] p-5 border-b-[1px]">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          <ul>
            <li className="mb-2">Message from John</li>
            <li className="mb-2">Message from Jane</li>
          </ul>
        </div>
      </div>

      <div
        className={`${
          activePanel === "notifications"
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        } transition-all duration-400 ease-in-out fixed top-0 left-0 h-screen ml-[75px] bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-4`}
        style={{ minWidth: "400px" }}
      >
        <div className="h-[160px] w-[400px] p-5 border-b-[1px]">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <ul>
            <li className="mb-2">New like on your post</li>
            <li className="mb-2">New comment on your photo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
