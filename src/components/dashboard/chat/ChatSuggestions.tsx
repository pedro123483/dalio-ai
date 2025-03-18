import { Button } from "~/components/ui/button";

interface ChatSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

export function ChatSuggestions({ suggestions, onSelectSuggestion }: ChatSuggestionsProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-center mb-3">Sugestões de perguntas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto justify-start py-2 px-3 text-sm text-left"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
