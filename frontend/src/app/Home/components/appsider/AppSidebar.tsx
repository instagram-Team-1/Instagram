
import { useEffect, useState } from "react";
import { parseJwt } from "../../../../utils/JwtParse";
import CreatePostDialog from "../AppSidebarCreatePostDialog";
import NotificationButtonPanel from "./_components/NotificationButtonPanel";
import MesageButtonPanel from "./_components/MessageButtonPanel";
import SearchButtonPanel from "./_components/SearchButtonPanel";
import AppSidebarMenu from "./_components/AppSidebarMenu";
import { useRouter } from "next/navigation";
import { API } from "@/utils/api";


export function AppSidebar() {
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const sidebarElement = document.getElementById("app-sidebar");
    if (sidebarElement && !sidebarElement.contains(event.target as Node)) {
      setActivePanel("none");
    }
  };

  window.addEventListener("click", handleClickOutside);

  return () => {
    window.removeEventListener("click", handleClickOutside);
  };
}, []);

const router = useRouter()
  const [username, setUsername] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<
    "none" | "search" | "messages" | "notifications"
  >("none");

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const payload = parseJwt(token);
          if (payload?.username) {
            setUsername(payload.username);
            return;
          }
        }
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };

    fetchUser();
  }, []);

  const togglePanel = (panel: "search" | "messages" | "notifications") => {
    setActivePanel((prev) => (prev === panel ? "none" : panel));
  };
  return (
    <div id="app-sidebar" className="flex h-screen z-40 ">
      <AppSidebarMenu
        activePanel={activePanel}
        togglePanel={togglePanel}
        username={username}
        setIsCreateOpen={setIsCreateOpen}
      />
      <SearchButtonPanel activePanel={activePanel} />
      <MesageButtonPanel activePanel={activePanel} />
      <NotificationButtonPanel activePanel={activePanel} />
      <CreatePostDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}