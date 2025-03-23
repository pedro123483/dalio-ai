import { tool as createTool } from "ai";
import { z } from "zod";
import axios from "axios";
import { openai } from "@ai-sdk/openai";

export const brapiQuoteTool = createTool({
  description:
    "Buscar cotação de um ou mais ativos financeiros (ações, fundos imobiliários, índices e BDRs) do mercado financeiro brasileiro",
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

export const tools = {
  getAssetQuote: brapiQuoteTool,
  web_search_preview: openai.tools.webSearchPreview(),
};
