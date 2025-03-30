"use client";

import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { Download } from "lucide-react";
import * as htmlToImage from "html-to-image";

interface StockData {
  symbol: string;
  price: number;
  date: string;
}

interface StockCardProps {
  stock: StockData;
}

export function StockCard({ stock }: StockCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExportImage = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      // Criar link para download
      const link = document.createElement("a");
      link.download = `${stock.symbol}_${stock.date}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao exportar imagem:", error);
    }
  };

  return (
    <div className="relative">
      <div ref={cardRef} className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
          <span className="text-lg font-semibold text-blue-600">
            R$ {stock.price.toFixed(2)}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Data: {new Date(stock.date).toLocaleDateString("pt-BR")}
        </div>
      </div>

      <Button
        onClick={handleExportImage}
        variant="outline"
        size="sm"
        className="absolute -right-2 -top-2"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
