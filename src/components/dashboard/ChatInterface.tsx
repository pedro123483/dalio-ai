"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatSuggestions } from "./chat/ChatSuggestions";
import { ChatLoadingIndicator } from "./chat/ChatLoadingIndicator";
import { Message } from "~/types/chat";
import { useChat } from "@ai-sdk/react";

export function ChatInterface() {
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({});

  // Exemplos de perguntas que o usuário pode fazer
  const suggestions = [
    "Compare BTG e Itaú no último ano",
    "Como está a ação da Magalu hoje?",
    "Qual o desempenho do Ibovespa vs S&P 500?",
    "Compare os fundos XPML11 e BTLG11 nos últimos 3 meses",
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full flex-col overflow-hidden rounded-lg border bg-card">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="mb-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && <ChatLoadingIndicator />}
        </div>

        {messages.length === 0 && (
          <ChatSuggestions
            suggestions={suggestions}
            onSelectSuggestion={(suggestion) => setInput(suggestion)}
          />
        )}
      </ScrollArea>

      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
