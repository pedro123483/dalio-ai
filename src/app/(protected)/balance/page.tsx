"use client";

import { useState } from "react";
import { DashboardHeader } from "~/components/balance/dashboard-header"
import { SearchAndUploadCard } from "~/components/balance/search-and-upload-card"
import { BalancePreview } from "~/components/balance/balance-preview"
import { FinancialIndicators } from "~/components/balance/financial-indicators";
import { AiSummary } from "~/components/balance/ai-summary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const Balance = () => {
    const [selectedBalance, setSelectedBalance] = useState({
      company: "",
      year: "",
      period: ""
    });

    const handleBalanceSelect = (company: string, year: string, period: string) => {
      setSelectedBalance({ company, year, period });
    };

    return (
        <div className="flex flex-col h-full">
          {/* <DashboardHeader /> */}
    
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Análise de Balanços</h2>
            </div>
    
            <div className="space-y-4">
              {/* Card que muda conforme a seleção do usuário */}
              <SearchAndUploadCard onBalanceSelect={handleBalanceSelect} />
    
              <div className="grid gap-4 md:grid-cols-2 w-full">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Balanço Patrimonial</CardTitle>
                    <CardDescription>Visualização do documento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BalancePreview 
                      company={selectedBalance.company} 
                      year={selectedBalance.year} 
                      period={selectedBalance.period} 
                    />
                  </CardContent>
                </Card>
    
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
        </div>
      )
};

export default Balance;
