"use client"

import { useState, useEffect } from "react"
import { Product, Category } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatUnit, formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { 
    AlertTriangle, 
    Calendar,
    ArrowUpRight,
    Settings2,
    TrendingUp
} from "lucide-react"
import Link from "next/link"
import { ProductDialog } from "./product-dialog"
import { ProductActionDialog } from "./product-action-dialog"

interface ProductWithData extends Product {
  category: Category & { isFinished: boolean }
  procurementItems: any[]
  sellingPrice: number
  batches: any[]
}

interface ProductGridClientProps {
  products: ProductWithData[]
  categories: Category[]
}

export function ProductGridClient({ products, categories }: ProductGridClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isActionOpen, setIsActionOpen] = useState(false)
  const [actionProduct, setActionProduct] = useState<Product | null>(null)
  const [actionBatch, setActionBatch] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState("raw")

  const rawProducts = products.filter(p => !p.category.isFinished)
  const finishedProducts = products.filter(p => p.category.isFinished)
  
  // Автоматическое переключение вкладки при фильтрации
  useEffect(() => {
    if (rawProducts.length === 0 && finishedProducts.length > 0 && activeTab === "raw") {
      setActiveTab("finished")
    }
  }, [rawProducts.length, finishedProducts.length])

  // Разворачиваем партии готовой продукции в отдельные карточки + добавляем товары без партий
  const finishedDisplayItems = finishedProducts.flatMap(p => {
    if (p.batches.length === 0) {
      return [{ 
        id: `empty-${p.id}`, 
        product: p, 
        isPlaceholder: true, 
        remainingQuantity: 0, 
        pricePerUnit: p.averagePurchasePrice, 
        date: p.createdAt, 
        performer: "Нет данных",
        info: "Ожидает производства"
      }];
    }
    return p.batches.map(b => ({ ...b, product: p }));
  })

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleShowAction = (product: Product, batch?: any) => {
    setActionProduct(product)
    setActionBatch(batch || null)
    setIsActionOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setSelectedProduct(null)
    }
  }

  const ProductCard = ({ product, isFinished, batch }: { product: ProductWithData, isFinished: boolean, batch?: any }) => {
      const current = batch ? Number(batch.remainingQuantity) : Number(product.currentStock);
      const min = Number(product.minStock);
      const isLow = !batch && current <= min;
      const lastProcurement = (product as any).procurementItems[0]?.procurement?.date;
      const progressValue = min > 0 ? Math.min((current / (min * 3)) * 100, 100) : (current > 0 ? 100 : 0);
      
      const costPrice = batch ? Number(batch.pricePerUnit) : Number(product.averagePurchasePrice);
      const sellingPrice = Number(product.sellingPrice);
      const margin = sellingPrice - costPrice;
      const marginPercent = costPrice > 0 ? (margin / costPrice) * 100 : 0;

      return (
        <Card className={`overflow-hidden transition-all hover:shadow-md flex flex-col ${isLow ? 'border-destructive/50 bg-destructive/5' : ''} ${batch && !batch.isPlaceholder ? 'border-primary/20 bg-primary/[0.02]' : ''}`}>
          <CardHeader className="p-4 pb-2 space-y-0">
            <div className="flex justify-between items-start mb-1">
              <Badge 
                variant="outline" 
                className="text-[10px] uppercase font-bold w-fit"
                style={{ 
                    backgroundColor: (product.category.color || '#ccc') + '20',
                    borderColor: product.category.color || '#ccc',
                    color: product.category.color || 'inherit'
                }}
              >
                {product.category.name}
              </Badge>
              
              {batch && !batch.isPlaceholder ? (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight opacity-70">
                    ID #{batch.id.slice(0, 8)}
                </span>
              ) : (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 -mr-2 -mt-2 hover:bg-muted"
                    onClick={() => handleEdit(product)}
                >
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
            <CardTitle className="text-lg leading-tight line-clamp-2 min-h-[3rem] mt-1 font-bold">
                {product.name}
                {batch && (
                    <div className="flex flex-col gap-0.5 mt-2 font-normal">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Calendar className="h-3 w-3" /> 
                            <span>Дата: {batch.date ? new Date(batch.date).toLocaleDateString('ru-RU') : '—'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <TrendingUp className="h-3 w-3 rotate-90" /> 
                            <span>Оператор: {batch.performer}</span>
                        </div>
                        {batch && !batch.isPlaceholder && (
                            <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold">
                                <TrendingUp className="h-3 w-3" /> 
                                <span>Прибыль: {formatCurrency(margin)} ({marginPercent.toFixed(0)}%)</span>
                            </div>
                        )}
                    </div>
                )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 pt-2 space-y-4 flex-1 flex flex-col justify-end">
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

            {isFinished ? (
               // Unified Layout for Finished Goods (Batch)
               <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t">
                  <div className="flex flex-col gap-0.5">
                     <span className="text-muted-foreground">Себестоимость</span>
                     <span className="font-bold">{formatCurrency(costPrice)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-right">
                     <span className="text-muted-foreground">Цена продажи</span>
                     <span className="font-black text-sm text-primary">{formatCurrency(sellingPrice)}</span>
                  </div>
               </div>
            ) : (
               // Layout for Raw Materials
               <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t">
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Посл. закуп
                        </span>
                        <span className="font-medium">
                            {lastProcurement ? new Date(lastProcurement).toLocaleDateString('ru-RU') : 'Нет данных'}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                        <span className="text-muted-foreground flex items-center gap-1 justify-end">
                             Цена закупа (ср.)
                        </span>
                        <span className="font-bold text-base">
                            {formatCurrency(costPrice)}
                        </span>
                    </div>
               </div>
            )}

            <Button 
                variant="secondary" 
                className="w-full h-10 text-xs font-bold gap-2 mt-3 rounded-xl shadow-sm"
                disabled={batch?.isPlaceholder}
                onClick={() => handleShowAction(product, batch)}
            >
                {batch?.isPlaceholder ? "Нет в наличии" : "Действие"} <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      );
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
            <TabsTrigger value="raw">Сырье и Материалы</TabsTrigger>
            <TabsTrigger value="finished">Готовая Продукция</TabsTrigger>
        </TabsList>
        
        <TabsContent value="raw">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {rawProducts.map(product => (
                    <ProductCard key={product.id} product={product} isFinished={false} />
                ))}
                {rawProducts.length === 0 && <p className="text-muted-foreground text-sm col-span-full text-center py-10">В этой категории пока нет товаров.</p>}
            </div>
        </TabsContent>
        
        <TabsContent value="finished">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {finishedDisplayItems.map(batchData => (
                    <ProductCard 
                        key={batchData.id} 
                        product={batchData.product} 
                        isFinished={true} 
                        batch={batchData} 
                    />
                ))}
                {finishedDisplayItems.length === 0 && <p className="text-muted-foreground text-sm col-span-full text-center py-10">Готовой продукции пока нет. Создайте варку на странице производства.</p>}
            </div>
        </TabsContent>
      </Tabs>

      <ProductDialog 
        product={selectedProduct}
        categories={categories}
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
      />

      <ProductActionDialog 
        product={actionProduct}
        open={isActionOpen}
        onOpenChange={setIsActionOpen}
        initialBatch={actionBatch}
      />
    </>
  )
}
