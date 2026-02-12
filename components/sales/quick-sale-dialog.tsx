"use client"

import { useState, useEffect } from "react"
import { createSaleAction } from "@/app/actions/sales.actions"
import { searchProductsAction } from "@/app/actions/inventory.actions"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Loader2, TrendingUp, X, AlertCircle } from "lucide-react"

export function QuickSaleDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const [step, setStep] = useState(1) // 1: Search, 2: Details
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form values
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [customer, setCustomer] = useState("")

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
    setError(null)
    // Auto-fill selling price if set, otherwise leave empty for manual entry
    const sPrice = Number(p.sellingPrice)
    setPrice(sPrice > 0 ? sPrice.toString() : "") 
    setStep(2)
  }

  const handleReset = () => {
    setStep(1)
    setSearch("")
    setSelectedProduct(null)
    setQuantity("")
    setPrice("")
    setCustomer("")
    setError(null)
  }

  const handleSubmit = async () => {
    if (!selectedProduct || !quantity || !price) return

    setIsLoading(true)
    setError(null)
    try {
      const result = await createSaleAction({
        customer,
        items: [{
          productId: selectedProduct.id,
          quantity: parseFloat(quantity),
          pricePerUnit: parseFloat(price)
        }]
      })

      if (result.success) {
        handleReset()
        onOpenChange(false)
      } else {
        setError(result.error || "Ошибка при продаже")
      }
    } catch (err) {
      setError("Произошла системная ошибка")
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
          <input type="text" name="fake-username" tabIndex={-1} />
          <input type="password" name="fake-password" tabIndex={-1} />
        </div>

        <DialogHeader className="p-4 sm:p-6 pb-2 border-b sm:border-none flex-shrink-0 bg-background z-10 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Быстрая продажа
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
                  placeholder="Что продаем?..."
                  className="pl-9 h-12 text-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  autoComplete="no"
                  autoCorrect="off"
                  spellCheck={false}
                  name="q-sale-search-field"
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
              {error && (
                <Alert variant="destructive" className="flex-shrink-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl border border-dashed flex-shrink-0">
                  <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Товар</p>
                      <p className="font-bold text-lg">{selectedProduct.name}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Остаток</p>
                      <p className={cn(
                        "font-bold text-lg",
                        selectedProduct.currentStock <= 0 ? "text-red-500" : "text-green-600"
                      )}>
                        {selectedProduct.currentStock.toString()} {selectedProduct.unit.toLowerCase()}
                      </p>
                  </div>
                  <Button type="button" variant="outline" size="icon" className="rounded-full h-8 w-8 ml-2" onClick={() => setStep(1)}>
                      <X className="h-4 w-4" />
                  </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase text-muted-foreground">Кол-во ({selectedProduct.unit.toLowerCase()})</Label>
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
                  <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase text-muted-foreground">Цена продажи (₸/кг)</Label>
                      <Input 
                          type="text" 
                          inputMode="numeric"
                          className="h-14 text-xl font-bold border-primary/20" 
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          autoComplete="no"
                          suppressHydrationWarning
                      />
                  </div>
              </div>

              <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Клиент</Label>
                  <Input 
                      placeholder="Имя клиента (необязательно)"
                      className="h-12" 
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      autoComplete="no"
                      suppressHydrationWarning
                  />
              </div>
            </div>

            <div className="p-4 bg-background border-t sm:p-6 flex-shrink-0 z-10 mt-auto">
              <Button 
                type="submit"
                className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 shadow-lg" 
                disabled={isLoading || !quantity || !price}
              >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Зафиксировать продажу
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
