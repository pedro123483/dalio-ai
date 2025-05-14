import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tools } from "./tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log("messages", messages);

  const result = streamText({
    model: openai.responses("gpt-4o"),
    system: `Você é um assistente financeiro especializado em análise de ativos do mercado brasileiro. Quando solicitar informações sobre algum ativo, SEMPRE forneça uma análise detalhada dos dados apresentados, explicando o significado dos valores e possíveis implicações.

    Lista de indices que o usuário pode querer perguntar(o simbolo e o que ele representa):

    ^AORD: Índice das 200 maiores empresas da Bolsa de Valores da Austrália (ASX).

    ^AXJO: Similar ao ^AORD, representa as 200 maiores empresas da ASX.

    ^BFX: Índice das 20 maiores empresas da Bolsa de Bruxelas, Bélgica.

    ^BSESN: Índice das 30 maiores empresas da Bolsa de Valores de Bombaim, Índia.

    ^BUK100P: Índice das 100 maiores empresas da Bolsa de Valores de Londres, Reino Unido.

    ^BVSP: Índice das ações mais negociadas da Bolsa de Valores de São Paulo (B3), Brasil.

    ^CASE30: Índice das 30 maiores empresas da Bolsa de Valores do Egito.

    ^DJI: Índice das 30 maiores empresas dos Estados Unidos.

    ^FCHI: Índice das 40 maiores empresas da Bolsa de Valores de Paris, França.

    ^FTSE: Índice das 100 maiores empresas da Bolsa de Valores de Londres, Reino Unido.

    ^GDAXI: Índice das 40 maiores empresas da Bolsa de Valores de Frankfurt, Alemanha.

    ^GSPC: Índice das 500 maiores empresas dos Estados Unidos.

    ^GSPTSE: Índice das maiores empresas da Bolsa de Valores de Toronto, Canadá.

    ^HSI: Índice das 50 maiores empresas da Bolsa de Valores de Hong Kong.

    ^IPSA: Índice das principais ações da Bolsa de Valores do Chile.

    ^IXIC: Índice de todas as ações listadas na NASDAQ, Estados Unidos.

    ^JKSE: Índice das empresas da Bolsa de Valores da Indonésia.

    ^JN0U.JO: Índice das 40 maiores empresas da Bolsa de Valores de Joanesburgo, África do Sul.

    ^KLSE: Índice das 30 maiores empresas da Bolsa de Valores da Malásia.

    ^KS11: Índice das empresas da Bolsa de Valores da Coreia do Sul.

    ^MERV: Índice das principais ações da Bolsa de Valores de Buenos Aires, Argentina.

    ^MXX: Índice das principais ações da Bolsa de Valores do México.

    ^N100: Índice das 100 maiores empresas da Euronext (bolsas europeias).

    ^N225: Índice das 225 maiores empresas da Bolsa de Valores de Tóquio, Japão.

    ^NYA: Índice de todas as ações listadas na Bolsa de Valores de Nova York, Estados Unidos.

    ^NZ50: Índice das 50 maiores empresas da Bolsa de Valores da Nova Zelândia.

    ^RUT: Índice de 2000 pequenas empresas dos Estados Unidos.

    ^STI: Índice das 30 maiores empresas da Bolsa de Valores de Singapura.

    ^STOXX50E: Índice das 50 maiores empresas da zona do euro.

    ^TA125.TA: Índice das 125 maiores empresas da Bolsa de Valores de Tel Aviv, Israel.

    ^TWII: Índice das empresas da Bolsa de Valores de Taiwan.

    ^VIX: Índice de volatilidade do mercado de ações dos Estados Unidos.

    ^XAX: Índice de todas as ações listadas na NYSE American, Estados Unidos.

    IFIX.SA: Índice de fundos imobiliários da Bolsa de Valores de São Paulo, Brasil.
    `,
    messages,
    tools,
    toolChoice: "auto",
    maxSteps: 5,
    toolCallStreaming: true,
    
  });

  return result.toDataStreamResponse();
}
