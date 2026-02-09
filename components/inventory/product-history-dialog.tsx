"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getProductHistoryAction } from "@/app/actions/inventory.actions"
import { formatCurrency, formatUnit } from "@/lib/formatters"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Loader2, ArrowUpCircle, ArrowDownCircle, Factory, ShoppingCart } from "lucide-react"
import { Product, Unit } from "@prisma/client"

interface HistoryEntry {
  id: string
  date: string
  type: "PROCUREMENT" | "SALE" | "PRODUCTION_USAGE" | "PRODUCTION_OUTPUT"
  quantity: number
  price?: number
  total?: number
  counterparty: string
  performedBy: string
}

interface ProductHistoryDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductHistoryDialog({ product, open, onOpenChange }: ProductHistoryDialogProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && product) {
      const loadHistory = async () => {
        setIsLoading(true)
        try {
          const data = await getProductHistoryAction(product.id)
          setHistory(data)
        } catch (error) {
          console.error("Failed to load history:", error)
        } finally {
          setIsLoading(false)
        }
      }
      loadHistory()
    } else {
      setHistory([])
    }
  }, [open, product])

  const getTypeBadge = (type: HistoryEntry["type"]) => {
    switch (type) {
      case "PROCUREMENT":
        return <Badge className="bg-blue-500 gap-1"><ShoppingCart className="h-3 w-3" /> Закуп</Badge>
      case "SALE":
        return <Badge className="bg-green-500 gap-1"><ArrowUpCircle className="h-3 w-3" /> Продажа</Badge>
      case "PRODUCTION_USAGE":
        return <Badge variant="outline" className="text-orange-600 border-orange-600 gap-1"><Factory className="h-3 w-3" /> Списание</Badge>
      case "PRODUCTION_OUTPUT":
        return <Badge className="bg-purple-500 gap-1"><Factory className="h-3 w-3" /> Выпуск</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>
            История движения: {product?.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground uppercase">
            Текущий остаток: {product ? formatUnit(Number(product.currentStock), product.unit) : "—"}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              Движений по этому товару не найдено.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead className="text-right">Кол-во</TableHead>
                    <TableHead>Контрагент / Место</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                    <TableHead>Исполнитель</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(entry.date), "dd.MM.yy HH:mm", { locale: ru })}
                      </TableCell>
                      <TableCell>{getTypeBadge(entry.type)}</TableCell>
                      <TableCell className={`text-right font-bold ${entry.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                        {entry.quantity > 0 ? "+" : ""}{formatUnit(entry.quantity, product?.unit || Unit.KG)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {entry.counterparty}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {entry.total ? formatCurrency(entry.total) : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {entry.performedBy}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
