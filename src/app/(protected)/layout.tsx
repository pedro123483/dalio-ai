"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "~/components/layout/Sidebar";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Só abre a sidebar automaticamente no desktop
    if (isMobile !== undefined) {
      setSidebarOpen(!isMobile);
    }
  }, [isMobile]);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
            "w-full",
          )}
        >
          <div className="h-full py-4">
            <div
              className={cn(
                "h-full w-full",
                isMobile ? "px-2 sm:px-3" : "px-4 sm:px-10",
              )}
            >
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
