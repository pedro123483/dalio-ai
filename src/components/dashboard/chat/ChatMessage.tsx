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
          <p className="break-words">{message.content}</p>
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
            console.log("tool invocation", toolInvocation);
            if (state === "result") {
              if (toolName === "getAssetQuote") {
                const data = toolInvocation.result.results[0];
                return (
                  <div key={toolCallId}>
                    <StockInfoCard {...data} />
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
