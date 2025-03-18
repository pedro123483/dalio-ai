export const getMockResponse = (userInput: string): string => {
    const mockResponses: Record<string, string> = {
      "como está o mercado hoje?": "O mercado hoje está mostrando volatilidade moderada. O Ibovespa oscila em torno dos 128.473 pontos com leve queda de 0.18%. O dólar está cotado a R$5,07, com alta de 0.42%, enquanto o S&P 500 sobe 0.21%, alcançando 5.239 pontos. Os setores de tecnologia e energia apresentam melhor desempenho no dia.",
      "explique a relação entre taxa de juros e bolsa": "Quando as taxas de juros sobem, geralmente vemos uma pressão negativa sobre o mercado de ações. Isso acontece porque: 1) Os investimentos de renda fixa tornam-se mais atrativos; 2) O custo de capital das empresas aumenta, reduzindo potencialmente seus lucros; 3) O valor presente dos fluxos de caixa futuros diminui. Por outro lado, quando os juros caem, o mercado de ações tende a se beneficiar pelos motivos opostos.",
      "quais ações tiveram melhor desempenho este mês?": "As ações com melhor desempenho este mês foram principalmente do setor de tecnologia e varejo: MGLU3 (+15,2%), WEGE3 (+12,8%), TOTS3 (+10,5%). No setor financeiro, ITUB4 teve um desempenho notável (+7,3%). Empresas de energia renovável também se destacaram, com AURE3 registrando alta de 9,1%.",
      "o que é um etf?": "ETF (Exchange Traded Fund) é um fundo de investimento negociado em bolsa que busca replicar o desempenho de um índice, setor, commodity ou outro ativo. Diferente dos fundos tradicionais, os ETFs são negociados como ações, com preços atualizados ao longo do dia. Eles oferecem diversificação, liquidez e geralmente têm taxas de administração mais baixas que fundos mútuos tradicionais. No Brasil, exemplos populares incluem BOVA11 (que replica o Ibovespa) e IVVB11 (que replica o S&P 500)."
    };
    
    // Verificar se há uma resposta predefinida para a pergunta
    const userQuestion = userInput.toLowerCase().trim();
    let responseContent = "Desculpe, não tenho informações específicas sobre isso no momento. Posso ajudar com análises de mercado, explicações sobre conceitos financeiros ou dados sobre ativos específicos. Poderia reformular sua pergunta?";
    
    // Verificar se a pergunta contém palavras-chave das respostas predefinidas
    for (const [key, value] of Object.entries(mockResponses)) {
      if (userQuestion.includes(key) || key.includes(userQuestion)) {
        responseContent = value;
        break;
      }
    }
    
    return responseContent;
  };