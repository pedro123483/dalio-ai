"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatSuggestions } from "./chat/ChatSuggestions";
import { ChatLoadingIndicator } from "./chat/ChatLoadingIndicator";
import { Message } from "~/types/chat";
import { useChat } from "@ai-sdk/react";
import { Paperclip } from "lucide-react";
import { Button } from "~/components/ui/button";

export function ChatInterface() {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({});

  // Exemplos de perguntas que o usuário pode fazer
  const suggestions = [
    "Qual o resultado financeiro da Petrobras em 2024?",
    "Compare BTG e Itaú no último ano",
    "Compare BTLG11 e XPML11 nos últimos 6 meses",
    "Como está a ação da Magalu hoje?",
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChatSubmit = (e: React.FormEvent) => {
    handleSubmit(e, {
      experimental_attachments: files,
    });
    
    setFiles(undefined);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-[calc(108vh-5rem)] w-full flex-col overflow-hidden rounded-lg border bg-card">
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

      <div className="border-t p-4">
        <form onSubmit={handleChatSubmit} className="flex flex-col space-y-2">
          <div className="flex items-center">
            <input
              type="file"
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  setFiles(event.target.files);
                }
              }}
              multiple
              ref={fileInputRef}
              accept="application/pdf,image/*"
            />
            
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={handleFileClick} 
              className="mr-2"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            {files && files.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {files.length} arquivo(s) selecionado(s)
              </span>
            )}
          </div>
          
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
