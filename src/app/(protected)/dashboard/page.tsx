"use client";

import { useState, useEffect } from "react";
import { Navbar } from "~/components/layout/Navbar";
import { Sidebar } from "~/components/layout/Sidebar";
import { ChatInterface } from "~/components/dashboard/ChatInterface";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";

const Index = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only auto-open sidebar on desktop
    if (isMobile !== undefined) {
      setSidebarOpen(!isMobile);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!mounted) return null;

  return (
    <div className={cn("flex min-h-screen flex-col bg-background", isMobile ? "px-5" : "px-10")}>
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        {/* <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
        <main
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
            // sidebarOpen && !isMobile ? "ml-[280px]" : "",
            // isMobile ? "w-full" : ""
          )}
        >
          <div className="h-full py-4">
            <div className="h-full w-full">
              <ChatInterface />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
