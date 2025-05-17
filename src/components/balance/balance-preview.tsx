"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { useChat } from "@ai-sdk/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Configure o worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function BalancePreview({ company, year, period }: { 
  company?: string;
  year?: string;
  period?: string;
}) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0); // Chave para forçar recriação do chat
  
  // Guarda os valores anteriores para detectar mudanças
  const prevCompanyRef = useRef(company);
  const prevYearRef = useRef(year);
  const prevPeriodRef = useRef(period);

  // Só buscar se todos os parâmetros estiverem presentes
  const enabled = !!company && !!year && !!period;
  
  const { data, isLoading: isLoadingApi } = api.balance.getBalanceUrl.useQuery(
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
    // A chave de reset faz com que um novo chat seja criado quando alterada
    id: `pdf-chat-${company}-${year}-${period}-${resetKey}`,
  });
  
  // Detectar mudanças nos parâmetros do PDF e resetar o chat
  useEffect(() => {
    // Verificar se mudamos de PDF
    if (
      (prevCompanyRef.current !== company || 
       prevYearRef.current !== year || 
       prevPeriodRef.current !== period) &&
      prevCompanyRef.current !== undefined && 
      prevYearRef.current !== undefined && 
      prevPeriodRef.current !== undefined
    ) {
      // Incrementar a chave de reset para forçar um novo chat
      setResetKey(prev => prev + 1);
    }
    
    // Atualizar as refs para os valores atuais
    prevCompanyRef.current = company;
    prevYearRef.current = year;
    prevPeriodRef.current = period;
  }, [company, year, period]);

  // Reset isLoading quando a URL do PDF mudar
  useEffect(() => {
    setIsLoading(true);
    setNumPages(null);
    setPageNumber(1);
  }, [data?.url]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  if (!enabled) return <div>Selecione uma empresa, ano e período para visualizar o balanço</div>;
  if (isLoadingApi) return <div>Carregando...</div>;
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
        {isLoading && (
          <div className="flex justify-center items-center h-[400px] w-full">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Carregando documento...</p>
            </div>
          </div>
        )}

        <div className={cn("border rounded-md overflow-auto max-h-[70vh] w-full", isLoading && "hidden")}>
          <Document
            file={data?.url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            error={
              <div className="flex justify-center items-center h-[400px]">
                <p>Erro ao carregar o PDF. Verifique se o arquivo é válido.</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={Math.min(600, window.innerWidth - 48)}
            />
          </Document>
        </div>

        {numPages && numPages > 1 && !isLoading && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              onClick={previousPage}
              disabled={pageNumber <= 1}
              variant="outline"
              size="sm"
            >
              Anterior
            </Button>
            <p className="text-sm text-muted-foreground">
              Página {pageNumber} de {numPages}
            </p>
            <Button
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              variant="outline"
              size="sm"
            >
              Próxima
            </Button>
          </div>
        )}

        <div className={cn("mt-2", isLoading && "hidden")}>
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
      {!isLoading ? (
        <div className="w-1/2 p-2 flex flex-col h-[700px] border-l">
          <div className="flex-1 overflow-auto p-4">
            <h2 className="text-xl font-bold mb-6 mt-2">Pergunte sobre o balanço</h2>
            
            <div className="space-y-4 mt-8">
              {messages.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <p className="text-muted-foreground text-center">
                    Faça perguntas sobre este balanço financeiro.<br />
                    Por exemplo: "Qual foi o lucro líquido?" ou "Qual o valor do patrimônio líquido?"
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "p-3 rounded-lg max-w-[80%]",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted mr-auto"
                      )}
                    >
                      {message.role === "user" ? (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
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
      ) : (
        <div className="w-1/2 h-[500px] flex flex-col justify-center items-center border-l">
          <div className="text-center p-8">
            <p className="text-muted-foreground">O chat será exibido quando o documento for carregado.</p>
          </div>
        </div>
      )}
    </div>
  );
}
