"use client";

import { useState } from "react";
import { DashboardHeader } from "~/components/balance/dashboard-header";
import { SearchAndUploadCard } from "~/components/balance/search-and-upload-card";
import { BalancePreview } from "~/components/balance/balance-preview";
import { FinancialIndicators } from "~/components/balance/financial-indicators";
import { AiSummary } from "~/components/balance/ai-summary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button"; // shadcn button

const Balance = () => {
  const [selectedBalance, setSelectedBalance] = useState({
    company: "",
    year: "",
    period: "",
  });
  const [activeTab, setActiveTab] = useState("search");

  const handleBalanceSelect = (
    company: string,
    year: string,
    period: string,
  ) => {
    setSelectedBalance({ company, year, period });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleReset = () => {
    setSelectedBalance({ company: "", year: "", period: "" });
    setActiveTab("search");
  };

  return (
    <div className="flex h-full flex-col">
      {/* <DashboardHeader /> */}

      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        {/* Header com título e botões */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Análise de Documentos
          </h2>

          <div className="flex gap-2">
            {/* Botão Voltar aparece somente se houver algo carregado */}
            {selectedBalance.company && (
              <Button variant="secondary" onClick={handleReset}>
                Voltar
              </Button>
            )}
            <Button variant="outline" onClick={handleReset}>
              Nova análise
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Componente de upload */}
          <SearchAndUploadCard
            onBalanceSelect={handleBalanceSelect}
            onTabChange={handleTabChange}
          />

          {activeTab === "search" && (
            <div className="grid w-full gap-4 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Visualização do documento</CardTitle>
                  
                </CardHeader>
                <CardContent>
                  <BalancePreview
                    company={selectedBalance.company}
                    year={selectedBalance.year}
                    period={selectedBalance.period}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Aqui você pode liberar futuramente: IA e Indicadores */}
          {/* <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Resumo da IA</CardTitle>
              <CardDescription>Principais pontos identificados</CardDescription>
            </CardHeader>
            <CardContent>
              <AiSummary />
            </CardContent>
          </Card> */}
        </div>

        {/* <Card>
          <CardHeader>
            <CardTitle>Indicadores Financeiros</CardTitle>
            <CardDescription>Principais indicadores extraídos do balanço</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialIndicators />
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Balance;
