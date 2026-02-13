"use client"

import { useState, useEffect } from "react"
import { PaymentSource } from "@prisma/client"
import { createExpenseAction } from "@/app/actions/accounting.actions"
import { getCategoriesAction } from "@/app/actions/inventory.actions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Receipt, X } from "lucide-react"
import { formatCurrency } from "@/lib/formatters"

export function QuickExpenseDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form values
  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [paymentSource, setPaymentSource] = useState<PaymentSource>(PaymentSource.BUSINESS_CASH)

  useEffect(() => {
    if (open) {
      const loadCategories = async () => {
        setIsLoading(true)
        try {
          const cats = await getCategoriesAction("EXPENSE")
          setCategories(cats)
        } catch (e) {
          console.error("Failed to load expense categories", e)
        } finally {
          setIsLoading(false)
        }
      }
      loadCategories()
    }
  }, [open])

  const handleReset = () => {
    setCategoryId("")
    setAmount("")
    setDescription("")
    setPaymentSource(PaymentSource.BUSINESS_CASH)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId || !amount) return

    setIsSubmitting(true)
    try {
      const selectedCategory = categories.find(c => c.id === categoryId)
      await createExpenseAction({
        categoryId,
        amount: parseFloat(amount),
        paymentSource,
        description,
        name: selectedCategory ? selectedCategory.name : "Расход"
      })
      handleReset()
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleReset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 max-sm:h-[100dvh] max-sm:max-h-none max-sm:rounded-none max-sm:top-0 max-sm:translate-y-0 border-none max-sm:flex max-sm:flex-col overflow-y-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-2 border-b sm:border-none flex-shrink-0 bg-background z-10 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Receipt className="h-5 w-5 text-red-600" />
            Внести расход
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden h-8 w-8 p-0 rounded-full" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <form 
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 min-h-0 bg-background"
        >
            <div 
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-96 touch-pan-y"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Категория расхода</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} disabled={isLoading}>
                      <SelectTrigger className="h-12" suppressHydrationWarning>
                          <SelectValue placeholder={isLoading ? "Загрузка..." : "Выберите категорию"} />
                      </SelectTrigger>
                      <SelectContent>
                          {categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  {categories.length === 0 && !isLoading && (
                    <p className="text-xs text-muted-foreground">
                      Нет категорий типа "Расходная". Создайте их в Склад &rarr; Категории.
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Сумма (₸)</Label>
                  <Input 
                      type="text" 
                      inputMode="numeric"
                      className="h-14 text-xl font-bold" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(',', '.'))}
                      placeholder="0"
                      autoComplete="off"
                      suppressHydrationWarning
                  />
              </div>

              <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Описание (необязательно)</Label>
                  <Input 
                      placeholder="Например: За февраль"
                      className="h-12" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      autoComplete="off"
                      suppressHydrationWarning
                  />
              </div>

              <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Источник оплаты</Label>
                  <Select value={paymentSource} onValueChange={(v: any) => setPaymentSource(v)}>
                      <SelectTrigger className="h-14 text-lg" suppressHydrationWarning>
                          <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value={PaymentSource.BUSINESS_CASH}>🏢 Бизнес Касса</SelectItem>
                          <SelectItem value={PaymentSource.PERSONAL_FUNDS}>👤 Личные средства</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
            </div>

            <div className="p-4 bg-background border-t sm:p-6 flex-shrink-0 z-10 mt-auto">
                <Button 
                  type="submit"
                  className="w-full h-14 text-lg shadow-lg bg-red-600 hover:bg-red-700 text-white" 
                  disabled={isSubmitting || !categoryId || !amount}
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Оплатить
                </Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
