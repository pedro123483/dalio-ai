"use client";

import { TrendingUp } from "lucide-react";
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

export function AreaChartComparation({ chartData }: { chartData: any[] }) {
  // Certifique-se de que chartData tenha pelo menos um item
  const safeChartData = chartData?.length > 0 ? chartData : [{}];

  const chartConfig = Object.keys(safeChartData[0] || {})
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo de preços</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
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
              tickFormatter={(value) => (value ? value.slice(0, 3) : "")}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            {Object.keys(chartConfig).map((key) => {
              // Certifique-se de que chartConfig[key] existe
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
              {safeChartData[0].month} - {safeChartData[safeChartData.length - 1].month}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
