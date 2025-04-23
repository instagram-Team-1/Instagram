import {
  Home,
  Compass,
  Search,
  Settings,
  MessageCircleHeart,
  Heart,
  PlusSquare,
  CircleUserRound,
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

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Explore",
    url: "#",
    icon: Compass,
  },
  {
    title: "Messages",
    url: "#",
    icon: MessageCircleHeart,
  },

  {
    title: "Notifications",
    url: "#",
    icon: Heart,
  },
  {
    title: "Create",
    url: "#",
    icon: PlusSquare,
  },
  {
    title: "Profile",
    url: "#",
    icon: CircleUserRound,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-[336px] h-screen ">
      <SidebarContent className="flex flex-col justify-between h-full py-[35px] px-[20px]">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>Instagram</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem className=" " key={item.title}>
                    <SidebarMenuButton
                      className="w-[300px] h-[50px] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      asChild
                    >
                      <a href={item.url}>
                        <item.icon style={{ width: "25px", height: "25px" }} />
                        <span className="text-[15px] font-bold">
                          {item.title}
                        </span>
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
                className="w-[300px] h-[50px] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                asChild
              >
                <a href="#settings" className="flex items-center gap-3 px-4">
                  <Settings style={{ width: "25px", height: "25px" }} />
                  <span className="text-[15px] font-bold">Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
