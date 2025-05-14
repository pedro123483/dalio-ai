"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { SearchBalanceForm } from "~/components/balance/search-balance-form"
import { UploadBalanceForm } from "~/components/balance/upload-balance-form"

export function SearchAndUploadCard({ onBalanceSelect }: { onBalanceSelect: (company: string, year: string, period: string) => void }) {
  const [activeTab, setActiveTab] = useState("search")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activeTab === "search" ? "Buscar Balanço" : "Upload de Balanço"}</CardTitle>
        <CardDescription>
          {activeTab === "search"
            ? "Informe o nome ou CNPJ da empresa para buscar o balanço"
            : "Faça upload do balanço para análise"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
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
