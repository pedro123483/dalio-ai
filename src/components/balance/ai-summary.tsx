"use client"

import { useState } from "react"
import { Lightbulb, RefreshCw, Copy } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { toast } from "sonner";


export function AiSummary() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleRegenerateAnalysis = () => {
    setIsGenerating(true)

    // Simulação de geração de análise
    setTimeout(() => {
      setIsGenerating(false)
      toast.success("Análise regenerada")
    }, 2000)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(summaryText)
    toast.success("Resumo copiado para a área de transferência")
  }

  // Texto de exemplo para o resumo da IA
  const summaryText = `
    A análise do relatório patrimonial da Petrobras para o ano fiscal de 2023 revela uma posição financeira sólida e em melhoria:

    • Liquidez: A empresa apresenta índices de liquidez robustos, com liquidez corrente de 2,2, indicando boa capacidade de pagamento de obrigações de curto prazo.

    • Rentabilidade: Houve um aumento significativo na margem líquida para 22% (crescimento de 10% em relação ao ano anterior), demonstrando maior eficiência operacional e controle de custos.

    • Endividamento: A relação dívida/patrimônio caiu para 0,4 (redução de 20%), indicando menor alavancagem financeira e redução do risco financeiro.

    • Fluxo de Caixa: Geração de caixa operacional forte, permitindo investimentos em projetos estratégicos e redução de dívidas.

    Pontos de atenção:
    1. Aumento nos custos de exploração em áreas específicas
    2. Exposição a variações cambiais que podem impactar resultados futuros
    3. Necessidade de diversificação da matriz energética para alinhamento com tendências ESG

    Perspectivas: A empresa está bem posicionada para continuar sua trajetória de crescimento sustentável, com foco em eficiência operacional e disciplina de capital.
  `

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <span className="font-medium">Análise Inteligente</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
            <Copy className="h-3.5 w-3.5 mr-1" />
            Copiar
          </Button>
          <Button variant="outline" size="sm" onClick={handleRegenerateAnalysis} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Regenerar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-line">{summaryText}</div>
      </div>
    </div>
  )
}
