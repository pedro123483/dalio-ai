"use client";

import { MessageSquare, BotMessageSquare, BotIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Message } from "~/types/chat";
import { useUser } from "@clerk/clerk-react";
import { StockInfoCard } from "./StockInfoCard";
interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: any) {
  const { isLoaded, isSignedIn, user } = useUser();

  // Obter o texto que vem após a invocação da ferramenta
  const getFollowUpContent = () => {
    // Verifica se há partes da mensagem
    if (message.parts && message.parts.length > 0) {
      // Procura por partes de texto que vêm após as invocações de ferramentas
      const toolInvocationParts = message.parts.filter(
        (part: any) => part.type === "tool-invocation",
      );

      if (toolInvocationParts.length > 0) {
        // Encontra o índice da última invocação de ferramenta
        const lastToolInvocationIndex = message.parts.findIndex(
          (part: any, index: number) =>
            part.type === "tool-invocation" &&
            (index === message.parts.length - 1 ||
              message.parts[index + 1].type !== "tool-invocation"),
        );

        // Se houver texto após a última invocação de ferramenta, retorne-o
        if (
          lastToolInvocationIndex !== -1 &&
          lastToolInvocationIndex < message.parts.length - 1
        ) {
          const textPartsAfterTool = message.parts
            .slice(lastToolInvocationIndex + 1)
            .filter((part: any) => part.type === "text")
            .map((part: any) => part.text)
            .join(" ");

          if (textPartsAfterTool.trim().length > 0) {
            return textPartsAfterTool.trim();
          }
        }
      }
    }

    // Tenta uma abordagem alternativa extraindo do conteúdo da mensagem
    if (
      message.content &&
      message.toolInvocations &&
      message.toolInvocations.length > 0
    ) {
      // Tenta encontrar texto após a última menção ao nome da ferramenta
      const lastInvocationIndex = message.content.lastIndexOf("getAssetQuote");
      if (lastInvocationIndex !== -1) {
        const textAfterInvocation = message.content.substring(
          lastInvocationIndex + "getAssetQuote".length,
        );
        if (textAfterInvocation && textAfterInvocation.trim().length > 0) {
          return textAfterInvocation.trim();
        }
      }
    }

    return null;
  };

  return (
    <div
      className={cn(
        "flex",
        message.role === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div className="flex max-w-[80%] items-start gap-3">
        {message.role === "assistant" && (
          <div className="mt-0.5 flex h-8 w-8 min-w-8 items-center justify-center rounded-full bg-blue-600">
            <BotIcon size={16} className="text-white" />
          </div>
        )}
        <div
          className={cn(
            "animate-slide-in",
            message.role === "user" ? "chat-message-user" : "chat-message-ai",
          )}
        >
          {/* Oculta o conteúdo bruto da mensagem que contém chamadas de ferramentas */}
          {(!message.toolInvocations ||
            message.toolInvocations.length === 0) && (
            <p className="break-words">{message.content}</p>
          )}
          <div className="mt-1 text-right">
            <span className="text-xs text-muted-foreground">
              {message.createdAt!.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        {message.role === "user" && (
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
            <img
              className="rounded-full"
              height={30}
              width={30}
              src={user?.imageUrl ?? undefined}
            />
          </div>
        )}

        <div>
          {message.toolInvocations?.map((toolInvocation: any) => {
            const { toolName, toolCallId, state } = toolInvocation;
            if (state === "result") {
              if (toolName === "getAssetQuote") {
                const data = toolInvocation.result.results[0];
                const followUpText = getFollowUpContent();

                return (
                  <div key={toolCallId} className="space-y-3">
                    <StockInfoCard {...data} />
                    {/* Área para o texto explicativo do LLM abaixo do componente */}
                    <div className="mt-3 rounded-lg border bg-slate-50 p-3 text-sm">
                      <p className="font-medium text-slate-700">Análise:</p>
                      <div className="prose prose-sm text-slate-600">
                        {followUpText ? (
                          <p>{followUpText}</p>
                        ) : (
                          <p>
                            O ativo {data.symbol} está cotado a{" "}
                            {data.regularMarketPrice} {data.currency}, com
                            variação de{" "}
                            {data.regularMarketChangePercent.toFixed(2)}% em
                            relação ao preço anterior.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            } else {
              return (
                <div key={toolCallId}>
                  {toolName === "getAssetQuote" ? (
                    <div>Buscando informações na bolsa...</div>
                  ) : null}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
