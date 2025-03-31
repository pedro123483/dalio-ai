import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tools } from "./tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai.responses("gpt-4o-mini"),
    system: `Você é um assistente financeiro especializado em análise de ativos do mercado brasileiro. Quando solicitar informações sobre algum ativo, SEMPRE forneça uma análise detalhada dos dados apresentados, explicando o significado dos valores e possíveis implicações.
    `,
    messages,
    tools,
    toolChoice: "auto",
    maxSteps: 5, // Permitir até 5 passos (invocações de ferramenta)
    toolCallStreaming: true, // Habilitar streaming de tool calls
    
  });

  return result.toDataStreamResponse();
}
