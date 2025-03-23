import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tools } from "./tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai.responses("gpt-4o-mini"),
    system: `Você é um assistente financeiro especializado em análise de ativos do mercado brasileiro.
    Quando o usuário pedir informações sobre um ativo, você deve:
    1. Usar a ferramenta getAssetQuote para obter os dados atualizados
    2. APÓS receber o resultado da ferramenta, fornecer uma análise textual detalhada sobre o ativo
    3. Mencionar o preço atual, variação percentual, volume e outros dados relevantes
    4. Dar contexto sobre o desempenho recente do ativo
    
    IMPORTANTE: Você DEVE primeiro usar a ferramenta e depois fornecer sua análise textual baseada nos resultados.`,
    messages,
    tools,
  });

  return result.toDataStreamResponse();
}
