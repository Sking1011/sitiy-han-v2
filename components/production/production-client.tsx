"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Weight, 
  TrendingDown, 
  Receipt,
  RotateCcw
} from "lucide-react"
import { createProductionAction, updateProductionAction } from "@/app/actions/production.actions"
import { ProductionStatus } from "@prisma/client"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ProductionClientProps {
  initialMaterials: any[]
  initialRecipes: any[]
  history: any[]
  activeProductions: any[]
  userId: string
}

export function ProductionClient({ 
  initialMaterials, 
  initialRecipes, 
  history: initialHistory,
  activeProductions,
  userId 
}: ProductionClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("new")
  const [isCompleting, setIsCompleting] = useState<string | null>(null)

  const handleSuccess = (status: ProductionStatus) => {
    router.refresh()
    if (status === ProductionStatus.COMPLETED) {
        setActiveTab("history")
    }
  }

  const handleQuickComplete = async (p: any) => {
    if (!p.finalWeight || Number(p.finalWeight) <= 0) {
      toast.error("Не указан конечный вес. Перейдите к готовке и укажите вес готовой продукции.")
      setActiveTab(`edit-${p.id}`)
      return
    }

    setIsCompleting(p.id)
    try {
      await updateProductionAction(p.id, { 
        status: ProductionStatus.COMPLETED 
      })
      toast.success("Производство успешно завершено")
      router.refresh()
    } catch (error) {
      toast.error("Ошибка при завершении")
    } finally {
      setIsCompleting(null)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex w-fit mb-6 bg-muted p-1 rounded-xl overflow-y-hidden overflow-x-auto max-w-full no-scrollbar">
        <TabsTrigger value="new" className="px-4 sm:px-8 h-9 rounded-lg transition-all">
          Новое производство
        </TabsTrigger>
        <TabsTrigger value="history" className="px-4 sm:px-8 h-9 rounded-lg transition-all">
          История
        </TabsTrigger>
        {activeProductions.map((prod) => (
          <TabsTrigger 
            key={prod.id}
            value={`edit-${prod.id}`}
            className="px-4 sm:px-8 h-9 rounded-lg transition-all data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600 data-[state=active]:border-green-500/20 border border-transparent ml-1"
          >
            <span className="truncate flex items-center gap-2 max-w-[120px] sm:max-w-[180px]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
              {prod.items[0]?.product.name || "В процессе"}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="new" className="mt-0 outline-none">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ProductionForm 
                initialMaterials={initialMaterials}
                initialRecipes={initialRecipes}
                userId={userId}
                onSuccess={handleSuccess}
            />
        </div>
      </TabsContent>

      {activeProductions.map((prod) => (
        <TabsContent key={prod.id} value={`edit-${prod.id}`} className="mt-0 outline-none">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ProductionForm 
                    key={prod.id}
                    initialMaterials={initialMaterials}
                    initialRecipes={initialRecipes}
                    userId={userId}
                    onSuccess={handleSuccess}
                    initialData={prod}
                />
            </div>
        </TabsContent>
      ))}

      <TabsContent value="history" className="mt-0 outline-none">
        <Card className="border-none shadow-none sm:border sm:shadow-sm">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>История производства</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="hidden md:block">
              <ScrollArea className="h-[600px] pr-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Продукт</TableHead>
                      <TableHead>Вес (Нач/Кон)</TableHead>
                      <TableHead>Затраты</TableHead>
                      <TableHead>Себ-сть</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialHistory.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs">{formatDate(p.date)}<p className="text-[10px] text-muted-foreground">{p.performer.name}</p></TableCell>
                        <TableCell><span className="font-medium">{p.items[0]?.product.name || "N/A"}</span></TableCell>
                        <TableCell className="text-xs">
                          <div className="font-bold">{p.initialWeight}кг &rarr; {p.finalWeight}кг</div>
                          <div className="text-destructive flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            -{((p.initialWeight - p.finalWeight)).toFixed(3)}кг (-{p.initialWeight > 0 ? ((p.initialWeight - p.finalWeight) / p.initialWeight * 100).toFixed(1) : 0}%)
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(p.totalCost)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(p.items[0]?.calculatedCostPerUnit)}/кг</TableCell>
                        <TableCell><Badge variant={p.status === "COMPLETED" ? "default" : "secondary"}>{p.status === "COMPLETED" ? "Готово" : "В процессе"}</Badge></TableCell>
                        <TableCell>
                            {p.status === "IN_PROGRESS" && (
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className={cn(activeTab === `edit-${p.id}` && "bg-green-50 text-green-600 border-green-200")} onClick={() => setActiveTab(`edit-${p.id}`)}>
                                        {activeTab === `edit-${p.id}` ? "Активно" : "Перейти"}
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="default" 
                                        className="bg-primary hover:bg-primary/90"
                                        disabled={isCompleting === p.id}
                                        onClick={() => handleQuickComplete(p)}
                                    >
                                        Завершить
                                    </Button>
                                </div>
                            )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            <div className="md:hidden space-y-4">
              {initialHistory.map((p) => (
                <Card key={p.id} className={cn("overflow-hidden border-primary/10", activeTab === `edit-${p.id}` && "border-green-500/30 ring-1 ring-green-500/20")}>
                  <div className="p-4 bg-muted/30 border-b flex justify-between items-center">
                    <div className="text-xs font-bold">{formatDate(p.date)}</div>
                    <Badge variant={p.status === "COMPLETED" ? "default" : "secondary"}>
                      {p.status === "COMPLETED" ? "Готово" : "В процессе"}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-black">{p.items[0]?.product.name || "N/A"}</p>
                        <p className="text-[10px] text-muted-foreground">Исп: {p.performer.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{formatCurrency(p.items[0]?.calculatedCostPerUnit)}/кг</p>
                        <p className="text-[10px] text-muted-foreground">Затраты: {formatCurrency(p.totalCost)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed">
                      <div className="bg-background p-2 rounded border border-border">
                        <p className="text-[8px] uppercase text-muted-foreground font-bold">Вес (Нач &rarr; Кон)</p>
                        <p className="text-xs font-bold">{p.initialWeight}кг &rarr; {p.finalWeight}кг</p>
                      </div>
                      <div className="bg-background p-2 rounded border border-border">
                        <p className="text-[8px] uppercase text-muted-foreground font-bold">Усушка</p>
                        <p className="text-xs font-bold text-red-500">
                          -{((p.initialWeight - p.finalWeight)).toFixed(3)}кг (-{p.initialWeight > 0 ? ((p.initialWeight - p.finalWeight) / p.initialWeight * 100).toFixed(1) : 0}%)
                        </p>
                      </div>
                    </div>
                    {p.status === "IN_PROGRESS" && (
                      <div className="flex gap-2 mt-2">
                        <Button className={cn("flex-1 h-10", activeTab === `edit-${p.id}` && "bg-green-600 hover:bg-green-700")} variant={activeTab === `edit-${p.id}` ? "default" : "outline"} onClick={() => setActiveTab(`edit-${p.id}`)}>
                            {activeTab === `edit-${p.id}` ? "В процессе" : "Перейти"}
                        </Button>
                        <Button 
                            className="flex-1 h-10" 
                            variant="default"
                            disabled={isCompleting === p.id}
                            onClick={() => handleQuickComplete(p)}
                        >
                            {isCompleting === p.id ? "..." : "Завершить"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function ProductionForm({ 
    initialMaterials, 
    initialRecipes, 
    userId, 
    onSuccess,
    initialData 
}: { 
    initialMaterials: any[], 
    initialRecipes: any[], 
    userId: string, 
    onSuccess: (s: ProductionStatus) => void,
    initialData?: any 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const editingId = initialData?.id || null

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("")
  const [materials, setMaterials] = useState<any[]>([])
  // Map of productId -> batchId
  const [selectedBatches, setSelectedBatches] = useState<Record<string, string>>({}) 
  
  const [targetProduct, setTargetProduct] = useState<string>("")
  const [meatBaseWeight, setMeatBaseWeight] = useState<string>("1.000")
  const [prepTime, setPrepTime] = useState<string>("")
  const [dryingTime, setDryingTime] = useState<string>("")
  const [smokingTime, setSmokingTime] = useState<string>("")
  const [boilingTime, setBoilingTime] = useState<string>("")
  const [initialWeight, setInitialWeight] = useState<string>("")
  const [finalWeight, setFinalWeight] = useState<string>("")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (initialData) {
        const recipeMatch = initialData.note?.match(/\[RecipeID:(.*?)\]/);
        const rId = recipeMatch ? recipeMatch[1] : "";
        setSelectedRecipeId(rId)
        
        const materialsData = initialData.materials.map((m: any) => ({
          productId: m.productId,
          name: m.product.name,
          unit: m.product.unit,
          quantity: Number(m.quantityUsed),
          pricePerUnit: Number(m.product.averagePurchasePrice), // Fallback if no batch info saved in legacy
          recipeQuantity: 0, 
          isMain: false,
          batches: initialMaterials.find(im => im.id === m.productId)?.batches || []
        }))
        
        if (rId) {
            const recipe = initialRecipes.find(r => r.id === rId);
            if (recipe) {
                const updatedMaterials = materialsData.map((m: any) => {
                    const ri = recipe.ingredients.find((i: any) => i.ingredientId === m.productId);
                    return {
                        ...m,
                        recipeQuantity: ri ? Number(ri.quantity) : 0,
                        isMain: ri ? ri.isMain : false
                    }
                });
                setMaterials(updatedMaterials)
                
                const mainIng = recipe.ingredients.find((i: any) => i.isMain);
                const actualMain = initialData.materials.find((m: any) => m.productId === mainIng?.ingredientId);
                if (mainIng && actualMain) {
                    const base = Number(actualMain.quantityUsed) / Number(mainIng.quantity);
                    setMeatBaseWeight(base.toFixed(3));
                }
            } else {
                setMaterials(materialsData)
            }
        } else {
            setMaterials(materialsData)
        }

        setTargetProduct(initialData.items[0]?.productId || "")
        setPrepTime(initialData.prepTime?.toString() || "")
        setDryingTime(initialData.dryingTime?.toString() || "")
        setSmokingTime(initialData.smokingTime?.toString() || "")
        setBoilingTime(initialData.boilingTime?.toString() || "")
        setInitialWeight(initialData.initialWeight?.toString() || "")
        setFinalWeight(initialData.finalWeight?.toString() || "")
        setNote(initialData.note?.replace(/\[RecipeID:.*?\]/, "").trim() || "")
    }
  }, [initialData, initialRecipes, initialMaterials]);

  useEffect(() => {
    if (selectedRecipeId && !editingId) {
      const recipe = initialRecipes.find(r => r.id === selectedRecipeId)
      if (recipe) {
        setMaterials(recipe.ingredients.map((i: any) => {
          const productInfo = initialMaterials.find(m => m.id === i.ingredientId)
          return {
            productId: i.ingredientId,
            name: i.ingredient.name,
            unit: i.ingredient.unit,
            recipeQuantity: Number(i.quantity),
            quantity: 0,
            pricePerUnit: i.ingredient.averagePurchasePrice,
            isMain: i.isMain,
            batches: productInfo?.batches || []
          }
        }))
      }
    }
  }, [selectedRecipeId, initialRecipes, editingId, initialMaterials]);

  // Update prices when batches are selected
  useEffect(() => {
    if (Object.keys(selectedBatches).length > 0) {
        setMaterials(prev => prev.map(m => {
            const batchId = selectedBatches[m.productId]
            if (batchId) {
                const batch = m.batches.find((b: any) => b.id === batchId)
                if (batch) {
                    return { ...m, pricePerUnit: batch.pricePerUnit }
                }
            }
            return m
        }))
    }
  }, [selectedBatches])

  useEffect(() => {
    if (meatBaseWeight && materials.length > 0 && !editingId) {
      const base = parseFloat(meatBaseWeight) || 0
      setMaterials(prev => prev.map(m => ({
        ...m,
        quantity: m.recipeQuantity * base
      })))
    }
  }, [meatBaseWeight, editingId, materials.length]);

  const calculatedInitialWeight = useMemo(() => materials.reduce((sum, m) => sum + (m.quantity || 0), 0), [materials])
  const totalCost = useMemo(() => materials.reduce((sum, m) => sum + (m.quantity * m.pricePerUnit), 0), [materials])
  const weightLoss = useMemo(() => {
    const initial = parseFloat(initialWeight) || calculatedInitialWeight
    const final = parseFloat(finalWeight) || 0
    return initial === 0 ? 0 : ((initial - final) / initial) * 100
  }, [initialWeight, calculatedInitialWeight, finalWeight])
  const costPerKg = useMemo(() => {
    const final = parseFloat(finalWeight) || 0
    return final === 0 ? 0 : totalCost / final
  }, [totalCost, finalWeight])
  const weightDifference = useMemo(() => (parseFloat(initialWeight) || calculatedInitialWeight) - (parseFloat(finalWeight) || 0), [initialWeight, calculatedInitialWeight, finalWeight])
  const selectedTargetProduct = useMemo(() => initialMaterials.find(p => p.id === targetProduct), [targetProduct, initialMaterials])
  const estimatedRevenue = useMemo(() => (parseFloat(finalWeight) || 0) * (Number(selectedTargetProduct?.sellingPrice) || 0), [finalWeight, selectedTargetProduct])
  const estimatedProfit = estimatedRevenue - totalCost

  const applyCalculatedWeight = () => setInitialWeight(calculatedInitialWeight.toFixed(3))

  const handleSubmit = async (status: ProductionStatus) => {
    if (!targetProduct || !selectedRecipeId || materials.length === 0) {
      toast.error("Заполните все обязательные поля")
      return
    }

    setIsLoading(true)
    try {
      const finalNote = selectedRecipeId ? `${note} [RecipeID:${selectedRecipeId}]` : note;
      
      // Strict weight logic: if empty string, use calculated. If has value, use parsed value.
      const actualInitialWeight = initialWeight.trim() === "" 
        ? calculatedInitialWeight 
        : parseFloat(initialWeight);

      const payload = {
        performedBy: userId,
        status,
        note: finalNote,
        items: [{
          productId: targetProduct,
          quantityProduced: parseFloat(finalWeight) || 0,
          calculatedCostPerUnit: costPerKg || (totalCost / (actualInitialWeight || 1))
        }],
        materials: materials.map(m => ({ 
            productId: m.productId, 
            quantityUsed: m.quantity,
            batchId: selectedBatches[m.productId] && selectedBatches[m.productId] !== "auto" ? selectedBatches[m.productId] : undefined
        })),
        initialWeight: actualInitialWeight,
        finalWeight: parseFloat(finalWeight) || 0,
        prepTime: parseInt(prepTime) || 0,
        dryingTime: parseInt(dryingTime) || 0,
        smokingTime: parseInt(smokingTime) || 0,
        boilingTime: parseInt(boilingTime) || 0,
        totalCost
      }

      if (editingId) {
        await updateProductionAction(editingId, payload)
      } else {
        await createProductionAction(payload)
      }

      toast.success(status === ProductionStatus.COMPLETED ? "Производство завершено" : "Данные сохранены")
      onSuccess(status)
    } catch (error) {
      toast.error("Ошибка при сохранении")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
      <Card className="lg:col-span-1 border-none shadow-none sm:border sm:shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Состав и Рецепт
          </CardTitle>
          <CardDescription>Выберите рецепт и укажите массу основы</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Что производим?</Label>
              <Select value={targetProduct} onValueChange={setTargetProduct} disabled={!!editingId}>
                <SelectTrigger className="h-12 border-primary/20 bg-background">
                  <SelectValue placeholder="Выберите готовый продукт" />
                </SelectTrigger>
                <SelectContent>
                  {initialMaterials.filter(p => p.category?.isFinished).map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Выберите Рецепт</Label>
              <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId} disabled={!!editingId}>
                <SelectTrigger className="h-12 border-primary/20 bg-background">
                  <SelectValue placeholder="Выберите рецепт" />
                </SelectTrigger>
                <SelectContent>
                  {initialRecipes.map((r: any) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRecipeId && (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                  <Label className="text-xs font-bold uppercase text-primary">Вес мясной основы (кг)</Label>
                  <Input 
                    type="number" inputMode="decimal" step="0.001"
                    className="h-12 text-xl font-bold border-primary/30"
                    value={meatBaseWeight} onChange={(e) => setMeatBaseWeight(e.target.value.replace(',', '.'))}
                    disabled={!!editingId}
                  />
                  {materials.filter(m => m.isMain).map(mainIngredient => (
                      <div className="pt-2" key={mainIngredient.productId}>
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground">Партия: {mainIngredient.name}</Label>
                          <Select 
                            value={selectedBatches[mainIngredient.productId] || "auto"} 
                            onValueChange={(val) => setSelectedBatches(prev => ({ ...prev, [mainIngredient.productId]: val }))}
                            disabled={!!editingId}
                          >
                            <SelectTrigger className="h-9 text-xs bg-background">
                                <SelectValue placeholder="Автоматически (FIFO)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="auto">Автоматически (Старая / Ср. цена)</SelectItem>
                                {mainIngredient.batches.map((b: any) => (
                                    <SelectItem key={b.id} value={b.id}>
                                        {formatDate(b.date)} | {b.supplier || "Склад"} | Остаток: {b.remainingQuantity}кг | {formatCurrency(b.pricePerUnit)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          {selectedBatches[mainIngredient.productId] && selectedBatches[mainIngredient.productId] !== "auto" && (
                              <p className="text-[10px] text-green-600 font-bold mt-1">
                                  Выбрана точная партия: {formatCurrency(mainIngredient.pricePerUnit)} за кг
                              </p>
                          )}
                      </div>
                  ))}
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="text-[10px] h-8">Ингредиент</TableHead>
                        <TableHead className="text-[10px] h-8 text-right">На 1кг</TableHead>
                        <TableHead className="text-[10px] h-8 text-right">Итого</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map((m) => (
                        <TableRow key={m.productId} className="h-10">
                          <TableCell className="text-[11px] py-1 font-medium">{m.name}</TableCell>
                          <TableCell className="text-[11px] py-1 text-right text-muted-foreground">{m.recipeQuantity.toFixed(3)}</TableCell>
                          <TableCell className="text-[11px] py-1 text-right font-bold">{m.quantity.toFixed(3)} {m.unit === "KG" ? "кг" : m.unit.toLowerCase()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t space-y-6">
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Вес сырого продукта (кг):</p>
                  <p className="text-3xl font-black text-primary leading-none">{calculatedInitialWeight.toFixed(3)} кг</p>
                </div>
                <Button size="sm" onClick={applyCalculatedWeight} disabled={calculatedInitialWeight === 0 || !!editingId} className="h-10 font-bold px-4">Верно</Button>
              </div>
              <div className="space-y-1.5 pt-3 border-t border-primary/10">
                <Label className="text-xs font-bold uppercase text-muted-foreground" htmlFor={`initialWeight-${editingId || 'new'}`}>
                  Фактический вес до готовки (кг)
                </Label>
                <Input 
                  id={`initialWeight-${editingId || 'new'}`}
                  name={`initialWeight-${editingId || 'new'}`}
                  type="number" 
                  inputMode="decimal" 
                  step="0.001" 
                  placeholder={calculatedInitialWeight > 0 ? calculatedInitialWeight.toFixed(3) : "0.000"}
                  autoComplete="off"
                  className="h-12 text-xl font-bold border-primary/30 bg-background"
                  value={initialWeight} 
                  onChange={(e) => setInitialWeight(e.target.value.replace(',', '.'))}
                  disabled={!!editingId}
                />
                <p className="text-[10px] text-muted-foreground leading-tight italic mt-1">
                  {initialWeight.trim() === "" && calculatedInitialWeight > 0 
                    ? `Будет использован расчетный вес: ${calculatedInitialWeight.toFixed(3)} кг` 
                    : "Взвесьте полный замес (мясо + все добавки) перед началом готовки."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1 border-none shadow-none sm:border sm:shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />Процесс приготовления</CardTitle>
          <CardDescription>Укажите время каждого этапа в минутах</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4">
            {["Подготовка", "Сушка", "Копчение", "Варка"].map((stage, i) => {
                const stateMap: any = { 0: [prepTime, setPrepTime], 1: [dryingTime, setDryingTime], 2: [smokingTime, setSmokingTime], 3: [boilingTime, setBoilingTime] };
                const [val, setVal] = stateMap[i];
                return (
                    <div key={stage} className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground">{stage} (мин)</Label>
                        <Input type="number" inputMode="numeric" placeholder="0" className="h-12" value={val} onChange={(e) => setVal(e.target.value)}/>
                    </div>
                )
            })}
          </div>
          <div className="space-y-2 pt-4">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Примечание</Label>
            <Input placeholder="Особенности партии..." className="h-12" value={note} onChange={(e) => setNote(e.target.value)}/>
          </div>
          <div className="pt-4 flex flex-col gap-3">
             <Button className="w-full h-12 text-base font-bold" variant="outline" disabled={isLoading} onClick={() => handleSubmit(ProductionStatus.IN_PROGRESS)}>
                <Play className="w-5 h-5 mr-2" /> {editingId ? "Сохранить изменения" : "Начать производство"}
             </Button>
             <Button className="w-full h-14 text-lg font-black shadow-lg shadow-primary/20" disabled={isLoading} onClick={() => handleSubmit(ProductionStatus.COMPLETED)}>
                <CheckCircle2 className="w-6 h-6 mr-2" /> Завершить и Списать
             </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1 border-none shadow-none sm:border sm:shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg flex items-center gap-2"><Weight className="w-5 h-5 text-primary" />Итоги и Вес</CardTitle>
          <CardDescription>Расчет себестоимости и выхода</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-4 sm:px-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Конечный вес (кг)</Label>
            <Input 
              type="number" inputMode="decimal" step="0.001" placeholder="0.000" 
              className="text-3xl font-black border-primary/50 h-16 bg-primary/5 text-center" 
              value={finalWeight} onChange={(e) => setFinalWeight(e.target.value.replace(',', '.'))}
            />
          </div>
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center p-4 rounded-xl bg-primary/5">
                <span className="text-sm font-medium">Общие затраты:</span>
                <span className="text-xl font-black text-primary">{formatCurrency(totalCost)}</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="p-4 rounded-xl bg-muted/50 flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-muted-foreground">Разница в весе:</span>
                <span className="text-sm font-black text-red-500">-{weightDifference.toFixed(3)} кг</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50 space-y-1">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-bold"><TrendingDown className="w-3 h-3" /> Усушка</div>
                    <div className="text-xl font-black text-red-500">{weightLoss.toFixed(1)}%</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 space-y-1">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-bold"><Receipt className="w-3 h-3" /> Себестоимость</div>
                    <div className="text-xl font-black truncate">{formatCurrency(costPerKg)}</div>
                </div>
            </div>
          </div>
          <div className="p-6 rounded-3xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center space-y-2 bg-gradient-to-b from-transparent to-primary/5">
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Процент выхода / Прибыль</p>
            <div className="flex items-baseline gap-2">
              <div className="text-5xl font-black text-primary tracking-tighter">{(100 - weightLoss).toFixed(1)}%</div>
              <div className="text-2xl font-bold text-green-600">/ +{formatCurrency(estimatedProfit)}</div>
            </div>
          </div>
          {parseFloat(finalWeight) > 0 && selectedTargetProduct && (
            <div className="mt-4 p-4 rounded-2xl bg-card border shadow-inner space-y-3 font-mono text-xs">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest border-b pb-2">Математика прибыли:</p>
              <div className="flex justify-between"><span>Выручка ({finalWeight}кг × {formatCurrency(Number(selectedTargetProduct.sellingPrice))})</span><span className="font-bold text-blue-600">{formatCurrency(estimatedRevenue)}</span></div>
              <div className="flex justify-between"><span>Затраты</span><span className="font-bold text-red-500">-{formatCurrency(totalCost)}</span></div>
              <div className="pt-2 border-t flex justify-between text-sm font-black"><span>Чистая прибыль</span><span className="text-green-600">{formatCurrency(estimatedProfit)}</span></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}