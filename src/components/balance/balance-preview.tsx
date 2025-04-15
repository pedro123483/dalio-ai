"use client";

// src/pages/balances/[id].tsx
//import { useRouter } from "next/router";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import { api } from "~/trpc/react";
import type React from "react";

// Configure o worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function BalancePreview() {
  //const router = useRouter();
  //const { id } = router.query;
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const balanceId = 1; // ID do balanço a ser buscado
  const { data, isLoading } = api.balance.getBalanceUrl.useQuery({ balanceId });

  console.log("data", data);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (isLoading) return <div>Carregando...</div>;
  if (!data?.url) return <div>PDF não encontrado</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Balanço Financeiro</h1>
      <Document
        file={data?.url} // URL pré-assinada do S3
        onLoadSuccess={onDocumentLoadSuccess}
        className="rounded border shadow"
      >
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
        >
          Anterior
        </button>
        <p>
          Página {pageNumber} de {numPages}
        </p>
        <button
          onClick={() =>
            setPageNumber((prev) => Math.min(prev + 1, numPages || prev))
          }
          disabled={pageNumber >= (numPages || 1)}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
