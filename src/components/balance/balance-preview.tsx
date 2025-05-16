"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useChat } from "@ai-sdk/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Send, Loader2 } from "lucide-react";

// Configure o worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function BalancePreview({ company, year, period }: { 
  company?: string;
  year?: string;
  period?: string;
}) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Só buscar se todos os parâmetros estiverem presentes
  const enabled = !!company && !!year && !!period;
  
  const { data, isLoading } = api.balance.getBalanceUrl.useQuery(
    { company: company || "", year: year || "", period: period || "" },
    { enabled }
  );

  // Hook do chat para perguntas sobre o PDF
  const { messages, input, handleInputChange, handleSubmit, isLoading: isLoadingChat } = useChat({
    api: '/api/ask-pdf',
    body: {
      pdfUrl: data?.url,
      company,
      year,
      period
    },
  });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!enabled) return <div>Selecione uma empresa, ano e período para visualizar o balanço</div>;
  if (isLoading) return <div>Carregando...</div>;
  if (!data?.url) return <div>PDF não encontrado</div>;

  const handleDownload = async () => {
    if (!data?.url) return;
  
    try {
      // Faz requisição para a URL pré-assinada
      const response = await fetch(data.url);
      if (!response.ok) throw new Error("Falha ao baixar o PDF");
  
      // Converte a resposta em Blob
      const blob = await response.blob();
  
      // Cria um link temporário para o download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `balanco_${company}_${year}_${period}.pdf`;
      document.body.appendChild(link);
      link.click();
  
      // Limpa o link temporário
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar o PDF:", error);
      alert("Não foi possível baixar o PDF. Tente novamente.");
    }
  };

  return (
    <div className="flex w-full">
      <div className="w-1/2 p-2">
        <h1 className="mb-2 text-xl font-bold">Balanço Financeiro</h1>
        <Document
          file={data?.url}
          onLoadSuccess={onDocumentLoadSuccess}
          className="rounded border shadow"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={300}
            height={450}
            scale={0.85}
          />
        </Document>
        <div className="mt-2 flex justify-between text-sm">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="rounded bg-blue-500 px-3 py-1 text-white disabled:bg-gray-300"
          >
            Anterior
          </button>
          <p>
            Página {pageNumber} de {numPages}
          </p>
          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages || prev))
            }
            disabled={pageNumber >= (numPages || 1)}
            className="rounded bg-blue-500 px-3 py-1 text-white disabled:bg-gray-300"
          >
            Próxima
          </button>
        </div>

        <div className="mt-2">
          <button
            onClick={handleDownload}
            disabled={!data?.url}
            className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg disabled:bg-gray-300 hover:bg-green-600 transition"
          >
            Baixar PDF
          </button>
        </div>
      </div>
      
      {/* Área de chat para perguntas sobre o PDF */}
      <div className="w-1/2 p-2 flex flex-col h-[550px] border-l">
        <div className="flex-1 overflow-auto p-4">
          <h2 className="text-xl font-bold mb-4">Pergunte sobre o balanço</h2>
          
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                } max-w-[80%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            
            {isLoadingChat && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <p className="text-sm text-muted-foreground">Analisando balanço...</p>
              </div>
            )}
          </div>
        </div>
        
        <form 
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t p-4"
        >
          <Input
            placeholder="Faça uma pergunta sobre este balanço..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoadingChat}
          />
          <Button type="submit" size="icon" disabled={isLoadingChat || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
