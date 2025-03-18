import { useState } from 'react';
import { Button } from "~/components/ui/button";
import { 
  MessageSquare, 
  User, 
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { notFound, redirect } from "next/navigation";
import { useClerk } from '@clerk/nextjs';

type NavbarProps = {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
};

export function Navbar({ toggleSidebar, sidebarOpen }: NavbarProps) {
  const isMobile = useIsMobile();
  //const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleProfileClick = () => {
    redirect('/profile');
  };

  const handleLogout = () => {
    // Simulate logging out - in a real app this would clear auth tokens, etc.
    signOut();
    toast.success("Desconectado com sucesso!");
    // setTimeout(() => {
    //   redirect('/');
    // }, 1000);
  };

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* <div className="mr-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2"
            aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <div className="flex items-center gap-2">
            <MessageSquare size={24} className="text-primary" />
            <span className={cn("font-bold text-lg", isMobile ? "hidden" : "inline")}>FinanceAI</span>
          </div>
        </div> */}

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={handleLogout}
            aria-label="Sair"
            title="Sair"
          >
            <LogOut size={20} />
          </Button>
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full bg-primary text-white hover:bg-primary"
            onClick={handleProfileClick}
          >
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}