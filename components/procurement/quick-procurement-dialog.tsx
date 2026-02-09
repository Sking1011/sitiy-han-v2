"use client"

import { useState, useEffect } from "react"
import { Product, PaymentSource } from "@prisma/client"
import { createProcurementAction } from "@/app/actions/procurement.actions"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Loader2, ShoppingCart, X, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  const [paymentSource, setPaymentSource] = useState<PaymentSource>(PaymentSource.BUSINESS_CASH)

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
    setStep(2)
  }

  const handleReset = () => {
    setStep(1)
    setSearch("")
    setSelectedProduct(null)
    setQuantity("")
    setPrice("")
  }

  const handleSubmit = async () => {
    if (!selectedProduct || !quantity || !price) return

    setIsLoading(true)
    try {
      await createProcurementAction({
        paymentSource,
        items: [{
          productId: selectedProduct.id,
          quantity: parseFloat(quantity),
          pricePerUnit: parseFloat(price)
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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5" />
            Быстрый закуп
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Начните вводить название товара..."
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
              {search.length > 1 && !isSearching && products.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                    Товар не найден. <br/>
                    <Button variant="link" asChild className="p-0 h-auto" onClick={() => onOpenChange(false)}>
                        <Link href="/inventory/new">Создать новый?</Link>
                    </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                <div>
                    <p className="text-xs text-muted-foreground uppercase">Выбран товар</p>
                    <p className="font-bold">{selectedProduct.name}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setStep(1)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Количество ({selectedProduct.unit.toLowerCase()})</Label>
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
                    <Label>Цена за ед. (₸)</Label>
                    <Input 
                        type="number" 
                        className="h-12 text-lg" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Источник оплаты</Label>
                <Select value={paymentSource} onValueChange={(v: any) => setPaymentSource(v)}>
                    <SelectTrigger className="h-12">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={PaymentSource.BUSINESS_CASH}>🏢 Бизнес Касса</SelectItem>
                        <SelectItem value={PaymentSource.PERSONAL_FUNDS}>👤 Личные средства</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button className="w-full h-14 text-lg" onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Подтвердить закуп
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

import Link from "next/link"
