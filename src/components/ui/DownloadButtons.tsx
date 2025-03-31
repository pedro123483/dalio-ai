"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { useRef } from "react";
import * as XLSX from "xlsx";
import * as htmlToImage from "html-to-image";

import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface DownloadButtonsProps {
  chartRef: React.RefObject<HTMLDivElement>;
  data: any[];
  symbol: string;
  title?: string;
}

export function DownloadButtons({
  chartRef,
  data,
  symbol,
  title,
}: DownloadButtonsProps) {
  const handleExportImage = async () => {
    if (!chartRef.current) return;

    try {
      // Encontra o elemento pai do card
      const cardElement = chartRef.current.closest(".relative") as HTMLElement;
      if (!cardElement) return;

      const dataUrl = await htmlToImage.toPng(cardElement, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        style: {
          transform: "none",
          transformOrigin: "none",
        },
        filter: (node) => {
          // Exclui os botões de download da imagem
          return !(node as HTMLElement).classList?.contains("download-buttons");
        },
        skipAutoScale: true,
        cacheBust: true,
        includeQueryParams: true,
        skipFonts: true,
        fontEmbedCSS: "",
        svgStyles: `
          .recharts-area {
            fill: currentColor !important;
          }
          .recharts-line {
            stroke: currentColor !important;
          }
          .recharts-text {
            fill: currentColor !important;
          }
          .recharts-cartesian-grid-line {
            stroke: currentColor !important;
          }
          .recharts-tooltip-wrapper {
            background-color: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            color: #1e293b !important;
          }
        `,
      });

      const link = document.createElement("a");
      link.download = `${symbol}_${title || "chart"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Erro ao exportar imagem:", error);
    }
  };

  const handleExportExcel = () => {
    try {
      // Prepara os dados para o Excel
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Dados");

      // Gera o arquivo Excel
      XLSX.writeFile(wb, `${symbol}_${title || "data"}.xlsx`);
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
    }
  };

  return (
    <TooltipProvider>
      <div className="download-buttons absolute right-2 top-2 z-[100] flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/80 hover:bg-white"
              onClick={handleExportImage}
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Baixar como PNG</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/80 hover:bg-white"
              onClick={handleExportExcel}
            >
              <FileSpreadsheet className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Baixar como Excel</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
