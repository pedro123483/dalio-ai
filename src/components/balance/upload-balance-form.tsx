"use client"
import { useRef, useEffect } from "react";
import type React from "react"
import { useState } from "react"
import { FileUp, File, X, CheckCircle2, Loader2, MessageSquare, Send, Eye } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import { cn } from "~/lib/utils"
import { toast } from "sonner"
import { useChat } from "ai/react"
import { Input } from "~/components/ui/input"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Configuração do worker do PDF.js
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`
}

export function UploadBalanceForm() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [pdfContent, setPdfContent] = useState<string | null>(null)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Hook para o chat com o PDF
  const { messages, input, handleInputChange, handleSubmit, isLoading: isLoadingChat } = useChat({
    api: '/api/chat-pdf',
    body: {
      pdfContent
    },
    onFinish: () => {
      // Feedback de conclusão, se necessário
    },
    onError: (error) => {
      toast.error("Erro ao processar a pergunta", {
        description: error.message || "Tente novamente mais tarde.",
      })
    },
    headers: {
      'Content-Type': 'application/json',
    }
  })

  // Função para rolar para o final
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Rolar para o final quando novas mensagens chegarem
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Rolar para o final quando o conteúdo mudar (para mensagens em streaming)
  useEffect(() => {
    const observer = new MutationObserver(scrollToBottom);
    if (messagesEndRef.current) {
      observer.observe(messagesEndRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
    return () => observer.disconnect();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)

      // Verificar se os arquivos são PDFs
      const invalidFiles = selectedFiles.filter((file) => file.type !== "application/pdf")
      if (invalidFiles.length > 0) {
        toast.error("Formato inválido", {
          description: "Por favor, selecione apenas arquivos PDF",
        })
        return
      }

      // Verificar tamanho dos arquivos (máx 10MB)
      const oversizedFiles = selectedFiles.filter((file) => file.size > 10 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        toast.error("Arquivo muito grande", {
          description: "O tamanho máximo permitido é 10MB",
        })
        return
      }

      setFiles(selectedFiles)
      setUploadComplete(false)
      setPdfContent(null)
      setPdfBlobUrl(null)
      setShowChat(false)
      setShowPreview(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)
    setUploadComplete(false)

    try {
      // Simular progresso 
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      // Ler o arquivo como ArrayBuffer e converter para Base64
      const selectedFile = files[0];
      if (!selectedFile) {
        throw new Error("Nenhum arquivo selecionado");
      }
      
      const arrayBuffer = await selectedFile.arrayBuffer();
      const base64String = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      
      // Preparar o conteúdo do PDF com metadados
      const pdfData = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        content: base64String
      };
      
      // Criar URL do Blob para visualização
      const blob = new Blob([new Uint8Array(arrayBuffer)], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      clearInterval(progressInterval)
      
      // Salvar conteúdo do PDF para uso no chat
      setPdfContent(JSON.stringify(pdfData))
      setPdfBlobUrl(blobUrl)
      setProgress(100)
      setUploadComplete(true)
      setUploading(false)
      
      toast.success("Processado com sucesso", {
        description: "Agora você pode visualizar o documento e fazer perguntas sobre ele.",
      })
    } catch (error) {
      console.error("Erro ao processar:", error)
      toast.error("Erro ao processar o arquivo", {
        description: "Não foi possível processar o arquivo.",
      })
      setUploading(false)
    }
  }

  const startChat = () => {
    setShowChat(true)
    setShowPreview(false)
  }
  
  const viewPdf = () => {
    setShowPreview(true)
    setShowChat(false)
  }
  
  const backToOptions = () => {
    setShowPreview(false)
    setShowChat(false)
  }

  return (
    <div className="space-y-6">
      {/* Interface de upload (apenas visível quando não estiver em modo de chat ou visualização) */}
      {!showChat && !showPreview && (
        <>
          <div
  className={cn(
    "border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors",
    uploading && "opacity-50 pointer-events-none",
  )}
  onDragOver={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}
  onDrop={(e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files);

    const validFiles = droppedFiles.filter((file) => file.type === "application/pdf");
    const invalidFiles = droppedFiles.filter((file) => file.type !== "application/pdf");
    const oversizedFiles = validFiles.filter((file) => file.size > 10 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      toast.error("Formato inválido", {
        description: "Por favor, selecione apenas arquivos PDF",
      });
      return;
    }

    if (oversizedFiles.length > 0) {
      toast.error("Arquivo muito grande", {
        description: "O tamanho máximo permitido é 10MB",
      });
      return;
    }

    setFiles(validFiles);
    setUploadComplete(false);
    setPdfContent(null);
    setPdfBlobUrl(null);
    setShowChat(false);
    setShowPreview(false);
  }}
>

            <input
              type="file"
              id="file-upload"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
              <FileUp className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">Arraste arquivos ou clique para selecionar</p>
              <p className="text-xs text-muted-foreground">Suporta apenas PDF (máx. 10MB)</p>
            </label>
          </div>

          {/* Lista de arquivos selecionados */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Arquivos selecionados</p>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between rounded-md border p-2">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={uploading}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barra de progresso */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Processando arquivo...</p>
                <p className="text-sm font-medium">{progress}%</p>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Mensagem de conclusão e botões de ação */}
          {uploadComplete && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Arquivo processado com sucesso!</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={viewPdf} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visualizar PDF
                </Button>
                
                <Button onClick={startChat} variant="secondary" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Fazer Perguntas sobre o Documento
                </Button>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" disabled={uploading}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={files.length === 0 || uploading || uploadComplete}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Processar Documento"
              )}
            </Button>
          </div>
        </>
      )}

      {/* Visualização do PDF */}
      {showPreview && pdfBlobUrl && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Visualização do PDF</h3>
            <Button variant="outline" onClick={backToOptions}>
              Voltar
            </Button>
          </div>
          
          <div className="border rounded-lg p-4 bg-background">
            <CustomPdfPreview pdfUrl={pdfBlobUrl} />
          </div>
        </div>
      )}

      {/* Área de chat */}
      {showChat && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Chat com o Documento</h3>
            <Button variant="outline" onClick={backToOptions}>
              Voltar
            </Button>
          </div>
          
          <div className="border rounded-lg h-[500px] flex flex-col">
            <div className="flex-1 p-4 overflow-auto">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">
                  Faça perguntas sobre o documento que você enviou.
                </p>
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
                  <div ref={messagesEndRef} />
                </div>
              )}
              
              {isLoadingChat && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <p className="text-sm text-muted-foreground">Analisando documento...</p>
                </div>
              )}
            </div>
            
            <form 
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t p-4"
            >
              <Input
                placeholder="Faça uma pergunta sobre este documento..."
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
      )}
    </div>
  )
}

// Componente simplificado para visualização de PDF
function CustomPdfPreview({ pdfUrl }: { pdfUrl: string }) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="border rounded-md overflow-auto max-h-[70vh] w-full">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex justify-center items-center h-[500px]">
              <p>Carregando PDF...</p>
            </div>
          }
          error={
            <div className="flex justify-center items-center h-[500px]">
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

      {numPages && numPages > 1 && (
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
    </div>
  )
}
