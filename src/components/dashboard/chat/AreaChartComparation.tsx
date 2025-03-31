"use client";

import { TrendingUp } from "lucide-react";
import { useMemo, useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { DownloadButtons } from "~/components/ui/DownloadButtons";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

// Define um tipo para o chartConfig
type DynamicChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

// Cores predefinidas para os gráficos
const CHART_COLORS = [
  "#2563eb", // azul
  "#16a34a", // verde
  "#dc2626", // vermelho
  "#9333ea", // roxo
  "#ea580c", // laranja
];

interface AreaChartComparationProps {
  tickers: string;
  results: any[];
}

export function AreaChartComparation({
  tickers,
  results,
}: AreaChartComparationProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  // Certifique-se de que chartData tenha pelo menos um item
  const safeChartData = useMemo(() => {
    return results?.length > 0 ? results : [{}];
  }, [results]);

  const chartConfig = useMemo(() => {
    return Object.keys(safeChartData[0] || {})
      .filter((key) => key !== "month")
      .reduce(
        (acc, key, index) => ({
          ...acc,
          [key]: {
            label: key,
            color: CHART_COLORS[index % CHART_COLORS.length],
          },
        }),
        {},
      ) as DynamicChartConfig;
  }, [safeChartData]);

  // Preparar dados para exportação
  const exportData = useMemo(() => {
    return safeChartData.map((item) => {
      const dataPoint: any = {
        date: item.month,
      };
      Object.keys(chartConfig).forEach((key) => {
        dataPoint[key] = item[key];
      });
      return dataPoint;
    });
  }, [safeChartData, chartConfig]);

  // Calcular o domínio do YAxis
  const yAxisDomain = useMemo(() => {
    const allValues = safeChartData.flatMap((item) =>
      Object.entries(item)
        .filter(([key]) => key !== "month")
        .map(([, value]) => Number(value)),
    );
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1; // 10% de padding
    return [Math.max(0, min - padding), max + padding];
  }, [safeChartData]);

  return (
    <div className="relative w-full max-w-[500px]">
      <Card className="relative w-full">
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Comparativo de preços</CardTitle>
              <CardDescription>
                Mostrando a variação de preços dos ativos
              </CardDescription>
            </div>
            <DownloadButtons
              chartRef={chartRef}
              data={exportData}
              symbol="comparativo_precos"
              title="Comparativo de Preços"
            />
          </div>
        </CardHeader>
        <CardContent ref={chartRef}>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={safeChartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
              className="h-[300px] w-full"
              style={{ color: "currentColor" }}
            >
              <defs>
                {Object.values(chartConfig).map((config, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={config.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={config.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>
              <XAxis
                dataKey="month"
                stroke="#64748b"
                tick={{ fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (!value) return "";
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", { month: "short" });
                }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  return value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  color: "#1e293b",
                }}
                formatter={(value: number) => {
                  return value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                }}
                labelFormatter={(label) => label}
              />
              {Object.values(chartConfig).map((config, index) => (
                <Area
                  key={config.label}
                  type="monotone"
                  dataKey={config.label}
                  stroke={config.color}
                  fill={`url(#gradient-${index})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {new Date(safeChartData[0].month).toLocaleDateString("pt-BR")} -{" "}
                {new Date(
                  safeChartData[safeChartData.length - 1].month,
                ).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
