import { Loader2, MessageSquare } from "lucide-react";

export function ChatLoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-[80%] items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mt-0.5">
          <MessageSquare size={16} className="text-primary-foreground" />
        </div>
        <div className="chat-message-ai">
          <div className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            <p>O assistente está digitando...</p>
          </div>
        </div>
      </div>
    </div>
  );
}