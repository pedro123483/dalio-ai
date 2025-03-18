import { MessageSquare } from "lucide-react";
import { cn } from "~/lib/utils";
import { Message } from "~/types/chat";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex", 
        message.sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      <div className="flex max-w-[80%] items-start gap-3">
        {message.sender === 'ai' && (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mt-0.5">
            <MessageSquare size={16} className="text-primary-foreground" />
          </div>
        )}
        <div
          className={cn(
            "animate-slide-in",
            message.sender === 'user' ? "chat-message-user" : "chat-message-ai"
          )}
        >
          <p className="break-words">{message.content}</p>
          <div className="mt-1 text-right">
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        {message.sender === 'user' && (
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center mt-0.5">
            <span className="text-sm font-medium">EU</span>
          </div>
        )}
      </div>
    </div>
  );
}