import React from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
    Settings,
    Heart,
    CircleUserRound,
    AlignJustify,
  } from "lucide-react";
  import {

    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar";
  import { DarkModeButton } from "../../DarkModeButton";

function MoreButtonPopover() {

    const router = useRouter();

    const logout = async () => {
        try {
          localStorage.removeItem("token");
          router.push("/login");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      };

  return (
    <div>
      {" "}
      <SidebarMenu>
        <SidebarMenuItem className="w-[300px] h-[50px]">
          <SidebarMenuButton
            className="w-[300px] h-[50px] flex gap-5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            asChild
          >
            <Popover>
              <PopoverTrigger className="p-4" asChild>
                <button className="flex items-center gap-5 w-[300px] h-[50px] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <AlignJustify style={{ width: "25px", height: "25px" }} />
                  <span className="text-[15px] font-bold">More</span>
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-52 p-2 space-y-2 dark:bg-black">
                <button className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 w-full text-left">
                  <Settings size={20} />
                  <span>Settings</span>
                </button>

                <button className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 w-full text-left">
                  <Heart size={20} />
                  <span>Saved</span>
                </button>

                <button className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 w-full text-left">
                  <CircleUserRound size={20} />
                  <span>Switch account</span>
                </button>

                <div className="flex items-center gap-2">
                  <DarkModeButton />
                  <span>Mode</span>
                </div>
                <button
                  className="flex items-center gap-2 p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 w-full text-left text-red-600 dark:text-red-400"
                  onClick={logout}
                >
                  <span>Log out</span>
                </button>
              </PopoverContent>
            </Popover>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}

export default MoreButtonPopover;
