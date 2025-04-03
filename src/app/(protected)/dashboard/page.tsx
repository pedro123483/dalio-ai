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
    <div className="flex min-h-screen flex-col bg-background">
      <div className={cn("px-4", isMobile ? "sm:px-5" : "sm:px-10")}>
        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      </div>

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
            <div
              className={cn(
                "h-full w-full",
                isMobile ? "px-4 sm:px-5" : "px-4 sm:px-10",
              )}
            >
              <ChatInterface />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
