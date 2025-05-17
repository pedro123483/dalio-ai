import OpenAI from "openai";
import { NextRequest } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: NextRequest) {
  const { pdfUrl, messages } = await req.json();

  try {
    // 1. Baixar o PDF da URL e salvar no storage
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error(`Falha ao buscar PDF: ${response.status}`);
    
    // 2. Criar um Blob a partir da resposta
    const pdfBlob = await response.blob();
    
    // 3. Usar o WebPDFLoader com o Blob
    const loader = new WebPDFLoader(pdfBlob);
    const docs = await loader.load();
    
    // 4. Extrair e juntar o texto de todos os documentos
    const pdfText = docs.map(doc => doc.pageContent).join("\n");
    
    // 5. Limitar o tamanho do contexto
    const context = pdfText.slice(0, 150000);
    
    // 6. Usar streamText para gerar resposta em streaming
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: "Você é um assistente especializado em análise de documentos financeiros." },
        { role: "system", content: context },
        ...messages
      ]
    });
    
    // 7. Retornar como stream
    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error("Erro ao processar PDF:", error);
    return Response.json(
      { error: "Falha ao processar o PDF. Verifique a URL e tente novamente." },
      { status: 500 }
    );
  }
}
