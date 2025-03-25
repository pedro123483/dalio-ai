"use client";

import { cn } from "~/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

interface MarketDataCardProps {
  title: string;
  value: string;
  change: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function MarketDataCard({
  title,
  value,
  change,
  prefix,
  suffix,
  className,
}: MarketDataCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Card className={cn("financial-card", className)}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-end justify-between">
            <p className="text-xl font-semibold">
              {prefix}
              {value}
              {suffix}
            </p>
            <div
              className={cn(
                "flex items-center text-sm font-medium",
                isPositive
                  ? "text-green-600"
                  : isNeutral
                    ? "text-gray-500"
                    : "text-red-600",
              )}
            >
              {!isNeutral &&
                (isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
              <span className="ml-1">{Math.abs(change).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
