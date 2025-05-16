"use client"

import type React from "react"
import { useState } from "react"
import { FileUp, File, X, CheckCircle2, Loader2, MessageSquare, Send } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import { cn } from "~/lib/utils"
import { toast } from "sonner"
import { useChat } from "ai/react"
import { Input } from "~/components/ui/input"

export function UploadBalanceForm() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [pdfContent, setPdfContent] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  
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
      setShowChat(false)
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
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      clearInterval(progressInterval)
      
      // Salvar conteúdo do PDF para uso no chat
      setPdfContent(JSON.stringify(pdfData))
      setProgress(100)
      setUploadComplete(true)
      setUploading(false)
      
      toast.success("Processado com sucesso", {
        description: "Agora você pode fazer perguntas sobre o documento.",
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
  }

  return (
    <div className="space-y-6">
      {/* Interface de upload (apenas visível quando não estiver em modo de chat) */}
      {!showChat && (
        <>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors",
              uploading && "opacity-50 pointer-events-none",
            )}
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

          {/* Mensagem de conclusão e botão de chat */}
          {uploadComplete && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Arquivo processado com sucesso!</span>
              </div>
              
              <Button onClick={startChat} className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Fazer Perguntas sobre o Documento
              </Button>
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

      {/* Área de chat */}
      {showChat && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Chat com o Documento</h3>
            <Button variant="outline" onClick={() => setShowChat(false)}>
              Voltar para Upload
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
                      className={`p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      } max-w-[80%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ))}
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
