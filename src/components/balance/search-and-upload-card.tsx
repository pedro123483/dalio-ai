"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { SearchBalanceForm } from "~/components/balance/search-balance-form"
import { UploadBalanceForm } from "~/components/balance/upload-balance-form"

export function SearchAndUploadCard({ 
  onBalanceSelect,
  onTabChange 
}: { 
  onBalanceSelect: (company: string, year: string, period: string) => void,
  onTabChange?: (activeTab: string) => void
}) {
  const [activeTab, setActiveTab] = useState("search")

  // Atualizar estado e notificar o componente pai quando a tab mudar
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activeTab === "search" ? "Buscar Balanço" : "Upload de Balanço"}</CardTitle>
        <CardDescription>
          {activeTab === "search"
            ? "Selecione uma empresa para buscar o balanço"
            : "Faça upload do balanço para análise"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="search" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="search">Buscar Balanço</TabsTrigger>
            <TabsTrigger value="upload">Upload de Balanço</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <SearchBalanceForm onBalanceSelect={onBalanceSelect} />
          </TabsContent>

          <TabsContent value="upload">
            <UploadBalanceForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
