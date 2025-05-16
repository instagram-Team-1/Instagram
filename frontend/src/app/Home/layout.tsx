"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/appsider/AppSidebar";
import { ThemeProvider } from "./components/Theme-provider";
import { FeedProvider } from "./Context/FeedPage";
import { Toaster } from "sonner";
import { parseJwt } from "@/utils/JwtParse";
import { createContext } from "react";

type DecodedToken = {
  userId: string;
  exp: number;
};

type UserContextType = {
  id: string;
  email: string;
  username: string;
  avatarImage: string;
  fullname: string;
};

export const userContext = createContext<UserContextType | null>(null);

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserContextType | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        const payload = parseJwt(token);
        setUserData(payload);
        setLoading(false);
      }
    } catch (error) {
      console.error("Token invalid", error);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <FeedProvider>
            <userContext.Provider value={userData}>
          <AppSidebar />
          <SidebarTrigger />
            {children}
          <Toaster richColors />
                 </userContext.Provider>
        </FeedProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
