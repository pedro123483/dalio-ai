"use client"

import type React from "react"

import { useState } from "react"
import { FileUp, File, X, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import { cn } from "~/lib/utils"
import { toast } from "sonner";

export function UploadBalanceForm() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)

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
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)
    setUploadComplete(false)

    // Simulação de upload e processamento
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadComplete(true)

          // Redirecionar para a aba de busca após o upload
          setTimeout(() => {
            toast.success("Upload concluído", {
              description: "Balanço processado com sucesso. Você pode visualizar os resultados na aba Buscar Balanço.",
            })

            // Aqui você poderia redirecionar para a aba de busca
            // ou atualizar o estado global da aplicação
          }, 1000)

          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
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

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Processando arquivo...</p>
            <p className="text-sm font-medium">{progress}%</p>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {uploadComplete && (
        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Upload concluído com sucesso!</span>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled={uploading}>
          Cancelar
        </Button>
        <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Enviar para Análise"
          )}
        </Button>
      </div>
    </div>
  )
}
