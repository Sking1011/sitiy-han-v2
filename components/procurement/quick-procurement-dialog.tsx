"use client"

import { useState, useEffect } from "react"
import { Product, PaymentSource } from "@prisma/client"
import { createBulkProcurementAction } from "@/app/actions/procurement.actions"
import { searchProductsAction } from "@/app/actions/inventory.actions"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
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
import { Search, Loader2, ShoppingCart, X } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/formatters"

export function QuickProcurementDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const [step, setStep] = useState(1) // 1: Search/Select, 2: Details
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Form values
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [priceMode, setPriceMode] = useState<"unit" | "total">("unit")
  const [supplier, setSupplier] = useState("")
  const [paymentSource, setPaymentSource] = useState<PaymentSource>(PaymentSource.BUSINESS_CASH)

  const { data: session } = useSession()

  // Quick search
  useEffect(() => {
    if (open && search.length > 1) {
      const delay = setTimeout(async () => {
        setIsSearching(true)
        try {
          const all = await searchProductsAction(search)
          setProducts(all)
        } finally {
          setIsSearching(false)
        }
      }, 300)
      return () => clearTimeout(delay)
    } else if (search.length === 0) {
      setProducts([])
    }
  }, [search, open])

  const handleSelectProduct = (p: any) => {
    setSelectedProduct(p)
    setPrice(p.averagePurchasePrice.toString())
    setPriceMode("unit")
    setStep(2)
  }

  const handleReset = () => {
    setStep(1)
    setSearch("")
    setSelectedProduct(null)
    setQuantity("")
    setPrice("")
    setPriceMode("unit")
    setSupplier("")
  }

  const handleSubmit = async () => {
    if (!selectedProduct || !quantity || !price || !session?.user) return

    setIsLoading(true)
    try {
      const qty = parseFloat(quantity)
      const pVal = parseFloat(price)
      const pricePerUnit = priceMode === "total" ? pVal / qty : pVal

      await createBulkProcurementAction({
        userId: (session.user as any).id,
        supplier,
        paymentSource,
        items: [{
          productId: selectedProduct.id,
          quantity: qty,
          pricePerUnit: pricePerUnit
        }]
      })
      handleReset()
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
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
        {/* Honeypots to confuse Chrome autofill */}
        <div className="sr-only" aria-hidden="true">
          <input type="text" name="fake-proc-user" tabIndex={-1} />
          <input type="password" name="fake-proc-pass" tabIndex={-1} />
        </div>

        <DialogHeader className="p-4 sm:p-6 pb-2 border-b sm:border-none flex-shrink-0 bg-background z-10 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Быстрый закуп
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

        {step === 1 ? (
          <div className="flex flex-col flex-1 min-h-0 bg-background">
            <div className="p-4 sm:p-6 space-y-4 flex-shrink-0">
              <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    if (products.length > 0) handleSelectProduct(products[0]);
                }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Начните вводить название товара..."
                  className="pl-9 h-12 text-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  autoComplete="no"
                  autoCorrect="off"
                  spellCheck={false}
                  name="q-proc-search-field"
                  suppressHydrationWarning
                />
              </form>
            </div>

            <div 
              className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-2 pb-96 touch-pan-y"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {isSearching && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className="flex justify-between items-center p-4 rounded-xl border bg-card active:bg-accent cursor-pointer transition-colors touch-manipulation"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-bold leading-none">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.category.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{p.currentStock.toString()} <span className="text-[10px] text-muted-foreground">{p.unit.toLowerCase()}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form 
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="flex flex-col flex-1 min-h-0 bg-background"
          >
            <div 
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-96 touch-pan-y"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl border border-dashed flex-shrink-0">
                  <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Товар</p>
                      <p className="font-bold text-lg">{selectedProduct.name}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">На складе</p>
                      <p className="font-bold text-lg text-blue-600">
                        {selectedProduct.currentStock.toString()} {selectedProduct.unit.toLowerCase()}
                      </p>
                  </div>
                  <Button type="button" variant="outline" size="icon" className="rounded-full h-8 w-8 ml-2" onClick={() => setStep(1)}>
                      <X className="h-4 w-4" />
                  </Button>
              </div>

              <div className="space-y-6">
                  <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase text-muted-foreground">Количество ({selectedProduct.unit.toLowerCase()})</Label>
                      <Input 
                          type="text" 
                          inputMode="decimal"
                          className="h-14 text-xl font-bold" 
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value.replace(',', '.'))}
                          autoFocus
                          autoComplete="no"
                          suppressHydrationWarning
                      />
                  </div>

                  <div className="space-y-3">
                      <div className="flex bg-muted p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setPriceMode("unit")}
                          className={cn(
                            "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                            priceMode === "unit" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Цена за ед.
                        </button>
                        <button
                          type="button"
                          onClick={() => setPriceMode("total")}
                          className={cn(
                            "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                            priceMode === "total" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Общая сумма
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground">
                            {priceMode === "unit" ? "Цена за 1 " + selectedProduct.unit.toLowerCase() : "Сумма за весь объем"} (₸)
                        </Label>
                        <Input 
                            type="text" 
                            inputMode="numeric"
                            className="h-14 text-xl font-bold" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            autoComplete="no"
                            suppressHydrationWarning
                        />
                        {priceMode === "total" && quantity && price && (
                          <p className="text-[10px] text-muted-foreground font-bold text-right italic animate-in fade-in slide-in-from-right-1">
                            Выходит по {formatCurrency(parseFloat(price) / parseFloat(quantity))} за {selectedProduct.unit.toLowerCase()}
                          </p>
                        )}
                        {priceMode === "unit" && quantity && price && (
                          <p className="text-[10px] text-muted-foreground font-bold text-right italic animate-in fade-in slide-in-from-right-1">
                            Общая сумма закупа: {formatCurrency(parseFloat(price) * parseFloat(quantity))}
                          </p>
                        )}
                      </div>
                  </div>
              </div>

              <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Поставщик</Label>
                  <Input 
                      placeholder="Название компании или имя"
                      className="h-12" 
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      autoComplete="no"
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
                  className="w-full h-14 text-lg shadow-lg" 
                  onClick={handleSubmit} 
                  disabled={isLoading || !quantity || !price}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Подтвердить закуп
                </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}