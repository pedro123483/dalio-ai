"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle,
  BarChart,
  Database,
  Server,
  Search,
  Brain,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import Link from "next/link";
import { api } from "~/trpc/react";
import { VisualWorkflow } from "~/components/landing/VisualWorkflow";
import { StockList } from "~/components/StockList";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createLead = api.lead.createLead.useMutation();

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!email || !email.includes("@")) {
  //     toast.error("Por favor, insira um email válido");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   createLead.mutate(
  //     {
  //       email: email,
  //     },
  //     {
  //       onSuccess: () => {
  //         setIsSubmitting(false);
  //         setIsSubmitted(true);
  //         toast.success("Obrigado! Você está na nossa lista de espera.");
  //         setEmail("");
  //       },
  //       onError: () => {
  //         toast.error("Erro ao salvar o email");
  //       },
  //     },
  //   );
  // };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <div className="flex items-center gap-2">
            {/* <Brain className="w-8 h-8" /> */}
            <h1 className="text-2xl font-bold">Dalio AI</h1>
          </div>
          <Link href="/sign-in">
            <Button
              variant="default"
              className="bg-blue-600 text-white hover:bg-blue-600"
            >
              Entrar
            </Button>
          </Link>
        </div>

        <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center md:py-32">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            O futuro do mercado financeiro começa aqui
          </h1>
          <p className="mb-10 max-w-3xl text-xl text-blue-100 md:text-2xl">
            Potencialize sua análise financeira com agentes de Inteligência
            Artificial que simplificam o acesso a informações do mercado. Sem
            SQL. Sem APIs. Apenas resultados.
          </p>

          <div className="flex w-full max-w-md flex-col gap-4">
            <Link href="/sign-up">
              <Button className="h-12 w-full text-lg">
                Criar conta gratuitamente
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
            Revolucionando o acesso a dados no mercado financeiro
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">
                Consulte com linguagem natural
              </h3>
              <p className="text-gray-600">
                Pergunte aos nossos agentes de IA como se estivesse falando com
                um colega. Sem necessidade de conhecimentos técnicos.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">
                Acesso a múltiplas fontes
              </h3>
              <p className="text-gray-600">
                Conectamos-nos a diversas fontes de dados financeiros,
                oferecendo uma visão integrada e completa do mercado.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <BarChart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">
                Visualizações instantâneas
              </h3>
              <p className="text-gray-600">
                Gere gráficos e tabelas automaticamente com base nas suas
                consultas, sem precisar programar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-3xl font-bold md:text-4xl">
            Ideal para
          </h2>
          <p className="mx-auto mb-16 max-w-3xl text-center text-xl text-gray-600">
            Nossa solução é projetada especificamente para profissionais do
            mercado financeiro
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-2xl font-bold">
                Fundos de Investimento
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span>
                    Acesse rapidamente dados de mercado para tomada de decisões
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span>
                    Compare ativos e estratégias sem depender da equipe de TI
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span>
                    Gestão eficiente de riscos para preservar a estratégia
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-2xl font-bold">Family Offices</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span>
                    Gerencie investimentos diversificados com uma visão
                    unificada
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span>
                    Acompanhe tendências de mercado sem equipes especializadas
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span>
                    Obtenha insights personalizados para preservação de
                    patrimônio
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-2xl font-bold">Bancos</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span>
                    Automação de análises e relatórios internos sem depender da
                    equipe de TI
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span>
                    Consulta de dados históricos através de linguagem natural
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span>
                    Compare diferentes ativos e benchmarks de forma simples
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-3xl font-bold md:text-4xl">
            Como Funciona
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-xl text-gray-600">
            Transformando perguntas em linguagem natural em dados financeiros
            acionáveis
          </p>

          <VisualWorkflow />

          <div className="mt-16 text-center">
            <p className="mx-auto mb-6 max-w-2xl text-gray-600">
              Nossa inteligência artificial processa sua pergunta, busca dados
              em tempo real de fontes confiáveis, e apresenta resultados
              precisos em segundos — sem necessidade de codificação ou
              conhecimento técnico.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-3xl font-bold md:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-xl text-gray-600">
            Respostas para as dúvidas mais comuns sobre a Dalio AI
          </p>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="item-1"
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="py-4 text-lg font-medium hover:no-underline">
                  Como funciona a consulta em linguagem natural?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  Nossa plataforma utiliza tecnologia avançada de Inteligência
                  Artificial para interpretar suas perguntas em linguagem
                  natural. Você pode fazer consultas como "Qual a performance
                  das ações de tecnologia nos últimos 6 meses?" ou "Compare o
                  desempenho do Ibovespa com o S&P 500", e nossos agentes de IA
                  traduzirão sua pergunta em consultas técnicas para fornecer os
                  dados solicitados.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="py-4 text-lg font-medium hover:no-underline">
                  Quais fontes de dados financeiros estão disponíveis?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  A Dalio AI conecta-se a diversas fontes de dados financeiros,
                  incluindo B3, CVM, dados macroeconômicos globais, cotações em
                  tempo real, séries históricas de preços, indicadores
                  financeiros, relatórios corporativos e muito mais. Estamos
                  constantemente expandindo nossas fontes para fornecer a
                  cobertura mais abrangente possível.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="py-4 text-lg font-medium hover:no-underline">
                  Qual é o modelo de precificação?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  Oferecemos planos flexíveis que se adaptam ao tamanho da sua
                  organização. Temos opções para profissionais individuais,
                  empresas pequenas e grandes instituições. Todos os planos
                  oferecem acesso ilimitado à plataforma, com variações na
                  quantidade de consultas, usuários simultâneos e fontes de
                  dados disponíveis. Entre em contato para uma demonstração
                  personalizada.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="py-4 text-lg font-medium hover:no-underline">
                  É necessário conhecimento técnico para usar a plataforma?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  Não é necessário conhecimento técnico. Nossa plataforma foi
                  projetada para ser intuitiva e acessível para todos os
                  profissionais do mercado financeiro, independentemente do seu
                  nível de habilidade técnica. Você pode interagir com os dados
                  usando linguagem natural, sem precisar conhecer SQL, Python ou
                  outras linguagens de programação.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="py-4 text-lg font-medium hover:no-underline">
                  Como posso exportar os dados e visualizações?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  A Dalio AI permite exportar todos os dados e visualizações em
                  diversos formatos, incluindo Excel, CSV, PDF e imagens de alta
                  resolução.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Pronto para transformar sua análise financeira?
          </h2>
          <p className="mx-auto mb-10 max-w-3xl text-xl text-blue-100">
            Crie sua conta e seja um dos primeiros a experimentar o poder dos
            agentes de Inteligência Artificial no mercado financeiro.
          </p>

          <div className="flex justify-center">
            <Link href="/sign-up">
              <Button className="h-12 w-auto bg-gray-900 px-8 text-lg enabled:hover:bg-gray-800">
                Criar conta gratuitamente
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 flex items-center gap-2 md:mb-0">
              {/* <Brain className="w-6 h-6" /> */}
              <span className="text-xl font-bold">Dalio AI</span>
            </div>

            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Dalio AI. Todos os direitos
              reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
