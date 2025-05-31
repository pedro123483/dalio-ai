"use client";

import { useMemo, useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
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

interface InflationChartProps {
  data: Array<{
    date: string;
    value: string;
    epochDate: number;
  }>;
}

export function InflationChart({ data }: InflationChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  // Processar e ordenar os dados por data (mais antiga para mais recente)
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [...data]
      .sort((a, b) => a.epochDate - b.epochDate)
      .map((item) => ({
        date: item.date,
        value: parseFloat(item.value),
        epochDate: item.epochDate,
      }));
  }, [data]);

  // Configuração do gráfico
  const chartConfig = {
    inflation: {
      label: "Inflação (%)",
      color: "#2563eb",
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Evolução da Inflação
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
                    id="gradient-inflation"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={chartConfig.inflation.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartConfig.inflation.color}
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
                  domain={[0, "auto"]}
                  tickFormatter={(value) => `${value.toString()}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Inflação"
                  stroke={chartConfig.inflation.color}
                  fill="url(#gradient-inflation)"
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
