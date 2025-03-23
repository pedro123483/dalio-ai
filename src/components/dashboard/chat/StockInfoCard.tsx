import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";

type StockData = {
  currency: string;
  marketCap: number | null;
  shortName: string;
  longName: string;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketTime: string;
  regularMarketPrice: number;
  regularMarketDayHigh: number;
  regularMarketDayRange: string;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  fiftyTwoWeekRange: string;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  symbol: string;
  priceEarnings: number | null;
  earningsPerShare: number | null;
  logourl: string;
};

export function StockInfoCard({
  currency,
  marketCap,
  shortName,
  longName,
  regularMarketChange,
  regularMarketChangePercent,
  regularMarketTime,
  regularMarketPrice,
  regularMarketDayHigh,
  regularMarketDayRange,
  regularMarketDayLow,
  regularMarketVolume,
  regularMarketPreviousClose,
  regularMarketOpen,
  fiftyTwoWeekRange,
  fiftyTwoWeekLow,
  fiftyTwoWeekHigh,
  symbol,
  priceEarnings,
  earningsPerShare,
  logourl,
}: StockData) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === 0) return "N/A";
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: currency || "BRL",
      minimumFractionDigits: 2,
    });
  };

  // Determine if market change is positive, negative, or neutral
  const isPositive = regularMarketChange > 0;
  const isNeutral = regularMarketChange === 0;

  return (
    <Card className="w-full max-w-md overflow-hidden rounded-lg border bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3 px-4 pb-2 pt-4">
        {logourl && (
          <img
            src={logourl}
            alt={`${symbol} logo`}
            className="h-8 w-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div>
          <h3 className="text-lg font-semibold">{symbol}</h3>
          <p className="text-sm text-muted-foreground">{shortName}</p>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="mb-4 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">
              {formatCurrency(regularMarketPrice)}
            </span>
            <span className="text-xs text-muted-foreground">
              Atualizado em: {formatDate(regularMarketTime)}
            </span>
          </div>

          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isPositive
                ? "text-green-600"
                : isNeutral
                  ? "text-gray-500"
                  : "text-red-600",
            )}
          >
            {isPositive ? (
              <ArrowUp size={16} className="mr-1" />
            ) : isNeutral ? (
              <Minus size={16} className="mr-1" />
            ) : (
              <ArrowDown size={16} className="mr-1" />
            )}
            <span>
              {formatCurrency(regularMarketChange)} (
              {regularMarketChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Abertura:</span>
            <span className="font-medium">
              {formatCurrency(regularMarketOpen)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fechamento Anterior:</span>
            <span className="font-medium">
              {formatCurrency(regularMarketPreviousClose)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mín/Máx (dia):</span>
            <span className="font-medium">
              {regularMarketDayLow || regularMarketDayHigh
                ? `${formatCurrency(regularMarketDayLow)} - ${formatCurrency(regularMarketDayHigh)}`
                : regularMarketDayRange || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mín/Máx (52 sem):</span>
            <span className="font-medium">{fiftyTwoWeekRange || "N/A"}</span>
          </div>
          {priceEarnings !== null && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">P/L:</span>
              <span className="font-medium">
                {priceEarnings?.toFixed(2) || "N/A"}
              </span>
            </div>
          )}
          {earningsPerShare !== null && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">LPA:</span>
              <span className="font-medium">
                {earningsPerShare?.toFixed(2) || "N/A"}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nome:</span>
            <span
              className="max-w-[170px] truncate font-medium"
              title={longName}
            >
              {longName || "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
