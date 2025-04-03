"use client";

import { MessageSquare, BotMessageSquare, BotIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Message } from "~/types/chat";
import { useUser } from "@clerk/clerk-react";
import { StockInfoCard } from "./StockInfoCard";
import { AreaChartComparation } from "./AreaChartComparation";
import { IncomeStatementCard } from "./IncomeStatementCard";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
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
            return (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {textPartsAfterTool.trim()}
              </ReactMarkdown>
            );
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
          return (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {textAfterInvocation.trim()}
            </ReactMarkdown>
          );
        }
      }
    }

    return null;
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "flex",
        message.role === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div className="flex max-w-[95%] items-start gap-2 sm:max-w-[80%] sm:gap-3">
        {message.role === "assistant" && (
          <div className="mt-0.5 flex h-6 w-6 min-w-6 items-center justify-center rounded-full bg-blue-600 sm:h-8 sm:w-8 sm:min-w-8">
            <BotIcon size={14} className="text-white sm:text-base" />
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message.content}
            </ReactMarkdown>
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
          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-secondary sm:h-8 sm:w-8">
            <img
              className="rounded-full"
              height={24}
              width={24}
              src={user?.imageUrl ?? undefined}
            />
          </div>
        )}

        <div>
          {message.toolInvocations?.map((toolInvocation: any) => {
            const { toolName, toolCallId, state } = toolInvocation;

            if (state === "result") {
              if (toolName === "getIncomeStatement") {
                const data = toolInvocation.result;
                const followUpText = getFollowUpContent();

                console.log("data", data);

                return (
                  <div key={toolCallId}>
                    <IncomeStatementCard {...data} />
                    {/* Área para o texto explicativo do LLM abaixo do componente */}
                    <div className="mt-3 rounded-lg border bg-slate-50 p-3 text-sm">
                      <p className="font-medium text-slate-700">Análise:</p>
                      <div className="prose prose-sm text-slate-600">
                        {followUpText}
                      </div>
                    </div>
                  </div>
                );
              }
            } else {
              return (
                <div key={toolCallId}>
                  {toolName === "getAssetQuote" ? (
                    <div>Buscando informações na internet...</div>
                  ) : null}
                </div>
              );
            }
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
                        {followUpText}
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

            if (toolName === "compareMultipleAssets") {
              const data: { tickers: string; results: any[] } | undefined =
                toolInvocation.result;
              const followUpText = getFollowUpContent();

              if (state === "call" || isLoading) {
                return (
                  <div key={toolCallId} className="py-3">
                    <div className="flex items-center space-x-2 rounded-lg border bg-card p-4">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      <p className="text-sm text-muted-foreground">
                        Consultando dados dos ativos para comparação...
                      </p>
                    </div>
                  </div>
                );
              }

              // Verifica se há dados para exibir
              if (
                !data?.results ||
                !Array.isArray(data.results) ||
                data.results.length === 0
              ) {
                return (
                  <div key={toolCallId} className="py-3">
                    <div className="rounded-lg border bg-card p-4">
                      <p className="text-sm text-muted-foreground">
                        Não foi possível obter dados para os ativos solicitados.
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={toolCallId} className="py-3">
                  <AreaChartComparation
                    tickers={data.tickers}
                    results={data.results}
                  />
                  {/* Área para o texto explicativo do LLM abaixo do componente */}
                  <div className="mt-3 rounded-lg border bg-slate-50 p-3 text-sm">
                    <p className="font-medium text-slate-700">Análise:</p>
                    <div className="prose prose-sm text-slate-600">
                      {followUpText}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={toolCallId}>
                  {toolName === "compareMultipleAssets" ? (
                    <div>Buscando informações de comparação de ativos...</div>
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
