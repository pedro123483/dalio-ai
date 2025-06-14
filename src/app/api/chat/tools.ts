import { tool as createTool } from "ai";
import { z } from "zod";
import axios from "axios";
import { openai } from "@ai-sdk/openai";
import igpm from "./igpm.json";
import ipca from "./ipca.json";

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
    if (tickers && tickers.trim() !== "") {
      try {
        // Valores padrão mais leves
        const safeRange = range || "1y";
        const safeInterval = interval || "1mo";

        const stockResponse = await axios.get(
          `https://brapi.dev/api/quote/${tickers}?token=${process.env.BRAPI_API_KEY}&range=${safeRange}&interval=${safeInterval}`,
        );

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

export const incomeStatementTool = createTool({
  description: "Buscar demonstrativo de resultados financeiros de uma empresa. Demonstrativo de Resultados Histórico: O demonstrativo de resultados é um dos principais demonstrativos financeiros de uma empresa que mostra as receitas e despesas durante um período de tempo.",
  parameters: z.object({
    ticker: z.string().describe("Ticker da empresa a ser buscado"),
    endDate: z.string().describe("Data final do período a ser buscado. Ex: 2024-12-31, se a pessoa quiser os dados do ano de 2024, 2023-12-31 para 2023, etc."),
  }),

  execute: async function ({ ticker, endDate }) {
    const { data } = await axios.get(
      `https://brapi.dev/api/quote/${ticker}?modules=incomeStatementHistory&token=${process.env.BRAPI_API_KEY}`,
    );

    for (const item of data.results[0].incomeStatementHistory) {
      if (item.endDate === endDate) {
        return {
          ...item,
          ticker: ticker,
        };
      }
    }

    return { error: "Nenhum dado encontrado para o período informado" };
  },
});

export const inflationTool = createTool({
  description: "Buscar a inflação do Brasil e a evolucao da inflação no Brasil(a data deve ser no formato dd/mm/yyyy, nunca retorne no formato mm/yyyy)",
  parameters: z.object({
    startDate: z.string().describe("Data inicial do período a ser buscado. Exemplo: 01/01/2020"),
    endDate: z.string().describe("Data final do período a ser buscado. Exemplo: 01/01/2021"),
  }),

  execute: async function ({ startDate, endDate }) {
    console.log("inflationTool", startDate, endDate);
    const { data } = await axios.get(
      `https://brapi.dev/api/v2/inflation?country=brazil&start=${startDate}&end=${endDate}&sortBy=date&sortOrder=desc&token=${process.env.BRAPI_API_KEY}`,
    );

    console.log("data inflationTool", data);

    return data;
  },
});

export const primeRateTool = createTool({
  description: "Buscar a taxa de juros primária do Brasil",
  parameters: z.object({
    startDate: z.string().describe("Data inicial do período a ser buscado. Exemplo: 01/01/2020"),
    endDate: z.string().describe("Data final do período a ser buscado. Exemplo: 01/01/2021"),
  }),

  execute: async function ({ startDate, endDate }) {
    const { data } = await axios.get(
      `https://brapi.dev/api/v2/prime-rate?country=brazil&start=${startDate}&end=${endDate}&sortBy=date&sortOrder=desc&token=${process.env.BRAPI_API_KEY}`,
    );

    return data;
  },
});

export const igpmTool = createTool({
  description: `Buscar o IGP-M do Brasil, a nossa data atual é ${new Date().toLocaleDateString('pt-BR')}`,
  parameters: z.object({
    startDate: z.string().describe("Data inicial do período a ser buscado. Exemplo: janeiro/2010"),
    endDate: z.string().describe("Data final do período a ser buscado. Exemplo: dezembro/2024"),
  }),

  execute: async function ({ startDate, endDate }) {
    console.log("startDate", startDate);
    console.log("endDate", endDate);

    try {
      // Função para converter mês por extenso para número
      const getMonthNumber = (month: string) => {
        const months: { [key: string]: string } = {
          'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
          'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
          'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
        };
        return months[month.toLowerCase()] || '01';
      };

      // Função para formatar a data
      const formatDate = (dateStr: string) => {
        const [month, year] = dateStr.split('/');
        if (!month || !year) {
          throw new Error('Formato de data inválido');
        }
        const monthNum = getMonthNumber(month);
        return `${year}-${monthNum}`;
      };

      // Função para converter data do formato do JSON para formato comparável
      const convertJsonDate = (dateStr: string) => {
        const [month, year] = dateStr.split('/');
        const monthNum = getMonthNumber(month || '');
        return `${year}-${monthNum}`;
      };

      // Formatar as datas de entrada
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      // Encontrar o índice da data inicial e final no array
      const startIndex = igpm.findIndex(item => {
        if (!item.date) return false;
        const itemDate = convertJsonDate(item.date);
        return itemDate >= formattedStartDate;
      });

      const endIndex = igpm.findIndex(item => {
        if (!item.date) return false;
        const itemDate = convertJsonDate(item.date);
        return itemDate > formattedEndDate;
      });

      // Se não encontrar a data final, usar o último item do array
      const finalEndIndex = endIndex === -1 ? igpm.length : endIndex;

      // Extrair os dados do intervalo
      const data = igpm.slice(startIndex, finalEndIndex);

      // Se não houver dados, retornar mensagem informativa
      if (data.length === 0) {
        return {
          message: `Não foram encontrados dados do IGP-M para o período de ${startDate} a ${endDate}`,
          data: []
        };
      }

      console.log("data igpm", data);

      return data;

    } catch (error) {
      console.error('Erro ao processar dados do IGP-M:', error);
      return {
        error: 'Erro ao processar os dados do IGP-M',
        message: 'Ocorreu um erro ao buscar os dados. Por favor, verifique o formato das datas.'
      };
    }
  },
});

export const ipcaTool = createTool({
  description: `Buscar o IPCA do Brasil, a nossa data atual é ${new Date().toLocaleDateString('pt-BR')}`,
  parameters: z.object({
    startDate: z.string().describe("Data inicial do período a ser buscado. Exemplo: janeiro/2010"),
    endDate: z.string().describe("Data final do período a ser buscado. Exemplo: dezembro/2024"),
  }),

  execute: async function ({ startDate, endDate }) {
    console.log("startDate", startDate);
    console.log("endDate", endDate);

    try {
      // Função para converter mês por extenso para número
      const getMonthNumber = (month: string) => {
        const months: { [key: string]: string } = {
          'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
          'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
          'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
        };
        return months[month.toLowerCase()] || '01';
      };

      // Função para formatar a data
      const formatDate = (dateStr: string) => {
        const [month, year] = dateStr.split('/');
        if (!month || !year) {
          throw new Error('Formato de data inválido');
        }
        const monthNum = getMonthNumber(month);
        return `${year}-${monthNum}`;
      };

      // Função para converter data do formato do JSON para formato comparável
      const convertJsonDate = (dateStr: string) => {
        const [month, year] = dateStr.split('/');
        const monthNum = getMonthNumber(month || '');
        return `${year}-${monthNum}`;
      };

      // Formatar as datas de entrada
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      // Encontrar o índice da data inicial e final no array
      const startIndex = ipca.findIndex(item => {
        if (!item.date) return false;
        const itemDate = convertJsonDate(item.date);
        return itemDate >= formattedStartDate;
      });

      const endIndex = ipca.findIndex(item => {
        if (!item.date) return false;
        const itemDate = convertJsonDate(item.date);
        return itemDate > formattedEndDate;
      });

      // Se não encontrar a data final, usar o último item do array
      const finalEndIndex = endIndex === -1 ? ipca.length : endIndex;

      // Extrair os dados do intervalo
      const data = ipca.slice(startIndex, finalEndIndex);

      // Se não houver dados, retornar mensagem informativa
      if (data.length === 0) {
        return {
          message: `Não foram encontrados dados do IPCA para o período de ${startDate} a ${endDate}`,
          data: []
        };
      }

      console.log("data ipca", data);

      return data;

    } catch (error) {
      console.error('Erro ao processar dados do IPCA:', error);
      return {
        error: 'Erro ao processar os dados do IPCA',
        message: 'Ocorreu um erro ao buscar os dados. Por favor, verifique o formato das datas.'
      };
    }
  },
});

export const tools = {
  getAssetQuote: brapiQuoteTool,
  compareMultipleAssets: assetComparisonTool,
  getIncomeStatement: incomeStatementTool,
  getInflation: inflationTool,
  getPrimeRate: primeRateTool,
  getIGPM: igpmTool,
  getIPCA: ipcaTool,
  web_search_preview: openai.tools.webSearchPreview(),
};
