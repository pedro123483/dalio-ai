"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export function SearchBalanceForm({ onBalanceSelect }: { onBalanceSelect: (company: string, year: string, period: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState<{name: string}[]>([]);

  // Buscar lista de empresas
  const { data: companies, isLoading: isLoadingCompanies } = api.balance.listCompanies.useQuery();
  
  // Buscar anos disponíveis quando a empresa for selecionada
  const { data: years, isLoading: isLoadingYears } = api.balance.listAvailableYears.useQuery(
    { company: selectedCompany },
    { enabled: !!selectedCompany }
  );
  
  // Buscar períodos disponíveis quando o ano for selecionado
  const { data: periods, isLoading: isLoadingPeriods } = api.balance.listAvailablePeriods.useQuery(
    { company: selectedCompany, year: selectedYear },
    { enabled: !!selectedCompany && !!selectedYear }
  );

  // Filtrar empresas conforme o usuário digita
  useEffect(() => {
    if (companies && searchTerm) {
      const filtered = companies.filter(company => 
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
      );
      setFilteredCompanies(filtered as { name: string }[]);
      setShowResults(true);
    } else {
      setFilteredCompanies([]);
      setShowResults(false);
    }
  }, [searchTerm, companies]);

  const handleCompanySelect = (companyName: string) => {
    setSelectedCompany(companyName);
    setSearchTerm(companyName);
    setShowResults(false);
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

    // Simulação de busca
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Balanço da empresa ${selectedCompany} carregado com sucesso`);
      
      // Chamar o método onBalanceSelect aqui, passando os valores selecionados
      onBalanceSelect(selectedCompany, selectedYear, selectedPeriod);
    }, 1500);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="space-y-2">
        <RadioGroup
          defaultValue="name"
          value={searchType}
          onValueChange={setSearchType}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="name" id="name" />
            <Label htmlFor="name">Nome da Empresa</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cnpj" id="cnpj" />
            <Label htmlFor="cnpj">CNPJ</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-2 relative">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={
              searchType === "name" ? "Ex: Petrobras" : "Ex: 33.000.167/0001-01"
            }
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Lista de resultados */}
          {showResults && filteredCompanies.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
              <ul className="max-h-60 overflow-auto py-1">
                {filteredCompanies.map((company) => (
                  <li
                    key={company.name}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCompanySelect(company.name)}
                  >
                    {company.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            {years && years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {isLoadingYears && <p className="text-sm text-muted-foreground mt-1">Carregando anos...</p>}
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
            {periods && periods.map((period) => (
              <option key={period} value={period ?? ""}>
                {period === "anual" ? "Anual" : 
                 period === "q1" ? "1º Trimestre" :
                 period === "q2" ? "2º Trimestre" :
                 period === "q3" ? "3º Trimestre" :
                 period === "q4" ? "4º Trimestre" : period}
              </option>
            ))}
          </select>
          {isLoadingPeriods && <p className="text-sm text-muted-foreground mt-1">Carregando períodos...</p>}
        </div>
      </div>

      <Button type="submit" disabled={isLoading || !selectedCompany || !selectedYear || !selectedPeriod} className="w-full">
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
