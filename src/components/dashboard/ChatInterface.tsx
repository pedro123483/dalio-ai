"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatSuggestions } from "./chat/ChatSuggestions";
import { ChatLoadingIndicator } from "./chat/ChatLoadingIndicator";
import { useChat } from "@ai-sdk/react";
import { Paperclip, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export function ChatInterface() {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para controlar sugestões/chat
  const [view, setView] = useState<"suggestions" | "chat">("suggestions");

  const { messages, input, handleInputChange, handleSubmit, setInput, setMessages } = useChat({});

  // 12 sugestões
  const suggestions = [
    "Qual o resultado financeiro da Petrobras em 2024?",
    "Compare BTG e Itaú no último ano.",
    "Compare BTLG11 e XPML11 nos últimos 6 meses.",
    "Como está a ação da Magalu hoje?",
    "Quais são os principais indicadores da Vale?",
    "Como está o desempenho do setor bancário em 2024?",
    "Qual a diferença entre ações ON e PN?",
    "BTG está pagando dividendos?",
    "Quais as últimas notícias do setor de varejo?",
    "Como está a cotação do dólar hoje?",
    "Fale sobre o histórico de dividendos da Taesa.",
    "Mostre o gráfico do Ibovespa nos últimos 12 meses."
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, view]);

  const handleChatSubmit = (e: React.FormEvent) => {
    handleSubmit(e, {
      experimental_attachments: files,
    });
    setFiles(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setView("chat"); // Troca para o modo chat ao enviar mensagem
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setView("chat"); // Troca para chat ao selecionar sugestão
  };

  const handleBackToSuggestions = () => {
    setView("suggestions");
    setInput("");
    setMessages([]); // Opcional: limpa as mensagens, pode remover se quiser manter histórico
  };

  return (
    <div className="flex h-[calc(108vh-5rem)] w-full flex-col overflow-hidden rounded-lg border bg-card">
      {/* Header com botão de voltar */}
      {view === "chat" && (
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToSuggestions}
            className="mr-2"
            title="Voltar para sugestões"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-lg tracking-tight">Dalio AI</span>
        </div>
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="mb-4 space-y-4">
          {view === "chat" &&
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          {isLoading && <ChatLoadingIndicator />}
        </div>
        {view === "suggestions" && (
          <ChatSuggestions
            suggestions={suggestions}
            onSelectSuggestion={handleSelectSuggestion}
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
                if (event.target.files) setFiles(event.target.files);
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
