"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileUp,
  Home,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { useIsMobile } from "~/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

const menuItems = [
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Relatório",
    href: "/balance",
    icon: Search,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Sidebar para mobile: Sheet (drawer)
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-2 top-2 z-40 md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-64 max-w-[80vw] p-0">
            <SheetHeader className="border-b px-4 py-3">
              <SheetTitle>
                <span className="text-lg font-semibold">Dalio AI</span>
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetHeader>
            <div className="flex h-full flex-col">
              <nav className="grid gap-1 px-2 py-4">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-auto border-t p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0)}
                          {user?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {user?.firstName} {user?.lastName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        signOut();
                        toast.success("Desconectado com sucesso!");
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Sidebar para desktop
  return (
    <div
      className={cn(
        "hidden flex-col border-r bg-background transition-all duration-300 md:flex",
        collapsed ? "w-16" : "w-54",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold">Dalio AI</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed && "h-5 w-5")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                collapsed && "justify-center px-0",
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <span>
                  {user?.firstName} {user?.lastName}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut();
                toast.success("Desconectado com sucesso!");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
