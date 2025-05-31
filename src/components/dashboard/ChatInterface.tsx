"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatSuggestions } from "./chat/ChatSuggestions";
import { useChat } from "@ai-sdk/react";
import { Paperclip, ArrowLeft } from "lucide-react"; // Import ArrowLeft icon
import { Button } from "~/components/ui/button";

export function ChatInterface() {
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, setInput, setMessages, isLoading } = useChat({});

  // Exemplos de perguntas que o usuário pode fazer
  const suggestions = [
    "Qual o resultado financeiro da Petrobras em 2024?",
    "Compare BTG e Itaú no último ano.",
    "Compare BTLG11 e XPML11 nos últimos 6 meses.",
    "Como está a ação da Magalu hoje?",
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

  // Função para reiniciar a conversa
  const handleRestartConversation = () => {
    setMessages([]); // Limpa todas as mensagens
    setInput(""); // Limpa o input
    setFiles(undefined); // Limpa os arquivos selecionados
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Limpa o campo de input de arquivo
    }
  };

  return (
    <div className="flex h-[calc(108vh-5rem)] w-full flex-col overflow-hidden rounded-lg border bg-card">
      {/* Header com o botão de voltar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRestartConversation}
          className="mr-2"
          title="Reiniciar conversa"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="font-semibold text-lg tracking-tight">Dalio AI</span>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="mb-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        {/* Mostra sugestões apenas se não houver mensagens no chat */}
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