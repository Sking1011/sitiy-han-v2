"use client"

import { useState } from "react"
import { Product, Category } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatUnit } from "@/lib/formatters"
import { 
    AlertTriangle, 
    Calendar,
    ArrowUpRight,
    Settings2
} from "lucide-react"
import Link from "next/link"
import { ProductDialog } from "./product-dialog"
import { ProductHistoryDialog } from "./product-history-dialog"

interface ProductWithData extends Product {
  category: Category
  procurementItems: any[]
}

interface ProductGridClientProps {
  products: ProductWithData[]
  categories: Category[]
}

export function ProductGridClient({ products, categories }: ProductGridClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null)

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleShowHistory = (product: Product) => {
    setHistoryProduct(product)
    setIsHistoryOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setSelectedProduct(null)
    }
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const current = Number(product.currentStock);
          const min = Number(product.minStock);
          const isLow = current <= min;
          const lastProcurement = (product as any).procurementItems[0]?.procurement?.date;
          
          const progressValue = min > 0 ? Math.min((current / (min * 3)) * 100, 100) : (current > 0 ? 100 : 0);

          return (
            <Card key={product.id} className={`overflow-hidden transition-all hover:shadow-md ${isLow ? 'border-destructive/50 bg-destructive/5' : ''}`}>
              <CardHeader className="p-4 pb-2 space-y-0">
                <div className="flex justify-between items-start mb-1">
                  <Badge 
                    variant="outline" 
                    className="text-[10px] uppercase font-bold"
                    style={{ 
                        backgroundColor: (product.category.color || '#ccc') + '20',
                        borderColor: product.category.color || '#ccc',
                        color: product.category.color || 'inherit'
                    }}
                  >
                    {product.category.name}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 -mr-2 -mt-2"
                    onClick={() => handleEdit(product)}
                  >
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 pt-2 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-black">
                            {formatUnit(current, product.unit)}
                        </span>
                        {isLow && (
                            <span className="text-destructive flex items-center gap-1 text-xs font-bold animate-pulse">
                                <AlertTriangle className="h-3 w-3" /> МАЛО
                            </span>
                        )}
                    </div>
                    <Progress 
                        value={progressValue} 
                        className={`h-1.5 ${isLow ? 'bg-destructive/20' : ''}`}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t">
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Последний закуп
                        </span>
                        <span className="font-medium">
                            {lastProcurement ? new Date(lastProcurement).toLocaleDateString('ru-RU') : 'Нет данных'}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                        <span className="text-muted-foreground flex items-center gap-1 justify-end">
                             Средняя цена
                        </span>
                        <span className="font-medium">
                            {Number(product.averagePurchasePrice).toLocaleString()} ₸
                        </span>
                    </div>
                </div>

                <Button 
                    variant="secondary" 
                    className="w-full h-8 text-xs gap-1"
                    onClick={() => handleShowHistory(product)}
                >
                    История движения <ArrowUpRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ProductDialog 
        product={selectedProduct}
        categories={categories}
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
      />

      <ProductHistoryDialog 
        product={historyProduct}
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
    </>
  )
}
