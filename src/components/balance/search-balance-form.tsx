"use client";

import type React from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export function SearchBalanceForm({
  onBalanceSelect,
}: {
  onBalanceSelect: (company: string, year: string, period: string) => void;
}) {
  const [searchType, setSearchType] = useState("name");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Buscar lista de empresas
  const { data: companies, isLoading: isLoadingCompanies } =
    api.balance.listCompanies.useQuery();

  // Buscar anos disponíveis quando a empresa for selecionada
  const { data: years, isLoading: isLoadingYears } =
    api.balance.listAvailableYears.useQuery(
      { company: selectedCompany },
      { enabled: !!selectedCompany },
    );

  // Buscar períodos disponíveis quando o ano for selecionado
  const { data: periods, isLoading: isLoadingPeriods } =
    api.balance.listAvailablePeriods.useQuery(
      { company: selectedCompany, year: selectedYear },
      { enabled: !!selectedCompany && !!selectedYear },
    );

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(e.target.value);
    setSelectedYear("");
    setSelectedPeriod("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompany) {
      toast.error("Selecione uma empresa", {
        description: "Por favor, selecione uma empresa da lista",
      });
      return;
    }

    if (!selectedYear) {
      toast.error("Selecione um ano", {
        description: "Por favor, selecione um ano disponível",
      });
      return;
    }

    if (!selectedPeriod) {
      toast.error("Selecione um período", {
        description: "Por favor, selecione um período disponível",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        `Relatório da empresa ${selectedCompany} carregado com sucesso`,
      );

      // Chamar o método onBalanceSelect aqui, passando os valores selecionados
      onBalanceSelect(selectedCompany, selectedYear, selectedPeriod);
    }, 1500);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div>
        <Label htmlFor="company">Empresa</Label>
        <select
          id="company"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedCompany}
          onChange={handleCompanyChange}
          disabled={isLoadingCompanies}
        >
          <option value="">Selecione uma empresa</option>
          {companies &&
            companies.map((company) => (
              <option key={company.name} value={company.name}>
                {company.name}
              </option>
            ))}
        </select>
        {isLoadingCompanies && (
          <p className="mt-1 text-sm text-muted-foreground">
            Carregando empresas...
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="year">Ano</Label>
          <select
            id="year"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={!selectedCompany || isLoadingYears}
          >
            <option value="">Selecione um ano</option>
            {years &&
              years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
          {isLoadingYears && (
            <p className="mt-1 text-sm text-muted-foreground">
              Carregando anos...
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="period">Período</Label>
          <select
            id="period"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            disabled={!selectedYear || isLoadingPeriods}
          >
            <option value="">Selecione um período</option>
            {periods &&
              periods.map((period) => (
                <option key={period} value={period ?? ""}>
                  {period === "anual"
                    ? "Anual"
                    : period === "q1"
                      ? "1º Trimestre"
                      : period === "q2"
                        ? "2º Trimestre"
                        : period === "q3"
                          ? "3º Trimestre"
                          : period === "q4"
                            ? "4º Trimestre"
                            : period}
                </option>
              ))}
          </select>
          {isLoadingPeriods && (
            <p className="mt-1 text-sm text-muted-foreground">
              Carregando períodos...
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={
          isLoading || !selectedCompany || !selectedYear || !selectedPeriod
        }
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Buscando...
          </>
        ) : (
          "Buscar"
        )}
      </Button>
    </form>
  );
}
