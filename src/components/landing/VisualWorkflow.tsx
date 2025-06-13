"use client";

import React from "react";
import {
  Search,
  Database,
  BarChart,
  Table,
  BrainCircuit,
  ArrowRight,
  ArrowDown,
  LineChart,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { MarketDataCard } from "../ui/MarketDataCard";
import { useIsMobile } from "~/hooks/use-mobile";

export function VisualWorkflow() {
  const isMobile = useIsMobile();
  const ArrowIcon = isMobile ? ArrowDown : ArrowRight;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div
        className={`mb-16 grid grid-cols-1 gap-8 ${
          isMobile ? "" : "md:grid-cols-3"
        }`}
      >
        {/* Step 1: User Query */}
        <div className="flex flex-col">
          <div className="mb-4 text-center">
            <h3 className="mb-4 text-xl font-bold">Pergunta do Usuário</h3>
          </div>
          <div className="flex flex-grow flex-col items-center justify-center">
            <div className="mx-auto mb-6">
              <div className="flex items-center rounded-lg border bg-white p-4 shadow-sm">
                <Search className="mr-2 h-5 w-5 text-blue-500" />
                <p className="text-left font-medium text-gray-800">
                  Qual a performance do Ibovespa nos últimos 6 meses?
                </p>
              </div>
            </div>
          </div>
          <div className="mt-auto flex justify-center">
            <ArrowIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Step 2: AI Processing */}
        <div className="flex flex-col">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold">Nosso Agente de IA</h3>
          </div>
          <div className="flex flex-grow flex-col items-center justify-center">
            <div className="mb-4 rounded-full bg-blue-600 p-4">
              <BrainCircuit className="h-10 w-10 text-white" />
            </div>

            {/* Data Sources */}
            <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 p-2">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs font-medium">Bloomberg</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 p-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs font-medium">B3</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 p-2">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs font-medium">ANBIMA</p>
              </div>
            </div>
          </div>
          <div className="mt-auto flex justify-center pt-8">
            <ArrowIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Step 3: Results */}
        <div className="flex flex-col">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold">Visualização Simplificada</h3>
          </div>
          <div className="flex flex-grow flex-col items-center justify-center">
            <div className="grid w-full max-w-xs grid-cols-1 gap-4">
              {/* Card Display */}
              <MarketDataCard
                title="Ibovespa"
                value="127.456"
                change={15.3}
                className="w-full shadow-sm"
              />

              {/* Table Display */}
              <div className="w-full rounded-lg border bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center">
                  <Table className="mr-2 h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-semibold">Top Ações</h4>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between rounded bg-gray-50 px-2 py-1">
                    <span>PETR4</span>
                    <span className="text-green-600">+21.2%</span>
                  </div>
                  <div className="flex justify-between rounded bg-gray-50 px-2 py-1">
                    <span>VALE3</span>
                    <span className="text-green-600">+14.8%</span>
                  </div>
                </div>
              </div>

              {/* Chart Display */}
              <div className="w-full rounded-lg border bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center">
                  <LineChart className="mr-2 h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-semibold">Evolução</h4>
                </div>
                <div className="flex h-12 items-end space-x-1">
                  <div className="h-5 w-full rounded-t-sm bg-blue-100"></div>
                  <div className="h-7 w-full rounded-t-sm bg-blue-200"></div>
                  <div className="h-10 w-full rounded-t-sm bg-blue-300"></div>
                  <div className="h-6 w-full rounded-t-sm bg-blue-200"></div>
                  <div className="h-4 w-full rounded-t-sm bg-blue-100"></div>
                  <div className="h-3 w-full rounded-t-sm bg-blue-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
