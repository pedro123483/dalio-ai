import { Bell, HelpCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Inconsistência detectada</p>
                <p className="text-xs text-muted-foreground">Variação atípica no fluxo de caixa operacional</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Novo relatório disponível</p>
                <p className="text-xs text-muted-foreground">Análise trimestral concluída</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Atualização de dados</p>
                <p className="text-xs text-muted-foreground">Novos dados financeiros disponíveis</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
