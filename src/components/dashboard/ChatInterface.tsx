import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "~/components/ui/scroll-area";
import { ChatMessage } from './chat/ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { ChatSuggestions } from './chat/ChatSuggestions';
import { ChatLoadingIndicator } from './chat/ChatLoadingIndicator';
import { Message } from '~/types/chat';
import { getMockResponse } from '~/utils/chatUtils';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu assistente financeiro. Como posso ajudar você hoje?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Exemplos de perguntas que o usuário pode fazer
  const suggestions = [
    "Como está o mercado hoje?",
    "Explique a relação entre taxa de juros e bolsa",
    "Quais ações tiveram melhor desempenho este mês?",
    "O que é um ETF?"
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simular resposta do AI após um pequeno delay
    setTimeout(() => {
      const responseContent = getMockResponse(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] border rounded-lg overflow-hidden bg-card">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && <ChatLoadingIndicator />}
        </div>
        
        {messages.length === 1 && (
          <ChatSuggestions 
            suggestions={suggestions} 
            onSelectSuggestion={(suggestion) => setInput(suggestion)}
          />
        )}
      </ScrollArea>
      
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}