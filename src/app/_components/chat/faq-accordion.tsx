"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqItems = [
  {
    question: "Como funciona a consulta em linguagem natural?",
    answer:
      "Nossa plataforma utiliza modelos avançados de processamento de linguagem natural que permitem que você faça perguntas como se estivesse conversando com um analista financeiro. Basta digitar sua pergunta em português simples, e nosso sistema interpretará sua intenção, buscará os dados relevantes e apresentará os resultados de forma clara e objetiva.",
  },
  {
    question: "Quais fontes de dados financeiros estão disponíveis?",
    answer:
      "A Dalio AI integra-se com diversas fontes de dados financeiros, incluindo Bloomberg, Yahoo Finance, B3, CVM, e outras fontes públicas e privadas. Além disso, podemos integrar com suas fontes de dados internas para análises personalizadas e mais precisas para seu contexto específico.",
  },
  {
    question: "Qual é o modelo de precificação?",
    answer:
      "Oferecemos diferentes planos de assinatura baseados no volume de consultas, número de usuários e fontes de dados necessárias. Temos planos específicos para startups, empresas de médio porte e grandes instituições financeiras. Entre na nossa lista de espera para receber informações detalhadas sobre preços quando o produto for lançado.",
  },
  {
    question: "É necessário conhecimento técnico para usar a plataforma?",
    answer:
      "Não. A Dalio AI foi projetada para ser utilizada por qualquer profissional do mercado financeiro, sem necessidade de conhecimentos técnicos em programação ou ciência de dados. Nossa interface intuitiva permite que você faça consultas complexas usando linguagem natural.",
  },
  {
    question: "Como posso exportar os dados e visualizações?",
    answer:
      "Todos os dados e visualizações gerados pela Dalio AI podem ser facilmente exportados em diversos formatos, incluindo PDF, Excel, CSV e imagens. Também oferecemos integração com ferramentas populares como PowerPoint, Excel e Tableau para incorporar os resultados diretamente em suas apresentações e relatórios.",
  },
]

export function FAQAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

