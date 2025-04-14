"use client"

import { useState } from "react"
import { Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"

export function BalancePreview() {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(5)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isLoading, setIsLoading] = useState(false)
  const [hasDocument, setHasDocument] = useState(true)

  const handleDownload = () => {
    // Simulação de download
    const link = document.createElement("a")
    link.href = "https://balance-dalio-ai.s3.us-east-2.amazonaws.com/balanco-btg-3t24.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2F5UJPFBT3QBUDPH%2F20250414%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250414T012407Z&X-Amz-Expires=3600&X-Amz-Signature=05717a9bbec8f35f0c94c4733f4b6544dc510b1c0b256126e7c978519253e594&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" // Caminho fictício
    link.download = "https://balance-dalio-ai.s3.us-east-2.amazonaws.com/balanco-btg-3t24.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2F5UJPFBT3QBUDPH%2F20250414%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250414T012407Z&X-Amz-Expires=3600&X-Amz-Signature=05717a9bbec8f35f0c94c4733f4b6544dc510b1c0b256126e7c978519253e594&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 25)
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 25)
    }
  }

  if (!hasDocument) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] border rounded-md p-4 bg-muted/20">
        <p className="text-muted-foreground text-center">
          Nenhum balanço selecionado. Busque uma empresa para visualizar o balanço.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoomLevel <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{zoomLevel}%</span>
          <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden bg-white" style={{ height: "400px" }}>
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="https://balance-dalio-ai.s3.us-east-2.amazonaws.com/balanco-btg-3t24.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2F5UJPFBT3QBUDPH%2F20250414%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250414T012407Z&X-Amz-Expires=3600&X-Amz-Signature=05717a9bbec8f35f0c94c4733f4b6544dc510b1c0b256126e7c978519253e594&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
              alt="Prévia do Balanço"
              className="object-contain"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Próxima
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
