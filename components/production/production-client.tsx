"use client"

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
  Plus, 
  Trash2, 
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

interface ProductionClientProps {
  initialMaterials: any[]
  initialRecipes: any[]
  history: any[]
  userId: string
}

export function ProductionClient({ 
  initialMaterials, 
  initialRecipes, 
  history: initialHistory,
  userId 
}: ProductionClientProps) {
  const [activeTab, setActiveTab] = useState("new")
  const [history, setHistory] = useState(initialHistory)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Helper to identify spices
  const isSpiceProduct = (productId: string) => {
    const p = initialMaterials.find(m => m.id === productId);
    const catName = p?.category?.name?.toLowerCase() || "";
    return catName.includes("специи") || catName.includes("специя") || catName.includes("маринад");
  }

  // Form State
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("")
  const [materials, setMaterials] = useState<any[]>([])
  const [targetProduct, setTargetProduct] = useState<string>("")
  
  // Timing State
  const [prepTime, setPrepTime] = useState<string>("")
  const [dryingTime, setDryingTime] = useState<string>("")
  const [smokingTime, setSmokingTime] = useState<string>("")
  const [boilingTime, setBoilingTime] = useState<string>("")
  
  // Weight State
  const [initialWeight, setInitialWeight] = useState<string>("")
  const [finalWeight, setFinalWeight] = useState<string>("")
  
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load recipe
  useEffect(() => {
    if (selectedRecipeId && !editingId) {
      const recipe = initialRecipes.find(r => r.id === selectedRecipeId)
      if (recipe) {
        setTargetProduct(recipe.productId)
        
        // Add all ingredients from recipe
        setMaterials(recipe.ingredients.map((i: any) => ({
          productId: i.ingredientId,
          name: i.ingredient.name,
          unit: i.ingredient.unit,
          quantity: 0, // Manual entry for now, as requested
          pricePerUnit: i.ingredient.averagePurchasePrice
        })))
      }
    }
  }, [selectedRecipeId, initialRecipes, editingId]);

  // Calculations
  const calculatedInitialWeight = useMemo(() => {
    return materials.reduce((sum, m) => sum + (m.quantity || 0), 0)
  }, [materials])

  const totalCost = useMemo(() => {
    return materials.reduce((sum, m) => sum + (m.quantity * m.pricePerUnit), 0)
  }, [materials])

  const weightLoss = useMemo(() => {
    const initial = parseFloat(initialWeight) || 0
    const final = parseFloat(finalWeight) || 0
    if (initial === 0) return 0
    return ((initial - final) / initial) * 100
  }, [initialWeight, finalWeight])

  const costPerKg = useMemo(() => {
    const final = parseFloat(finalWeight) || 0
    if (final === 0) return 0
    return totalCost / final
  }, [totalCost, finalWeight])

  const addMaterial = (productId: string) => {
    const product = initialMaterials.find(m => m.id === productId)
    if (product && !materials.find(m => m.productId === productId)) {
      setMaterials(prev => [...prev, {
        productId: product.id,
        name: product.name,
        unit: product.unit,
        quantity: 0,
        pricePerUnit: product.averagePurchasePrice
      }]);
    }
  }

  const removeMaterial = (productId: string) => {
    setMaterials(prev => prev.filter(m => m.productId !== productId))
  }

  const updateMaterialQuantity = (productId: string, quantity: string) => {
    const isSpice = isSpiceProduct(productId);
    const numValue = parseFloat(quantity) || 0;
    const finalQuantity = isSpice ? numValue / 1000 : numValue;
    
    setMaterials(prev => prev.map(m => 
      m.productId === productId ? { ...m, quantity: finalQuantity } : m
    ));
  }

  const applyCalculatedWeight = () => setInitialWeight(calculatedInitialWeight.toFixed(3))

  const resetForm = () => {
    setEditingId(null)
    setSelectedRecipeId("")
    setMaterials([])
    setTargetProduct("")
    setPrepTime("")
    setDryingTime("")
    setSmokingTime("")
    setBoilingTime("")
    setInitialWeight("")
    setFinalWeight("")
    setNote("")
  }

  const handleEdit = (prod: any) => {
    setEditingId(prod.id)
    setMaterials(prod.materials.map((m: any) => ({
      productId: m.productId,
      name: m.product.name,
      unit: m.product.unit,
      quantity: Number(m.quantityUsed),
      pricePerUnit: Number(m.product.averagePurchasePrice)
    })))
    setTargetProduct(prod.items[0]?.productId || "")
    setPrepTime(prod.prepTime?.toString() || "")
    setDryingTime(prod.dryingTime?.toString() || "")
    setSmokingTime(prod.smokingTime?.toString() || "")
    setBoilingTime(prod.boilingTime?.toString() || "")
    setInitialWeight(prod.initialWeight?.toString() || "")
    setFinalWeight(prod.finalWeight?.toString() || "")
    setNote(prod.note || "")
    setActiveTab("new")
  }

  const handleSubmit = async (status: ProductionStatus) => {
    if (!targetProduct && !selectedRecipeId) {
      toast.error("Выберите рецепт")
      return
    }
    if (materials.length === 0) {
      toast.error("Добавьте ингредиенты")
      return
    }

    setIsLoading(true)
    try {
      const payload: any = {
        performedBy: userId,
        status,
        note,
        items: [{
          productId: targetProduct,
          quantityProduced: parseFloat(finalWeight) || 0,
          calculatedCostPerUnit: costPerKg || (totalCost / (parseFloat(initialWeight) || 1))
        }],
        materials: materials.map(m => ({
          productId: m.productId,
          quantityUsed: m.quantity
        })),
        initialWeight: parseFloat(initialWeight) || 0,
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

      toast.success(status === ProductionStatus.COMPLETED ? "Производство завершено" : "Сохранено")
      resetForm()
      window.location.reload() 
    } catch (error) {
      toast.error("Ошибка при сохранении")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
        <TabsTrigger value="new">{editingId ? "Редактирование" : "Новое производство"}</TabsTrigger>
        <TabsTrigger value="history">История</TabsTrigger>
      </TabsList>

      <TabsContent value="new" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-none shadow-none sm:border sm:shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Состав и Рецепт
              </CardTitle>
              <CardDescription>Выберите рецепт и укажите массу ингредиентов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="space-y-2">
                <Label>Выберите Рецепт</Label>
                <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId} disabled={!!editingId}>
                  <SelectTrigger className="h-12 border-primary/20 bg-background">
                    <SelectValue placeholder="Выберите рецепт производства" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialRecipes.map((r: any) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t space-y-6">
                {selectedRecipeId && (
                  <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Информация о рецепте</p>
                    <p className="text-sm">Ингредиенты будут списаны автоматически согласно технологической карте.</p>
                    {materials.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {materials.map(m => (
                                <span key={m.productId} className="text-[10px] bg-background px-2 py-0.5 rounded border border-border">
                                    {m.name}
                                </span>
                            ))}
                        </div>
                    )}
                  </div>
                )}

                <div className="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Расчетная масса:</p>
                      <p className="text-3xl font-black text-primary leading-none">{calculatedInitialWeight.toFixed(3)} кг</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={applyCalculatedWeight}
                      disabled={calculatedInitialWeight === 0 || !!editingId}
                      className="h-10 font-bold px-4"
                    >
                      Верно
                    </Button>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-primary/10">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Фактическая начальная масса (кг)</Label>
                    <Input 
                      type="number" 
                      inputMode="decimal"
                      step="0.001" 
                      placeholder="0.000"
                      className="h-12 text-xl font-bold border-primary/30 bg-background"
                      value={initialWeight}
                      onChange={(e) => setInitialWeight(e.target.value.replace(',', '.'))}
                      disabled={!!editingId}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card className="lg:col-span-1 border-none shadow-none sm:border sm:shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Процесс приготовления
              </CardTitle>
              <CardDescription>Время этапов в минутах</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Подготовка</Label>
                  <Input type="number" inputMode="numeric" placeholder="мин" className="h-12" value={prepTime} onChange={(e) => setPrepTime(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Сушка</Label>
                  <Input type="number" inputMode="numeric" placeholder="мин" className="h-12" value={dryingTime} onChange={(e) => setDryingTime(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Копчение</Label>
                  <Input type="number" inputMode="numeric" placeholder="мин" className="h-12" value={smokingTime} onChange={(e) => setSmokingTime(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Варка</Label>
                  <Input type="number" inputMode="numeric" placeholder="мин" className="h-12" value={boilingTime} onChange={(e) => setBoilingTime(e.target.value)}/>
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Примечание</Label>
                <Input placeholder="Особенности партии..." className="h-12" value={note} onChange={(e) => setNote(e.target.value)}/>
              </div>
              <div className="pt-4 flex flex-col gap-3">
                 {(!editingId || (editingId && history.find(p => p.id === editingId)?.status === "IN_PROGRESS")) && (
                    <Button className="w-full h-12 text-base font-bold" variant="outline" disabled={isLoading} onClick={() => handleSubmit(ProductionStatus.IN_PROGRESS)}>
                        <Play className="w-5 h-5 mr-2" /> {editingId ? "Сохранить изменения" : "Начать производство"}
                    </Button>
                 )}
                 <Button className="w-full h-14 text-lg font-black shadow-lg shadow-primary/20" disabled={isLoading} onClick={() => handleSubmit(ProductionStatus.COMPLETED)}>
                    <CheckCircle2 className="w-6 h-6 mr-2" /> Завершить и Списать
                 </Button>
                 <Button variant="ghost" className="w-full text-xs text-muted-foreground h-10" onClick={resetForm}>
                    <RotateCcw className="w-3 h-3 mr-1" /> Сбросить данные
                 </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 border-none shadow-none sm:border sm:shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Weight className="w-5 h-5 text-primary" />
                Итоги и Вес
              </CardTitle>
              <CardDescription>Расчет себестоимости и выхода</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-4 sm:px-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Конечный вес (кг)</Label>
                <Input 
                  type="number" 
                  inputMode="decimal"
                  step="0.001" 
                  placeholder="0.000" 
                  className="text-3xl font-black border-primary/50 h-16 bg-primary/5 text-center" 
                  value={finalWeight} 
                  onChange={(e) => setFinalWeight(e.target.value.replace(',', '.'))}
                />
              </div>
              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center p-4 rounded-xl bg-primary/5">
                    <span className="text-sm font-medium">Общие затраты:</span>
                    <span className="text-xl font-black text-primary">{formatCurrency(totalCost)}</span>
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
              <div className="p-8 rounded-3xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center space-y-2 bg-gradient-to-b from-transparent to-primary/5">
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Процент выхода</p>
                <div className="text-6xl font-black text-primary tracking-tighter">{initialWeight && finalWeight ? (100 - weightLoss).toFixed(1) : 0}%</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <Card className="border-none shadow-none sm:border sm:shadow-sm">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>История производства</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {/* Desktop Table */}
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
                    {history.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs">{formatDate(p.date)}<p className="text-[10px] text-muted-foreground">{p.performer.name}</p></TableCell>
                        <TableCell><span className="font-medium">{p.items[0]?.product.name || "N/A"}</span></TableCell>
                        <TableCell className="text-xs">{p.initialWeight}кг / {p.finalWeight}кг<p className="text-destructive">{p.initialWeight > 0 ? `-${((p.initialWeight - p.finalWeight) / p.initialWeight * 100).toFixed(1)}%` : "0%"}</p></TableCell>
                        <TableCell>{formatCurrency(p.totalCost)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(p.items[0]?.calculatedCostPerUnit)}/кг</TableCell>
                        <TableCell><Badge variant={p.status === "COMPLETED" ? "default" : "secondary"}>{p.status === "COMPLETED" ? "Готово" : "В процессе"}</Badge></TableCell>
                        <TableCell>{p.status === "IN_PROGRESS" && (<Button size="sm" variant="ghost" onClick={() => handleEdit(p)}>Продолжить</Button>)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {history.map((p) => (
                <Card key={p.id} className="overflow-hidden border-primary/10">
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
                        <p className="text-[8px] uppercase text-muted-foreground font-bold">Вес (Нач/Кон)</p>
                        <p className="text-xs font-bold">{p.initialWeight}кг / {p.finalWeight}кг</p>
                      </div>
                      <div className="bg-background p-2 rounded border border-border">
                        <p className="text-[8px] uppercase text-muted-foreground font-bold">Усушка</p>
                        <p className="text-xs font-bold text-red-500">
                          -{p.initialWeight > 0 ? ((p.initialWeight - p.finalWeight) / p.initialWeight * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                    {p.status === "IN_PROGRESS" && (
                      <Button className="w-full mt-2 h-10" variant="outline" onClick={() => handleEdit(p)}>
                        Продолжить производство
                      </Button>
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