"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AccountingTransaction, TransactionType } from "@/services/accounting.service"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { formatCurrency } from "@/lib/formatters"
import { ArrowUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TransactionTableProps {
  initialTransactions: AccountingTransaction[]
}

export function TransactionTable({ initialTransactions }: TransactionTableProps) {
  const [mounted, setMounted] = useState(false)
  const [transactions] = useState(initialTransactions)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<TransactionType | "ALL">("ALL")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AccountingTransaction
    direction: "asc" | "desc"
  }>({ key: "date", direction: "desc" })

  // Standard way to ensure hydration is complete before rendering client-only parts
  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions]

    // Filter by type
    if (typeFilter !== "ALL") {
      result = result.filter((t) => t.type === typeFilter)
    }

    // Filter by search (itemName, counterparty, performedBy)
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.itemName?.toLowerCase().includes(s) ||
          t.counterparty?.toLowerCase().includes(s) ||
          t.performedBy?.toLowerCase().includes(s) ||
          t.categoryName.toLowerCase().includes(s)
      )
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (!aValue || !bValue) return 0

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [transactions, search, typeFilter, sortConfig])

  const requestSort = (key: keyof AccountingTransaction) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case "INCOME":
        return <Badge className="bg-green-500 hover:bg-green-600">Доход</Badge>
      case "PROCUREMENT":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Закуп</Badge>
      case "EXPENSE":
        return <Badge className="bg-red-500 hover:bg-red-600">Расход</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {mounted ? (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по товару, контрагенту или автору..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              suppressHydrationWarning
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as any)}
          >
            <SelectTrigger className="w-full md:w-[180px]" suppressHydrationWarning>
              <SelectValue placeholder="Тип операции" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Все типы</SelectItem>
              <SelectItem value="INCOME">Доходы</SelectItem>
              <SelectItem value="PROCUREMENT">Закупы</SelectItem>
              <SelectItem value="EXPENSE">Расходы</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="h-10 w-full bg-muted/20 animate-pulse rounded-md" />
      )}

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => requestSort("date")} className="p-0 hover:bg-transparent">
                  Дата <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Категория / Товар</TableHead>
              <TableHead className="text-right">Кол-во</TableHead>
              <TableHead>Ед. изм.</TableHead>
              <TableHead className="text-right">Цена за ед.</TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => requestSort("totalAmount")} className="p-0 hover:bg-transparent ml-auto">
                  Сумма <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Контрагент</TableHead>
              <TableHead>Источник</TableHead>
              <TableHead>Автор</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  Транзакции не найдены.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {format(new Date(t.date), "dd.MM.yy HH:mm", { locale: ru })}
                  </TableCell>
                  <TableCell>{getTypeBadge(t.type)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{t.itemName || "—"}</div>
                    <div className="text-xs text-muted-foreground">{t.categoryName}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {t.quantity ? Number(t.quantity).toLocaleString() : "—"}
                  </TableCell>
                  <TableCell>{t.unit || "—"}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {t.pricePerUnit ? formatCurrency(t.pricePerUnit) : "—"}
                  </TableCell>
                  <TableCell className={`text-right font-bold whitespace-nowrap ${t.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                    {t.type === "INCOME" ? "+" : "-"}{formatCurrency(t.totalAmount)}
                  </TableCell>
                  <TableCell>{t.counterparty || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {t.paymentSource === "BUSINESS_CASH" ? "Касса" : "Личные"}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {t.performedBy}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
