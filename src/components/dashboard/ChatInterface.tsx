"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatSuggestions } from "./chat/ChatSuggestions";
import { useChat } from "@ai-sdk/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    setMessages,
    isLoading,
  } = useChat({});

  const suggestions = [
    "Qual o resultado financeiro da Petrobras em 2024?",
    "Compare BTG e Itaú no último ano.",
    "Compare BTLG11 e XPML11 nos últimos 6 meses.",
    "Como está a ação da Magalu hoje??",
    "Quais são os principais indicadores da Vale?",
    "Como está o desempenho do setor bancário em 2024?",
    "Qual a diferença entre ações ON e PN?",
    "BTG está pagando dividendos?",
    "Fale sobre o histórico de dividendos da Taesa.",
    "Qual cenário do Itaú econômico atualmente?",
    "Qual a inflação do Brasil em 2024?",
    "Qual a taxa básica de juros do Brasil em 2024?",
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChatSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
  };

  const handleRestartConversation = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden rounded-lg border bg-card md:h-[calc(108vh-5rem)]">
      {/* Header com o botão de voltar */}
      <div className="flex items-center gap-2 border-b bg-card px-4 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRestartConversation}
          className="mr-2"
          title="Reiniciar conversa"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-lg font-semibold tracking-tight">Dalio AI</span>
      </div>

      <ScrollArea className="flex-1 p-2 sm:p-4" ref={scrollAreaRef}>
        <div className="mb-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        {messages.length === 0 && (
          <ChatSuggestions
            suggestions={suggestions}
            onSelectSuggestion={(suggestion) => setInput(suggestion)}
          />
        )}
      </ScrollArea>

      <div className="border-t p-2 sm:p-4">
        <form onSubmit={handleChatSubmit} className="flex flex-col space-y-2">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleChatSubmit}
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
