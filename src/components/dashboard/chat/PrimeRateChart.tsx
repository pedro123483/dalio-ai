"use client";

import { useMemo, useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

interface PrimeRateChartProps {
  data: Array<{
    date: string;
    value: string;
    epochDate: number;
  }>;
}

export function PrimeRateChart({ data }: PrimeRateChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  // Processar e ordenar os dados por data (mais antiga para mais recente)
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Agrupar por mês para simplificar o gráfico (dados diários podem ser muito densos)
    const monthlyData = new Map<string, { date: string; value: string; epochDate: number }>();
    
    // Ordenar por data (mais antiga para mais recente)
    const sortedData = [...data].sort((a, b) => a.epochDate - b.epochDate);
    
    // Agrupar por mês (pegando o primeiro valor de cada mês)
    sortedData.forEach(item => {
      const parts = item.date.split('/');
      const monthKey = `${parts[1]}/${parts[2]}`; // MM/YYYY
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, item);
      }
    });
    
    // Converter para array e mapear para o formato desejado
    return Array.from(monthlyData.values()).map(item => ({
      date: item.date,
      value: parseFloat(item.value),
      epochDate: item.epochDate,
    }));
  }, [data]);

  // Configuração do gráfico
  const chartConfig = {
    primeRate: {
      label: "Taxa Selic (%)",
      color: "#9333ea", // Cor roxa para diferenciar da inflação
    },
  };

  // Formatação de datas para o eixo X
  const formatXAxisDate = (dateStr: any): string => {
    if (!dateStr) return "";
    
    const str = String(dateStr);
    
    // Formato esperado: "01/01/2021"
    const parts = str.split("/");
    if (parts.length !== 3) return str;

    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    // Ajustar para o mês correto (índice 0-based)
    const monthIndex = parseInt(parts[1] || "0") - 1;
    if (monthIndex < 0 || monthIndex >= 12) return str;
    
    return `${months[monthIndex]}/${parts[2]}`;
  };

  // Calcular mínimo e máximo para o domínio do eixo Y
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [9, 13];
    
    const values = chartData.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Definir limites mais estreitos para destacar as variações
    // Arredondar para baixo/cima com 0.5 de margem
    const minValue = Math.floor(min * 2) / 2 - 0.5;
    const maxValue = Math.ceil(max * 2) / 2 + 0.5;
    
    return [Math.max(0, minValue), maxValue];
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Taxa de Juros Básica (Selic)
        </CardTitle>
      </CardHeader>
      <CardContent ref={chartRef} className="p-2 sm:p-4">
        <div className="h-full w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer
              width="100%"
              height={300}
              aspect={undefined}
            >
              <AreaChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 5,
                }}
                style={{ color: "currentColor" }}
              >
                <defs>
                  <linearGradient
                    id="gradient-primerate"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={chartConfig.primeRate.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartConfig.primeRate.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                  opacity={0.4}
                />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatXAxisDate}
                  minTickGap={15}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={45}
                  domain={yDomain}
                  tickFormatter={(value) => `${value.toString()}%`}
                  ticks={[10, 10.5, 11, 11.5, 12, 12.5]}
                  allowDecimals={true}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="stepAfter"
                  dataKey="value"
                  name="Taxa Selic"
                  stroke={chartConfig.primeRate.color}
                  fill="url(#gradient-primerate)"
                  strokeWidth={2}
                  connectNulls
                  dot
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
