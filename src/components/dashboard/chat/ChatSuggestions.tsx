import { Button } from "~/components/ui/button";

interface ChatSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

export function ChatSuggestions({
  suggestions,
  onSelectSuggestion,
}: ChatSuggestionsProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-3 text-center text-sm font-medium">
        Sugestões de perguntas
      </h3>
      <div className="xs:grid-cols-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto justify-start px-3 py-2 text-left text-sm"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
