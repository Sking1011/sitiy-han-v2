"use client"

import { useState, useEffect } from "react"
import { Product, Unit, PaymentSource } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  History, 
  Trash2, 
  ShoppingCart, 
  Info,
  Layers,
  ChevronRight,
  Loader2,
  Package,
  TrendingUp,
  CheckCircle2,
  ArrowDownRight,
  ArrowUpRight,
  GitMerge,
  Clock,
  User,
  Scale,
  Weight,
  Beef,
  ClipboardList,
  ScrollText
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatUnit, formatCurrency, formatDate } from "@/lib/formatters"
import { getProductHistoryAction, createDisposalAction, getBatchesAction, mergeBatchesAction, getBatchesByCategoryAction } from "@/app/actions/inventory.actions"
import { createProcurementAction } from "@/app/actions/procurement.actions"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { InventoryActionHelp } from "./inventory-action-help"

interface ProductActionDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  initialBatch?: any // Партия, из которой открыто окно
}

type ActionType = "overview" | "batches" | "history" | "disposal" | "purchase" | "merge"

const SECTIONS = [
  { id: "overview", title: "Описание варки", icon: ClipboardList },
  { id: "batches", title: "Партии (Остатки)", icon: Package },
  { id: "history", title: "История движения", icon: History },
  { id: "merge", title: "Слияние", icon: GitMerge },
  { id: "disposal", title: "Списание", icon: Trash2 },
  { id: "purchase", title: "Закуп", icon: ShoppingCart },
]

const getTransactionTypeInfo = (type: string) => {
    switch (type) {
        case "PROCUREMENT":
            return { label: "Закуп", icon: ShoppingCart, color: "text-green-600 bg-green-50 border-green-100" };
        case "SALE":
            return { label: "Продажа", icon: TrendingUp, color: "text-blue-600 bg-blue-50 border-blue-100" };
        case "PRODUCTION_USAGE":
            return { label: "Цех (исп.)", icon: Layers, color: "text-orange-600 bg-orange-50 border-orange-100" };
        case "PRODUCTION_OUTPUT":
            return { label: "Цех (выпуск)", icon: CheckCircle2, color: "text-primary bg-primary/5 border-primary/10" };
        case "DISPOSAL":
            return { label: "Списание", icon: Trash2, color: "text-red-600 bg-red-50 border-red-100" };
        case "MERGE":
            return { 
                label: "Слияние", 
                icon: GitMerge, 
                color: "text-purple-600 bg-purple-50 border-purple-100" 
            };
        default:
            return { label: type, icon: Info, color: "text-muted-foreground bg-muted/50 border-border" };
    }
}

export function ProductActionDialog({ product, open, onOpenChange, initialBatch }: ProductActionDialogProps) {
  const { data: session } = useSession()
  const [activeSection, setActiveSection] = useState<ActionType>("overview")
  const [history, setHistory] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [categoryBatches, setCategoryBatches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Обновляем активную вкладку при открытии
  useEffect(() => {
    if (open) {
        if (initialBatch?.production) {
            setActiveSection("overview")
        } else {
            setActiveSection("batches")
        }
    }
  }, [open, initialBatch])

  // Фильтруем пункты меню в зависимости от типа партии
  const visibleSections = SECTIONS.filter(s => {
      if (s.id === "overview" && !initialBatch?.production) return false;
      return true;
  });

  // Merge State
  const [sourceBatchId, setSourceBatchId] = useState<string>("")
  const [mergeQty, setMergeQty] = useState<string>("")
  const [isFullMerge, setIsFullMerge] = useState(true)

  // Disposal Form
  const [disposalQty, setDisposalQty] = useState("")
  const [disposalReason, setDisposalReason] = useState("")

  // Purchase Form
  const [purchaseQty, setPurchaseQty] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [purchasePriceMode, setPurchasePriceMode] = useState<"unit" | "total">("unit")
  const [purchaseSupplier, setPurchaseSupplier] = useState("")
  const [purchasePaymentSource, setPurchasePaymentSource] = useState<PaymentSource>(PaymentSource.BUSINESS_CASH)

  useEffect(() => {
    if (open && product) {
      if (activeSection === "history") loadHistory()
      if (activeSection === "batches") loadBatches()
      if (activeSection === "merge") loadCategoryBatches()
    }
  }, [open, product, activeSection])

  const loadHistory = async () => {
    if (!product) return
    setIsLoading(true)
    try {
      const data = await getProductHistoryAction(product.id, initialBatch?.id)
      setHistory(data)
    } finally {
      setIsLoading(false)
    }
  }

  const loadBatches = async () => {
    if (!product) return
    setIsLoading(true)
    try {
      const data = await getBatchesAction(product.id)
      // Если открыта конкретная партия, показываем только её
      if (initialBatch) {
          setBatches(data.filter((b: any) => b.id === initialBatch.id))
      } else {
          setBatches(data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategoryBatches = async () => {
    if (!product) return
    setIsLoading(true)
    try {
      const data = await getBatchesByCategoryAction(product.categoryId)
      setCategoryBatches(data)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMerge = async () => {
    if (!product || !sourceBatchId || !initialBatch?.id || !session?.user?.id) return
    
    setIsLoading(true)
    try {
      await mergeBatchesAction({
        productId: product.id,
        sourceBatchId,
        targetBatchId: initialBatch.id,
        userId: session.user.id,
        quantity: isFullMerge ? undefined : parseFloat(mergeQty)
      })
      toast.success("Слияние завершено")
      setSourceBatchId("")
      setMergeQty("")
      setActiveSection("batches")
      loadBatches()
    } catch (error) {
      toast.error("Ошибка при слиянии")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFullMerge = async () => {
    if (!product || !initialBatch?.id || batches.length < 2 || !session?.user?.id) return
    
    setIsLoading(true)
    try {
      // Сливаем все другие партии в текущую
      for (const b of batches) {
        if (b.id === initialBatch.id) continue;
        await mergeBatchesAction({
          productId: product.id,
          sourceBatchId: b.id,
          targetBatchId: initialBatch.id,
          userId: session.user.id
        })
      }
      toast.success("Все партии товара объединены в текущую")
      setActiveSection("batches")
      loadBatches()
    } catch (error) {
      toast.error("Ошибка при полном слиянии")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisposal = async () => {
    if (!product || !disposalQty || !session?.user?.id) return
    setIsLoading(true)
    try {
      await createDisposalAction({
        productId: product.id,
        quantity: parseFloat(disposalQty),
        reason: disposalReason,
        userId: session.user.id,
        batchId: initialBatch?.id // Если списание вызвано из карточки конкретной партии
      })
      toast.success("Списание успешно оформлено")
      setDisposalQty("")
      setDisposalReason("")
      setActiveSection("history")
      loadHistory()
    } catch (error) {
      toast.error("Ошибка при списании")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!product || !purchaseQty || !purchasePrice || !session?.user?.id) return
    setIsLoading(true)
    try {
      const qty = parseFloat(purchaseQty)
      const priceVal = parseFloat(purchasePrice)
      const pricePerUnit = purchasePriceMode === "total" ? priceVal / qty : priceVal

      await createProcurementAction({
        supplier: purchaseSupplier,
        paymentSource: purchasePaymentSource,
        items: [{
          productId: product.id,
          quantity: qty,
          pricePerUnit: pricePerUnit
        }]
      })
      toast.success("Закуп успешно оформлен")
      setPurchaseQty("")
      setPurchasePrice("")
      setPurchaseSupplier("")
      setActiveSection("batches")
      loadBatches()
    } catch (error) {
      toast.error("Ошибка при оформлении закупа")
    } finally {
      setIsLoading(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] p-0 gap-0 overflow-hidden sm:rounded-xl border bg-background h-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 border-b flex-shrink-0">
          <div className="flex items-center justify-between w-full pr-8">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-muted rounded-lg">
                <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                <DialogTitle className="text-xl font-bold tracking-tight">{product.name}</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Управление остатками и история</p>
                </div>
            </div>
            <InventoryActionHelp />
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden h-full">
          {/* Sidebar */}
          <div className="w-64 bg-muted/20 border-r flex-shrink-0 hidden md:block">
            <div className="p-4 space-y-1">
              {visibleSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as ActionType)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                    activeSection === section.id 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <section.icon className="w-4 h-4 shrink-0" />
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden border-b bg-muted/10 p-2 overflow-x-auto gap-2 no-scrollbar">
             {visibleSections.map((section) => (
                <Button
                    key={section.id}
                    size="sm"
                    variant={activeSection === section.id ? "default" : "ghost"}
                    onClick={() => setActiveSection(section.id as ActionType)}
                    className="shrink-0 rounded-lg h-9 px-3"
                >
                    <section.icon className="w-4 h-4 mr-2" />
                    <span className="text-xs font-bold">{section.title}</span>
                </Button>
             ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-background overflow-hidden relative flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-8 max-sm:p-6">
                {activeSection === "overview" && initialBatch?.production && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold tracking-tight">Детали варки</h3>
                            <p className="text-sm text-muted-foreground">Полная информация о производственном цикле</p>
                        </div>
                        <Badge variant="outline" className="px-3 py-1 text-xs font-bold bg-primary/5 border-primary/20 text-primary uppercase">
                            Партия #{initialBatch.id.slice(0, 8)}
                        </Badge>
                    </div>

                    {/* Основные показатели */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Начальный вес", value: formatUnit(initialBatch.production.initialWeight, "KG"), icon: Scale, color: "text-blue-600" },
                            { label: "Финальный вес", value: formatUnit(initialBatch.production.finalWeight, "KG"), icon: Weight, color: "text-green-600" },
                            { label: "Усушка", value: `${((initialBatch.production.initialWeight - initialBatch.production.finalWeight) / initialBatch.production.initialWeight * 100).toFixed(1)}%`, icon: TrendingUp, color: "text-red-500" },
                            { label: "Себестоимость", value: formatCurrency(initialBatch.pricePerUnit), icon: ShoppingCart, color: "text-primary" }
                        ].map((stat, i) => (
                            <div key={i} className="p-4 rounded-xl border bg-muted/5 space-y-1">
                                <div className="flex items-center gap-2">
                                    <stat.icon className={cn("w-3 h-3", stat.color)} />
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{stat.label}</span>
                                </div>
                                <p className="text-lg font-bold">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Левая колонка: Состав и Рецептура */}
                        <div className="space-y-8">
                            {initialBatch.production.recipe && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                                        <ScrollText className="w-4 h-4" /> Использованная рецептура
                                    </h4>
                                    <div className="p-4 rounded-xl border bg-primary/[0.02] border-primary/10 space-y-2">
                                        <p className="font-bold text-primary">{initialBatch.production.recipe.name}</p>
                                        {initialBatch.production.recipe.description && (
                                            <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-3">
                                                {initialBatch.production.recipe.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                                    <Beef className="w-4 h-4" /> Состав сырья
                                </h4>
                                <div className="rounded-xl border overflow-hidden">
                                <table className="w-full text-xs">
                                    <thead className="bg-muted/50 border-b">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-bold">Ингредиент</th>
                                            <th className="px-4 py-2 text-right font-bold">Кол-во</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {initialBatch.production.materials.map((m: any, i: number) => (
                                            <tr key={i} className="bg-background">
                                                <td className="px-4 py-2.5 font-medium">{m.product.name}</td>
                                                <td className="px-4 py-2.5 text-right font-bold">{formatUnit(m.quantityUsed, m.product.unit)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                        {/* Время и Оператор */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                                    <Clock className="w-4 h-4" /> Тайминги этапов
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Подготовка", val: initialBatch.production.prepTime },
                                        { label: "Сушка", val: initialBatch.production.dryingTime },
                                        { label: "Копчение", val: initialBatch.production.smokingTime },
                                        { label: "Варка", val: initialBatch.production.boilingTime }
                                    ].map((t, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 rounded-lg border bg-muted/10">
                                            <span className="text-[11px] font-medium">{t.label}</span>
                                            <span className="text-xs font-bold">{t.val || 0} мин</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border bg-primary/5 border-primary/10 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-primary uppercase">Исполнитель</p>
                                        <p className="text-sm font-bold">{initialBatch.production.performer.name}</p>
                                    </div>
                                </div>
                                {initialBatch.production.note && initialBatch.production.note.replace(/\[RecipeID:.*?\]/g, "").trim() && (
                                    <div className="pt-2 border-t border-primary/10">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Примечание</p>
                                        <p className="text-xs italic text-muted-foreground leading-relaxed mt-1">
                                            "{initialBatch.production.note.replace(/\[RecipeID:.*?\]/g, "").trim()}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                  </div>
                )}

                {activeSection === "batches" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold tracking-tight">Активные партии</h3>
                    {isLoading ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {batches.map((batch) => (
                          <div key={batch.id} className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-sm">
                                {batch.procurementItem?.procurement?.supplier || "Склад"}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                {formatDate(batch.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-base font-bold">
                                {formatUnit(batch.remainingQuantity, product.unit)} <span className="text-xs text-muted-foreground font-normal">/ {batch.initialQuantity}</span>
                              </p>
                              <p className="text-[10px] text-muted-foreground font-medium">
                                {formatCurrency(batch.pricePerUnit)} за {product.unit.toLowerCase()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {batches.length === 0 && (
                          <div className="text-center py-10 border-2 border-dashed rounded-xl">
                            <Package className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground">Активных партий не найдено</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeSection === "merge" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold tracking-tight">Слияние в текущую партию</h3>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleFullMerge}
                            disabled={isLoading || batches.length < 2 || !initialBatch}
                        >
                            <GitMerge className="w-4 h-4 mr-2" />
                            Влить всё
                        </Button>
                    </div>

                    {!initialBatch ? (
                        <div className="p-10 text-center border-2 border-dashed rounded-xl bg-muted/5">
                            <Info className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground">Для слияния откройте "Действие" конкретной партии</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl border bg-muted/20 border-border/50">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Принимающая партия (Цель)</p>
                                <p className="font-bold text-sm">#{initialBatch.id.slice(0, 8)} | {initialBatch.info}</p>
                                <p className="text-xs text-muted-foreground mt-1">Остаток: {formatUnit(initialBatch.remainingQuantity, product.unit)}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Источник переноса</Label>
                                    <Select value={sourceBatchId} onValueChange={setSourceBatchId}>
                                        <SelectTrigger className="h-12 bg-background">
                                            <SelectValue placeholder="Выберите партию из категории..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoryBatches.filter(b => b.id !== initialBatch.id).map(b => (
                                                <SelectItem key={b.id} value={b.id}>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-xs">{b.productName}</span>
                                                        <span className="text-[10px] opacity-70">
                                                            {formatDate(b.createdAt)} | {b.remainingQuantity} {product.unit.toLowerCase()} | {formatCurrency(b.pricePerUnit)}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {sourceBatchId && (
                                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div className="flex bg-muted p-1 rounded-lg w-fit">
                                            <button
                                                onClick={() => setIsFullMerge(true)}
                                                className={cn(
                                                    "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all",
                                                    isFullMerge ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Весь остаток
                                            </button>
                                            <button
                                                onClick={() => setIsFullMerge(false)}
                                                className={cn(
                                                    "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all",
                                                    !isFullMerge ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Выбрать вес
                                            </button>
                                        </div>

                                        {!isFullMerge && (
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Вес для переноса ({product.unit.toLowerCase()})</Label>
                                                <Input 
                                                    type="number" inputMode="decimal" step="0.001"
                                                    className="h-12 text-lg font-bold"
                                                    placeholder="0.000"
                                                    value={mergeQty}
                                                    onChange={(e) => setMergeQty(e.target.value.replace(',', '.'))}
                                                />
                                            </div>
                                        )}

                                        <div className="p-5 rounded-xl border bg-muted/5 space-y-4">
                                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Итоговый результат в текущей партии</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] uppercase text-muted-foreground font-medium mb-0.5">Новый вес</p>
                                                    <p className="text-lg font-bold">
                                                        {(Number(initialBatch.remainingQuantity) + 
                                                         (isFullMerge ? Number(categoryBatches.find(b => b.id === sourceBatchId)?.remainingQuantity || 0) : parseFloat(mergeQty) || 0)).toFixed(3)} {product.unit.toLowerCase()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase text-muted-foreground font-medium mb-0.5">Новая цена</p>
                                                    <p className="text-lg font-bold">
                                                        {formatCurrency(
                                                            ((isFullMerge ? Number(categoryBatches.find(b => b.id === sourceBatchId)?.remainingQuantity || 0) : parseFloat(mergeQty) || 0) * Number(categoryBatches.find(b => b.id === sourceBatchId)?.pricePerUnit || 0) +
                                                             Number(initialBatch.remainingQuantity) * Number(initialBatch.pricePerUnit)) /
                                                            (Number(initialBatch.remainingQuantity) + (isFullMerge ? Number(categoryBatches.find(b => b.id === sourceBatchId)?.remainingQuantity || 0) : parseFloat(mergeQty) || 0))
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button 
                                                className="w-full h-12 font-bold mt-2"
                                                onClick={handleMerge}
                                                disabled={isLoading || (!isFullMerge && !mergeQty)}
                                            >
                                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <GitMerge className="w-4 h-4 mr-2" />}
                                                Выполнить перенос
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                  </div>
                )}

                {activeSection === "history" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold tracking-tight">История движения</h3>
                    {isLoading ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {history.map((item) => {
                          const info = getTransactionTypeInfo(item.type);
                          return (
                            <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl border bg-muted/5">
                              <div className="flex gap-3 items-start">
                                <div className={cn("p-2 rounded-lg border", info.color)}>
                                   <info.icon className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                      {info.label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-medium">{formatDate(item.date)}</span>
                                  </div>
                                  <p className="font-semibold text-sm">{item.counterparty}</p>
                                  <p className="text-[10px] text-muted-foreground">Исполнитель: {item.performedBy}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={cn(
                                  "text-base font-bold",
                                  item.quantity > 0 ? "text-green-600" : "text-red-600"
                                )}>
                                  {item.quantity > 0 ? "+" : ""}{item.quantity} {product.unit.toLowerCase()}
                                </p>
                                {item.price && (
                                  <p className="text-[10px] text-muted-foreground">{formatCurrency(item.price)}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeSection === "disposal" && (
                  <div className="space-y-6 max-w-sm mx-auto pt-4">
                    <div className="text-center space-y-1">
                        <h3 className="text-xl font-bold tracking-tight">Списание</h3>
                        <p className="text-xs text-muted-foreground">Уменьшение остатков вручную</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Кол-во ({product.unit.toLowerCase()})</Label>
                        <Input 
                          type="number" inputMode="decimal" step="0.001"
                          className="h-12 text-lg font-bold"
                          placeholder="0.000"
                          value={disposalQty}
                          onChange={(e) => setDisposalQty(e.target.value.replace(',', '.'))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Причина</Label>
                        <Input 
                          placeholder="Укажите причину..."
                          className="h-12"
                          value={disposalReason}
                          onChange={(e) => setDisposalReason(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="w-full h-12 font-bold mt-2"
                        onClick={handleDisposal}
                        disabled={isLoading || !disposalQty}
                      >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Подтвердить
                      </Button>
                    </div>
                  </div>
                )}

                {activeSection === "purchase" && (
                  <div className="space-y-6 max-w-sm mx-auto pt-4">
                    <div className="text-center space-y-1">
                        <h3 className="text-xl font-bold tracking-tight">Быстрый закуп</h3>
                        <p className="text-xs text-muted-foreground">Оформите поступление товара</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Количество</Label>
                          <Input 
                            type="number" inputMode="decimal" step="0.001"
                            className="h-12 text-lg font-bold"
                            placeholder="0.000"
                            value={purchaseQty}
                            onChange={(e) => setPurchaseQty(e.target.value.replace(',', '.'))}
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex bg-muted p-1 rounded-lg">
                            <button
                              onClick={() => setPurchasePriceMode("unit")}
                              className={cn(
                                "flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all",
                                purchasePriceMode === "unit" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              Цена за ед.
                            </button>
                            <button
                              onClick={() => setPurchasePriceMode("total")}
                              className={cn(
                                "flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all",
                                purchasePriceMode === "total" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              Общая сумма
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                              {purchasePriceMode === "unit" ? "Цена (₸)" : "Сумма (₸)"}
                            </Label>
                            <Input 
                              type="number" inputMode="numeric"
                              className="h-12 text-lg font-bold"
                              placeholder="0"
                              value={purchasePrice}
                              onChange={(e) => setPurchasePrice(e.target.value)}
                            />
                            {purchaseQty && purchasePrice && (
                                <p className="text-[10px] text-muted-foreground font-medium text-right">
                                    {purchasePriceMode === "total" 
                                        ? `~ ${formatCurrency(parseFloat(purchasePrice) / parseFloat(purchaseQty))} / ${product.unit.toLowerCase()}`
                                        : `Итого: ${formatCurrency(parseFloat(purchasePrice) * parseFloat(purchaseQty))}`
                                    }
                                </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Поставщик</Label>
                        <Input 
                          placeholder="Название компании"
                          className="h-11"
                          value={purchaseSupplier}
                          onChange={(e) => setPurchaseSupplier(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Оплата</Label>
                        <Select value={purchasePaymentSource} onValueChange={(v: any) => setPurchasePaymentSource(v)}>
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={PaymentSource.BUSINESS_CASH}>Бизнес Касса</SelectItem>
                            <SelectItem value={PaymentSource.PERSONAL_FUNDS}>Личные средства</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        className="w-full h-12 font-bold mt-2"
                        onClick={handlePurchase}
                        disabled={isLoading || !purchaseQty || !purchasePrice}
                      >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Подтвердить закуп
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t bg-muted/5 flex items-center justify-between text-[10px] text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5 uppercase tracking-wider">
                <Info className="w-3 h-3" />
                <span>Сити Хан v2</span>
              </div>
              <div>
                Остаток: <span className="font-bold text-foreground">{formatUnit(Number(product.currentStock), product.unit)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
