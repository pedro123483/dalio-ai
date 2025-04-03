import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { formatCurrency, formatDate } from "~/utils/formatUtils";

interface IncomeStatementData {
  endDate: string;
  totalRevenue: number;
  costOfRevenue: number;
  grossProfit: number;
  researchDevelopment: number | null;
  sellingGeneralAdministrative: number;
  nonRecurring: number | null;
  otherOperatingExpenses: number;
  totalOperatingExpenses: number;
  operatingIncome: number;
  totalOtherIncomeExpenseNet: number;
  ebit: number;
  interestExpense: number;
  incomeBeforeTax: number;
  incomeTaxExpense: number;
  minorityInterest: number | null;
  netIncomeFromContinuingOps: number;
  discontinuedOperations: number | null;
  extraordinaryItems: number | null;
  effectOfAccountingCharges: number | null;
  otherItems: number | null;
  netIncome: number;
  netIncomeApplicableToCommonShares: number;
  ticker: string;
}

export function IncomeStatementCard({ endDate, totalRevenue, costOfRevenue, grossProfit, researchDevelopment, sellingGeneralAdministrative, otherOperatingExpenses, totalOperatingExpenses, operatingIncome, totalOtherIncomeExpenseNet, ebit, interestExpense, incomeBeforeTax, incomeTaxExpense, minorityInterest, netIncomeFromContinuingOps, discontinuedOperations, extraordinaryItems, effectOfAccountingCharges, otherItems, netIncome, netIncomeApplicableToCommonShares, ticker } : IncomeStatementData) {
  const financialItems = [
    { label: "Receita Total", value: totalRevenue },
    { label: "(-) Custo dos Produtos/Serviços", value: costOfRevenue },
    { label: "Lucro Bruto", value: grossProfit, isBold: true },
    { label: "(-) Despesas com P&D", value: researchDevelopment },
    { label: "(-) Despesas Gerais e Administrativas", value: sellingGeneralAdministrative },
    { label: "(-) Outras Despesas Operacionais", value: otherOperatingExpenses },
    { label: "(-) Total de Despesas Operacionais", value: totalOperatingExpenses },
    { label: "Resultado Operacional", value: operatingIncome, isBold: true },
    { label: "Resultado Financeiro", value: totalOtherIncomeExpenseNet },
    { label: "EBIT", value: ebit, isBold: true },
    { label: "(-) Despesas Financeiras", value: interestExpense },
    { label: "Resultado Antes dos Impostos", value: incomeBeforeTax, isBold: true },
    { label: "(-) Impostos sobre Lucro", value: incomeTaxExpense },
    { label: "Participações Minoritárias", value: minorityInterest },
    { label: "Resultado Líquido das Operações", value: netIncomeFromContinuingOps },
    { label: "Lucro Líquido", value: netIncome, isBold: true, isHighlighted: true }
  ];

  return (
    <Card className="w-full bg-white shadow-sm border rounded-lg overflow-hidden">
      <CardHeader className="bg-blue-50 pb-2">
        <CardTitle className="text-lg font-bold text-blue-800">
          Demonstrativo de Resultados - {ticker}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Período: {formatDate(endDate)}
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {financialItems.map((item, index) => (
              item.value !== null && (
                <TableRow 
                  key={`financial-item-${index}`}
                  className={item.isHighlighted ? "bg-blue-50" : ""}
                >
                  <TableCell 
                    className={`py-2 pl-4 ${item.isBold ? "font-semibold" : ""}`}
                  >
                    {item.label}
                  </TableCell>
                  <TableCell 
                    className={`py-2 pr-4 text-right ${item.isBold ? "font-semibold" : ""} 
                              ${item.value < 0 ? "text-red-600" : ""}`}
                  >
                    {formatCurrency(item.value)}
                  </TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}