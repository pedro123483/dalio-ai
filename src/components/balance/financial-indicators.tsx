"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from "recharts"

// Dados simulados
const liquidityData = [
  { year: "2019", current: 1.8, quick: 1.2, cash: 0.7 },
  { year: "2020", current: 1.9, quick: 1.3, cash: 0.8 },
  { year: "2021", current: 2.1, quick: 1.5, cash: 0.9 },
  { year: "2022", current: 2.3, quick: 1.7, cash: 1.1 },
  { year: "2023", current: 2.2, quick: 1.6, cash: 1.0 },
]

const profitabilityData = [
  { year: "2019", grossMargin: 32, netMargin: 15, roe: 12 },
  { year: "2020", grossMargin: 34, netMargin: 16, roe: 13 },
  { year: "2021", grossMargin: 36, netMargin: 18, roe: 15 },
  { year: "2022", grossMargin: 38, netMargin: 20, roe: 17 },
  { year: "2023", grossMargin: 40, netMargin: 22, roe: 19 },
]

const debtData = [
  { year: "2019", debtToEquity: 0.8, interestCoverage: 4.5 },
  { year: "2020", debtToEquity: 0.7, interestCoverage: 5.0 },
  { year: "2021", debtToEquity: 0.6, interestCoverage: 5.5 },
  { year: "2022", debtToEquity: 0.5, interestCoverage: 6.0 },
  { year: "2023", debtToEquity: 0.4, interestCoverage: 6.5 },
]

export function FinancialIndicators() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Liquidez Corrente</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">2,2</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  +4,8%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Margem Líquida</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">22%</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  +10%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">ROE</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">19%</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  +11,8%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Dívida/Patrimônio</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">0,4</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  -20%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="liquidity">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="liquidity">Liquidez</TabsTrigger>
          <TabsTrigger value="profitability">Rentabilidade</TabsTrigger>
          <TabsTrigger value="debt">Endividamento</TabsTrigger>
        </TabsList>

        <TabsContent value="liquidity" className="pt-4">
          <div className="h-[300px]">
            <ChartContainer
              config={{
                current: {
                  label: "Liquidez Corrente",
                  color: "hsl(var(--chart-1))",
                },
                quick: {
                  label: "Liquidez Seca",
                  color: "hsl(var(--chart-2))",
                },
                cash: {
                  label: "Liquidez Imediata",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liquidityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="var(--color-current)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line type="monotone" dataKey="quick" stroke="var(--color-quick)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="cash" stroke="var(--color-cash)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="profitability" className="pt-4">
          <div className="h-[300px]">
            <ChartContainer
              config={{
                grossMargin: {
                  label: "Margem Bruta",
                  color: "hsl(var(--chart-1))",
                },
                netMargin: {
                  label: "Margem Líquida",
                  color: "hsl(var(--chart-2))",
                },
                roe: {
                  label: "ROE",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitabilityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="grossMargin" fill="var(--color-grossMargin)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="netMargin" fill="var(--color-netMargin)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="roe" fill="var(--color-roe)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="debt" className="pt-4">
          <div className="h-[300px]">
            <ChartContainer
              config={{
                debtToEquity: {
                  label: "Dívida/Patrimônio",
                  color: "hsl(var(--chart-1))",
                },
                interestCoverage: {
                  label: "Cobertura de Juros",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={debtData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="debtToEquity"
                    stroke="var(--color-debtToEquity)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="interestCoverage"
                    stroke="var(--color-interestCoverage)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
