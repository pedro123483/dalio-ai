import { Button } from "~/components/ui/button";
import { MessageSquare, User, Menu, X, LogOut } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

type NavbarProps = {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
};

export function Navbar({ toggleSidebar, sidebarOpen }: NavbarProps) {
  const isMobile = useIsMobile();
  const { signOut } = useClerk();

  const handleProfileClick = () => {
    redirect("/profile");
  };

  const handleLogout = () => {
    signOut();
    toast.success("Desconectado com sucesso!");
  };

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center px-0">
        <div className="flex items-center">
          {/* <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2"
            aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button> */}
          <div className="flex items-center gap-2">
            {/* <MessageSquare size={24} className="text-primary" /> */}
            {/* <span className={cn("font-bold text-lg", isMobile ? "hidden" : "inline")}>Dalio AI</span> */}
            <span className={cn("inline text-2xl font-bold")}>Dalio AI</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end">
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
          {/* <Button 
            variant="default" 
            size="icon" 
            className="rounded-full bg-primary text-white hover:bg-primary"
            onClick={handleProfileClick}
          >
            <User size={20} />
          </Button> */}
        </div>
      </div>
    </header>
  );
}
