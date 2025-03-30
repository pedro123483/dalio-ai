"use client";

import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

interface ChartData {
  tickers: string;
  results: any[];
}

export function AreaChartComparation({ tickers, results } : ChartData ) {
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
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
          },
        }),
        {},
      ) as DynamicChartConfig;
  }, [safeChartData]);

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Comparativo de preços - {tickers}</CardTitle>
        <CardDescription>
          Mostrando a variação de preços dos ativos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={safeChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (!value) return "";
                const date = new Date(value);
                // Ajusta o mês para exibir corretamente
                date.setMonth(date.getMonth());
                return date.toLocaleDateString('pt-BR', { month: 'short' });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            {Object.keys(chartConfig).map((key) => {
              const config = chartConfig[key];
              if (!config) return null;

              return (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  fill={config.color}
                  fillOpacity={0.4}
                  stroke={config.color}
                  stackId="a"
                />
              );
            })}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {new Date(safeChartData[0].month).toLocaleDateString('pt-BR')} - {new Date(safeChartData[safeChartData.length - 1].month).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
