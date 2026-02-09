"use client"

import { useState } from "react"
import { Plus, ShoppingCart, TrendingUp, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { QuickProcurementDialog } from "@/components/procurement/quick-procurement-dialog"
import { QuickSaleDialog } from "@/components/sales/quick-sale-dialog"

export function DashboardHeader() {
  const [isProcurementOpen, setIsProcurementOpen] = useState(false)
  const [isSaleOpen, setIsSaleOpen] = useState(false)

  return (
    <header className="hidden lg:flex h-16 items-center justify-between border-b px-6 bg-card sticky top-0 z-40">
      <div className="flex items-center flex-1 gap-4">
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Быстрый поиск по системе..." className="pl-9 bg-muted/50 border-none" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
            variant="outline" 
            size="sm" 
            className="text-green-600 border-green-600/20 hover:bg-green-50 dark:hover:bg-green-950"
            onClick={() => setIsSaleOpen(true)}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Продать
        </Button>
        
        <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsProcurementOpen(true)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Закупить
        </Button>

        <div className="h-6 w-px bg-border mx-2" />
        
        <ModeToggle />
      </div>

      <QuickProcurementDialog 
        open={isProcurementOpen} 
        onOpenChange={setIsProcurementOpen} 
      />
      <QuickSaleDialog 
        open={isSaleOpen} 
        onOpenChange={setIsSaleOpen} 
      />
    </header>
  )
}
