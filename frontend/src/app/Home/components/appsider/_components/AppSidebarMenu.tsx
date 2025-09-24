// components/AppSidebarMenu.tsx
import {
  Home,
  Compass,
  Search,
  MessageCircleHeart,
  Heart,
  PlusSquare,
  CircleUserRound,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MoreButtonPopover from "./MoreButtonPopover";

const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Search", url: "#", icon: Search },
  { title: "Messages", url: "#", icon: MessageCircleHeart },
  { title: "Notifications", url: "#", icon: Heart },
  { title: "Create", url: "#", icon: PlusSquare },
  { title: "Profile", url: "#", icon: CircleUserRound },
];

type Props = {
  activePanel: "none" | "search" | "messages" | "notifications";
  togglePanel: (panel: "search" | "messages" | "notifications") => void;
  username: string | null;
  setIsCreateOpen: (value: boolean) => void;
};

export default function AppSidebarMenu({
  activePanel,
  togglePanel,
  username,
  setIsCreateOpen,
}: Props) {
  const router = useRouter();

  return (
    <Sidebar
      className={`transition-all duration-300 bg-black ${
        activePanel === "search" ||
        activePanel === "messages" ||
        activePanel === "notifications"
          ? "max-w-[75px]"
          : "w-[280px]"
      } h-screen fixed left-0 top-0`}
    >
      <SidebarContent className="flex flex-col border-r-[0.5px] border-gray-900 justify-between h-full py-[35px] px-[20px] overflow-hidden dark:bg-black">
        <div>
          <SidebarGroup>
            {/* Logo section */}
            <div className="relative w-[200px] h-[40px] mb-6">
              <div
                className={`absolute top-0 left-0 w-full h-full flex items-center text-2xl font-bold transition-opacity duration-500 ${
                  activePanel === "none" ? "opacity-100" : "opacity-0"
                }`}
              >
                Instagram
              </div>
              <div
                className={`absolute top-0 left-0 w-full h-full flex items-center transition-opacity duration-500 ${
                  activePanel !== "none" ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src="/img/instaLogo.png"
                  alt="Logo"
                  width={140}
                  height={40}
                  className="h-[40px] w-auto object-contain"
                  priority
                />
              </div>
            </div>

            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="w-[200px] h-[50px] flex gap-5 hover:bg-gray-100 dark:hover:bg-red-950 rounded-lg transition-colors"
                      asChild
                      onClick={() => {
                        if (item.title === "Search") {
                          togglePanel("search");
                        } else if (item.title === "Messages") {
                          router.push("/Home/message");
                           togglePanel("messages");
                        } else if (item.title === "Notifications") {
                          togglePanel("notifications");
                        } else if (item.title === "Profile") {
                          router.push(`/Home/profile`);
                        } else if (item.title === "Home") {
                          router.push(`/Home`);
                        } else if (item.title === "Create") {
                          setIsCreateOpen(true);
                        }
                      }}
                    >
                      <a href={item.url}>
                        <item.icon style={{ width: "25px", height: "25px" }} />
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

        <div>
          <MoreButtonPopover />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
