// app/home/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

type DecodedToken = {
  userId: string;
  exp: number;
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      {children}
    </SidebarProvider>
  );
}
