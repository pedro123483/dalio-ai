import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface IpcaData {
  date: string;
  value: number;
}

interface IpcaChartProps {
  data: IpcaData[];
}

export function IpcaChart({ data }: IpcaChartProps) {
  // Função para formatar o valor no tooltip
  const formatValue = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Função para formatar a data no eixo X
  const formatDate = (date: string) => {
    const [month, year] = date.split("/");
    if (!month || !year) return date;
    return `${month}/${year.slice(2)}`;
  };

  // Calcular o valor máximo e mínimo para melhor visualização
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const padding = (maxValue - minValue) * 0.1; // 10% de padding

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatValue}
              tick={{ fontSize: 12 }}
              domain={[minValue - padding, maxValue + padding]}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)}%`, "IPCA"]}
              labelFormatter={(label) => `Período: ${label}`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}