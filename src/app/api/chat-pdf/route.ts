// src/app/api/chat-pdf/route.ts
import { openai } from "@ai-sdk/openai";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { streamText } from "ai";
import { Message } from "ai";

export async function POST(req: Request) {
  try {
    const { pdfContent, messages } = await req.json();
    
    if (!pdfContent || !messages || !messages.length) {
      return Response.json(
        { error: "pdfContent e messages são obrigatórios" },
        { status: 400 }
      );
    }
    
    // Obter a última mensagem do usuário
    const lastUserMessage = messages[messages.length - 1]?.content;
    if (!lastUserMessage || typeof lastUserMessage !== 'string') {
      return Response.json(
        { error: "Mensagem do usuário é inválida" },
        { status: 400 }
      );
    }
    
    try {
      // Converter o JSON string para objeto
      const pdfData = JSON.parse(pdfContent);
      
      // Decodificar o Base64 para ArrayBuffer
      const binaryString = atob(pdfData.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Criar um Blob com o conteúdo do PDF
      const blob = new Blob([bytes], { type: 'application/pdf' });
      
      // Carregar o PDF e extrair o texto
      const loader = new WebPDFLoader(blob);
      const docs = await loader.load();
      
      // Concatenar todo o texto dos documentos (com limite de tamanho)
      const pdfText = docs.map(doc => doc.pageContent).join("\n").slice(0, 15000);
      
      // Criar o prompt com contexto
      const prompt = `
      Abaixo está o conteúdo de um PDF de relatório financeiro. Use APENAS as informações presentes
      neste documento para responder à pergunta.
      
      CONTEÚDO DO PDF:
      ${pdfText}
      
      PERGUNTA: ${lastUserMessage}
      `;
      
      // Preparar as mensagens para o modelo
      const systemMessage: Message = { 
        id: "system", 
        role: "system", 
        content: "Você é um assistente especializado em análise de documentos financeiros."
      };
      
      const contextMessage: Message = {
        id: "context",
        role: "user",
        content: prompt
      };
      
      // Criar stream de resposta
      const result = await streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          systemMessage,
          contextMessage
        ]
      });
      
      return result.toDataStreamResponse();
    } catch (pdfError) {
      console.error("Erro ao processar o PDF:", pdfError);
      return Response.json(
        { error: "Não foi possível processar o PDF." },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    return Response.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    );
  }
}