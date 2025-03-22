"use client"

import { useState, useEffect } from "react"
import { Bot, User, Search } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface DemoResponse {
  content: string
  source: string
  loadingText: string
}

export default function ChatAnimation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou o Dalio AI. Como posso ajudar com suas consultas de dados financeiros hoje?",
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadingSource, setLoadingSource] = useState<string | null>(null)
  const [loadingText, setLoadingText] = useState<string>("")

  const demoQuestions = [
    "Qual o rendimento acumulado do CDI nos últimos 12 meses?",
    "Mostre a variação do IBOVESPA vs S&P500 no último trimestre",
    "Qual a composição atual da carteira teórica do IBXX?",
  ]

  const demoResponses: DemoResponse[] = [
    {
      content:
        "O CDI acumulou rendimento de 12,75% nos últimos 12 meses. A taxa está em tendência de queda desde o último trimestre, com média mensal de 0,97%. Posso mostrar a comparação com outros indicadores de renda fixa?",
      source: "ANBIMA",
      loadingText: "Consultando dados de taxas de juros e indicadores de renda fixa",
    },
    {
      content:
        "No último trimestre, o IBOVESPA teve variação de +8,2%, enquanto o S&P500 subiu 5,7%. A correlação entre os índices foi de 0,68 no período. O IBOVESPA superou o benchmark americano em 2,5 pontos percentuais, principalmente devido à valorização das commodities.",
      source: "Bloomberg",
      loadingText: "Analisando dados comparativos de índices globais",
    },
    {
      content:
        "A composição atual do IBXX tem concentração de 28,4% no setor financeiro, 25,1% em commodities, 12,3% em consumo, 10,8% em utilities, 8,7% em tecnologia e o restante distribuído em outros setores. As 5 maiores posições são VALE3 (12,8%), PETR4 (9,3%), ITUB4 (8,1%), BBDC4 (5,7%) e B3SA3 (4,2%).",
      source: "B3",
      loadingText: "Obtendo dados de composição de índices e carteiras teóricas",
    },
  ]

  useEffect(() => {
    if (currentIndex < demoQuestions.length) {
      const timer = setTimeout(() => {
        simulateUserMessage(currentIndex)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [messages, currentIndex])

  const simulateUserMessage = (index: number) => {
    setTimeout(() => {
      handleSendMessage(demoQuestions[index])
    }, 1500)
  }

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    const newMessages = [...messages, { role: "user", content }]
    setMessages(newMessages)
    setIsTyping(true)

    // Verificar se o índice é válido antes de acessar
    if (currentIndex >= 0 && currentIndex < demoResponses.length) {
      // Mostrar mensagem de carregamento
      setLoadingSource(demoResponses[currentIndex].source)
      setLoadingText(demoResponses[currentIndex].loadingText)

      setTimeout(() => {
        setLoadingSource(null)
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: demoResponses[currentIndex].content,
          },
        ])
        setIsTyping(false)
        setCurrentIndex(currentIndex + 1)
      }, 3000)
    }
  }

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden bg-background border shadow-lg">
      <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <span className="font-medium">Dalio AI - Terminal Financeiro</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === "assistant" && <Bot className="h-5 w-5 mt-0.5 shrink-0" />}
                <div>{message.content}</div>
                {message.role === "user" && <User className="h-5 w-5 mt-0.5 shrink-0" />}
              </div>
            </div>
          </div>
        ))}

        {loadingSource && (
          <div className="flex justify-start">
            <div className="max-w-[80%] w-full rounded-lg p-4 bg-muted/80 border">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary animate-pulse" />
                  <span className="font-medium">Consultando {loadingSource}...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-primary/20 rounded-full w-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full animate-[progress_2s_ease-in-out_infinite]"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">60%</span>
                </div>
                <div className="text-sm text-muted-foreground">{loadingText}...</div>
              </div>
            </div>
          </div>
        )}

        {isTyping && !loadingSource && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <div className="flex space-x-1">
                  <div
                    className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

