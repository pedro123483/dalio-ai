"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, CheckCircle, BarChart, Database, Server, Search, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    setIsSubmitting(true);
    
    // Simulação de envio para backend
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Obrigado! Você está na nossa lista de espera.");
      setEmail("");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto py-6 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* <Brain className="w-8 h-8" /> */}
            <h1 className="text-2xl font-bold">Dalio AI</h1>
          </div>
          {/* <Link to="/dashboard">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Entrar no Dashboard
            </Button>
          </Link> */}
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Acesse dados financeiros sem código
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-10 text-blue-100">
            Potencialize sua análise financeira com agentes de IA que simplificam o acesso a informações do mercado.
            Sem SQL. Sem APIs. Apenas resultados.
          </p>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Seu email profissional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 text-lg"
              >
                {isSubmitting ? "Enviando..." : "Entrar para a lista de espera"}
                {!isSubmitting && <ArrowRight className="ml-2" />}
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2 bg-white/10 rounded-md py-4 px-6">
              <CheckCircle className="text-green-400" />
              <p className="text-lg font-medium">Você está na lista de espera! Entraremos em contato em breve.</p>
            </div>
          )}
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Revolucionando o acesso a dados no mercado financeiro
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Consulte com linguagem natural</h3>
              <p className="text-gray-600">Pergunte aos nossos agentes de IA como se estivesse falando com um colega. Sem necessidade de conhecimentos técnicos.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Acesso a múltiplas fontes</h3>
              <p className="text-gray-600">Conectamos-nos a diversas fontes de dados financeiros, oferecendo uma visão integrada e completa do mercado.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <BarChart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visualizações instantâneas</h3>
              <p className="text-gray-600">Gere gráficos e tabelas automaticamente com base nas suas consultas, sem precisar programar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Ideal para</h2>
          <p className="text-xl text-center mb-16 max-w-3xl mx-auto text-gray-600">
            Nossa solução é projetada especificamente para profissionais do mercado financeiro
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Gestores de Fundos</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Acesse rapidamente dados de mercado para tomada de decisões</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Compare ativos e estratégias sem depender da equipe de TI</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Monitore o desempenho do portfólio em tempo real</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Family Offices</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Gerencie investimentos diversificados com uma visão unificada</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Acompanhe tendências de mercado sem equipes especializadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Obtenha insights personalizados para preservação de patrimônio</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para transformar sua análise financeira?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-blue-100">
            Entre para nossa lista de espera e seja um dos primeiros a experimentar o poder dos agentes de IA no mercado financeiro.
          </p>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Seu email profissional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 flex-grow"
              />
              <Button 
                type="submit"
                disabled={isSubmitting}
                variant="secondary"
                className="whitespace-nowrap"
              >
                {isSubmitting ? "Enviando..." : "Entrar na lista"}
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 bg-white/10 rounded-md py-4 px-6 max-w-md mx-auto">
              <CheckCircle className="text-green-400" />
              <p className="font-medium">Você está na lista de espera!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              {/* <Brain className="w-6 h-6" /> */}
              <span className="text-xl font-bold">Dalio AI</span>
            </div>
            
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Dalio AI. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
