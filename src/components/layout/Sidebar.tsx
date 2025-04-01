'use client';

import { useState, useEffect } from 'react';
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { 
  MessageSquare, 
  Search, 
  Plus, 
  List,
  BarChart3,
  X,
  CreditCard
} from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";
import Link from "next/link";
import { usePathname } from 'next/navigation';


type SidebarProps = {
  isOpen: boolean;
  toggleSidebar?: () => void;
};

type Conversation = {
  id: string;
  title: string;
  date: string;
  preview: string;
  unread?: boolean;
};

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const isMobile = useIsMobile();
  const location = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // Mock data - In a real app, this would come from an API
    const mockConversations: Conversation[] = [
      {
        id: "1",
        title: "Análise de Mercado",
        date: "Hoje",
        preview: "Quais são as tendências atuais para o Ibovespa?",
        unread: true
      },
      {
        id: "2",
        title: "Fundos Imobiliários",
        date: "Ontem",
        preview: "Me ajude a entender a distribuição de dividendos..."
      },
      {
        id: "3",
        title: "Previsão do Dólar",
        date: "25/05",
        preview: "Qual a expectativa para o câmbio nas próximas semanas?"
      },
      {
        id: "4",
        title: "Análise Técnica",
        date: "20/05",
        preview: "Pode me explicar o que significa o indicador MACD?"
      },
      {
        id: "5",
        title: "Diversificação",
        date: "15/05",
        preview: "Como posso diversificar minha carteira com R$10.000?"
      },
      {
        id: "6",
        title: "IPOs Recentes",
        date: "10/05",
        preview: "Quais empresas fizeram IPO nos últimos 3 meses?"
      }
    ];
    
    setConversations(mockConversations);
  }, []);

  const filteredConversations = conversations.filter(conversation => 
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-20"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar transition-transform duration-300 ease-in-out border-r border-sidebar-border",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "w-[280px]",
          isMobile && isOpen ? "w-[280px]" : "",
          !isOpen && !isMobile ? "w-0" : ""
        )}
      >
        <div className="flex flex-col h-full">
          {isMobile && (
            <div className="flex justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </Button>
            </div>
          )}
          
          <div className="p-4 border-b border-sidebar-border">
            <Button className="w-full justify-start gap-2 mb-4">
              <Plus size={18} />
              <span>Nova Conversa</span>
            </Button>
            <div className="relative">
              <Search size={16} className="absolute left-2.5 top-2.5 text-sidebar-foreground/60" />
              <Input
                type="search"
                placeholder="Buscar conversas"
                className="pl-8 bg-sidebar-accent border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="px-2 py-4 border-b border-sidebar-border">
            <nav className="space-y-1">
              <Link href="/dashboard">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start", 
                    location === "/dashboard" ? "bg-sidebar-accent" : ""
                  )}
                >
                  <MessageSquare size={16} className="mr-2" />
                  Assistente
                </Button>
              </Link>
              <Link href="/dashboard/data">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start", 
                    location === "/dashboard/data" ? "bg-sidebar-accent" : ""
                  )}
                >
                  <BarChart3 size={16} className="mr-2" />
                  Visualização de Dados
                </Button>
              </Link>
              <Link href="/payment">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start", 
                    location === "/payment" ? "bg-sidebar-accent" : ""
                  )}
                >
                  <CreditCard size={16} className="mr-2" />
                  Pagamentos
                </Button>
              </Link>
            </nav>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.length > 0 ? (
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md sidebar-conversation",
                        conversation.unread ? "bg-sidebar-accent/70" : ""
                      )}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm truncate">{conversation.title}</span>
                        <span className="text-xs text-sidebar-foreground/60">{conversation.date}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <MessageSquare size={14} className="shrink-0 text-sidebar-foreground/60" />
                        <span className="text-xs text-sidebar-foreground/80 truncate">{conversation.preview}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-sidebar-foreground/60">
                  <List size={24} className="mb-2" />
                  <p className="text-sm">Nenhuma conversa encontrada</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Profile or additional elements can go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}