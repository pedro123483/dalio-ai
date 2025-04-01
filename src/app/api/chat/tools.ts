import { tool as createTool } from "ai";
import { z } from "zod";
import axios from "axios";
import { openai } from "@ai-sdk/openai";

export const brapiQuoteTool = createTool({
  description:
    "Buscar cotação de um ou mais ativos financeiros (ações, fundos imobiliários, índices e BDRs) do mercado financeiro brasileiro. Após buscar a cotação, forneça uma análise detalhada sobre o ativo, explicando o que significam os valores, a variação percentual e as tendências recentes.",
  parameters: z.object({
    ticker: z.string().describe("Ticker do ativo a ser buscado"),
  }),

  execute: async function ({ ticker }) {
    const { data } = await axios.get(
      `https://brapi.dev/api/quote/${ticker}?token=${process.env.BRAPI_API_KEY}`,
    );

    return data;
  },
});

// Tool para comparação de múltiplos ativos (ações, FIIs, índices, criptomoedas)
export const assetComparisonTool = createTool({
  description:
    "Ferramenta para comparar o desempenho histórico de múltiplos ativos financeiros juntos (ações, fundos imobiliários, índices). Use esta ferramenta quando o usuário quiser comparar mais de um ativo em um mesmo gráfico. Após buscar os dados, forneça uma análise mais simples e direta sobre sua conclusão sobre os dados encontrados(seja breve e direto).",
  parameters: z.object({
    tickers: z
      .string()
      .describe(
        "Lista de tickers separados por vírgula (ex: PETR4,ITUB4,IBOV)",
      ),
    range: z
      .string()
      .describe(
        "Intervalo de tempo ('1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'), default: '1y'",
      ),
    interval: z
      .string()
      .describe(
        "Intervalo entre pontos ('1d', '5d', '1wk', '1mo', '3mo'), default: '1mo'",
      ),
  }),

  execute: async function ({ tickers, range, interval }) {
    console.log("tickers", tickers);
    if (tickers && tickers.trim() !== "") {
      try {
        // Valores padrão mais leves
        const safeRange = range || "1y";
        const safeInterval = interval || "1mo";

        const stockResponse = await axios.get(
          `https://brapi.dev/api/quote/${tickers}?token=${process.env.BRAPI_API_KEY}&range=${safeRange}&interval=${safeInterval}`,
        );

        console.log("stockResponse", stockResponse.data);

        for (const asset of stockResponse.data.results) {
          console.log("asset historicalDataPrice", asset.historicalDataPrice);
        }

        const results = [];
        const dateMap = new Map();

        if (stockResponse.data && stockResponse.data.results) {
          // Primeiro, colete todos os dados por data
          for (const asset of stockResponse.data.results) {
            if (
              asset.historicalDataPrice &&
              asset.historicalDataPrice.length > 0
            ) {
              asset.historicalDataPrice.forEach((item: any) => {
                const date = new Date(item.date * 1000)
                  .toISOString()
                  .split("T")[0];

                if (!dateMap.has(date)) {
                  dateMap.set(date, { month: date });
                }

                const dateEntry = dateMap.get(date);
                dateEntry[asset.symbol] = item.close;
              });
            }
          }

          // Converta o Map para array de objetos
          results.push(...Array.from(dateMap.values()));

          // Ordene por data
          results.sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
          );
        }

        return {
          tickers,
          results,
        };

        //console.log("stockResponse", stockResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados de ações:", error);
        return [{ month: "Error", error: "Falha ao buscar dados" }];
      }
    }
  },
});

export const tools = {
  getAssetQuote: brapiQuoteTool,
  compareMultipleAssets: assetComparisonTool,
  web_search_preview: openai.tools.webSearchPreview(),
};
