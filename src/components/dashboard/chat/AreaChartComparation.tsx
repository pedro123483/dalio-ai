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
  ResponsiveContainer,
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

  // Processar dados para garantir que apenas meses válidos sejam exibidos
  const safeChartData = useMemo(() => {
    // Se não houver resultados, retorna array vazio
    if (!results || results.length === 0) return [{}];

    // Tratar e validar dados
    const validData = results
      .filter((item) => {
        if (!item.month) return false;
        const hasValidData = Object.entries(item)
          .filter(([key]) => key !== "month")
          .some(([, value]) => value !== null && value !== undefined);
        return hasValidData;
      })
      .map((item) => {
        // Garantir que a propriedade month seja uma string válida de data
        const processedItem = { ...item };

        // Se month não for uma data válida, tenta várias conversões
        if (typeof item.month === "string") {
          // Manter como está, já que será formatado pela função formatFullDate
        } else if (item.month instanceof Date) {
          // Converter Date para string no formato ISO
          processedItem.month = item.month.toISOString();
        } else if (typeof item.month === "number") {
          // Converter timestamp para string de data
          processedItem.month = new Date(item.month).toISOString();
        }

        return processedItem;
      });

    if (validData.length <= 1) return validData;
    return validData;
  }, [results]);

  // Formatação de datas para o eixo X e tooltip
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      // Verificar se é uma string de data válida e converter
      const date = new Date(dateStr);
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return dateStr; // Retorna a string original se não for uma data válida
      }
      return date.toLocaleDateString("pt-BR", { month: "short" });
    } catch (e) {
      return dateStr;
    }
  };

  // Formatar data completa para o tooltip
  const formatFullDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      // Se o formato for yyyy-mm-dd ou ISO
      const date = new Date(dateStr);
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return dateStr; // Retorna a string original se não for uma data válida
      }
      return date.toLocaleDateString("pt-BR");
    } catch (e) {
      return dateStr;
    }
  };

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
    <div className="relative w-full">
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
          <div className="h-full w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300} aspect={undefined}>
                <AreaChart
                  accessibilityLayer
                  data={safeChartData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
                  }}
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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    tick={{ fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={formatDate}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={45}
                    domain={[0, "auto"]}
                    tickFormatter={(value) => {
                      return value.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });
                    }}
                  />
                  {Object.values(chartConfig).map((config, index) => (
                    <Area
                      key={config.label}
                      type="monotone"
                      dataKey={config.label}
                      name={config.label}
                      stroke={config.color}
                      fill={`url(#gradient-${index})`}
                      strokeWidth={2}
                      connectNulls
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      isAnimationActive={false}
                    />
                  ))}
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {safeChartData[0]?.month
                  ? formatFullDate(safeChartData[0].month)
                  : ""}{" "}
                -{" "}
                {safeChartData.length > 1
                  ? formatFullDate(
                      safeChartData[safeChartData.length - 1].month,
                    )
                  : ""}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
