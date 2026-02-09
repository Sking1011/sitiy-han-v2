"use client"

import { useState, useEffect } from "react"
import { createSaleAction } from "@/app/actions/sales.actions"
import { searchProductsAction } from "@/app/actions/inventory.actions"
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
    setPrice("") 
    setStep(2)
  }

  const handleReset = () => {
    setStep(1)
    setSearch("")
    setSelectedProduct(null)
    setQuantity("")
    setPrice("")
    setError(null)
  }

  const handleSubmit = async () => {
    if (!selectedProduct || !quantity || !price) return

    setIsLoading(true)
    setError(null)
    try {
      const result = await createSaleAction({
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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5" />
            Быстрая продажа
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Что продаем?..."
                className="pl-9 h-12 text-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {isSearching && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className="flex justify-between items-center p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">{p.category.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{p.currentStock.toString()} {p.unit.toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                <div>
                    <p className="text-xs text-muted-foreground uppercase">Товар</p>
                    <p className="font-bold">{selectedProduct.name}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setStep(1)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Кол-во ({selectedProduct.unit.toLowerCase()})</Label>
                    <Input 
                        type="number" 
                        step="any" 
                        className="h-12 text-lg" 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="space-y-2">
                    <Label>Цена продажи (₸)</Label>
                    <Input 
                        type="number" 
                        className="h-12 text-lg" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
            </div>

            <Button className="w-full h-14 text-lg bg-green-600 hover:bg-green-700" onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Зафиксировать продажу
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}