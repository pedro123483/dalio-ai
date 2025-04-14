"use client";

import type React from "react";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export function SearchBalanceForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [isLoading, setIsLoading] = useState(false);

  const balanceId = 1; // ID do balanço a ser buscado
  const { data: balanceUrl, isLoading: isLoadingBalance } =
    api.balance.getBalanceUrl.useQuery({ balanceId });

  console.log(balanceUrl);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      toast.error("Campo obrigatório", {
        description: "Por favor, informe o nome ou CNPJ da empresa",
      });
      return;
    }

    setIsLoading(true);

    // Simulação de busca
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Balanço da empresa ${searchTerm} carregado com sucesso`);
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

      <div className="flex gap-2">
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
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Buscando...
            </>
          ) : (
            "Buscar"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Ano</Label>
          <select
            id="year"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
          </select>
        </div>
        <div>
          <Label htmlFor="period">Período</Label>
          <select
            id="period"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="annual">Anual</option>
            <option value="q4">4º Trimestre</option>
            <option value="q3">3º Trimestre</option>
            <option value="q2">2º Trimestre</option>
            <option value="q1">1º Trimestre</option>
          </select>
        </div>
      </div>
    </form>
  );
}
