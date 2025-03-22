import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: any) {
  return (
    <div className="border-t p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Digite sua mensagem..."
          className="max-h-[120px] min-h-[60px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="aspect-square h-auto"
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </Button>
      </form>
    </div>
  );
}
