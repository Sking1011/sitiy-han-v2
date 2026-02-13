"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
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
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Wallet, 
  Truck,
  AlertCircle
} from "lucide-react"
import { PaymentSource } from "@prisma/client"
import { createBulkProcurementAction } from "@/app/actions/procurement.actions"
import { formatCurrency } from "@/lib/formatters"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ProcurementClientProps {
  products: any[]
  userId: string
}

export function ProcurementClient({ products, userId }: ProcurementClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [supplier, setSupplier] = useState("")
  const [paymentSource, setPaymentSource] = useState<PaymentSource>(PaymentSource.BUSINESS_CASH)
  
  const [items, setItems] = useState<any[]>([
    { productId: "", quantity: "", pricePerUnit: "" }
  ])

  const addItem = () => {
    setItems([...items, { productId: "", quantity: "", pricePerUnit: "" }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    } else {
      setItems([{ productId: "", quantity: "", pricePerUnit: "" }])
    }
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      const q = parseFloat(item.quantity) || 0
      const p = parseFloat(item.pricePerUnit) || 0
      return sum + (q * p)
    }, 0)
  }, [items])

  const handleSubmit = async () => {
    const validItems = items.filter(i => i.productId && parseFloat(i.quantity) > 0 && parseFloat(i.pricePerUnit) >= 0)
    
    if (validItems.length === 0) {
      toast.error("Добавьте хотя бы один товар с корректными данными")
      return
    }

    setIsLoading(true)
    try {
      await createBulkProcurementAction({
        userId,
        supplier,
        paymentSource,
        items: validItems.map(i => ({
          productId: i.productId,
          quantity: parseFloat(i.quantity),
          pricePerUnit: parseFloat(i.pricePerUnit)
        }))
      })
      
      toast.success("Закупка успешно оформлена")
      setItems([{ productId: "", quantity: "", pricePerUnit: "" }])
      setSupplier("")
      router.refresh()
    } catch (error) {
      toast.error("Ошибка при оформлении закупки")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Card className="border-none shadow-none sm:border sm:shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                    Новая закупка
                  </CardTitle>
                  <CardDescription>Добавьте товары в список закупа</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addItem} className="h-9 font-bold">
                  <Plus className="w-4 h-4 mr-1" /> Добавить товар
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Товар</TableHead>
                      <TableHead>Остаток</TableHead>
                      <TableHead>Кол-во</TableHead>
                      <TableHead>Цена/ед</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => {
                      const product = products.find(p => p.id === item.productId)
                      const subtotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.pricePerUnit) || 0)
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Select 
                              value={item.productId} 
                              onValueChange={(val) => updateItem(index, "productId", val)}
                            >
                              <SelectTrigger className="h-10 bg-background border-primary/20">
                                <SelectValue placeholder="Выберите товар" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((p: any) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.name} ({p.unit})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {product ? (
                              <Badge variant={Number(product.currentStock) <= Number(product.minStock) ? "destructive" : "secondary"}>
                                {Number(product.currentStock)} {product.unit}
                              </Badge>
                            ) : "-"}
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              inputMode="decimal"
                              step="0.001"
                              placeholder="0.000"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, "quantity", e.target.value)}
                              className="h-10 w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              inputMode="decimal"
                              step="0.01"
                              placeholder="0"
                              value={item.pricePerUnit}
                              onChange={(e) => updateItem(index, "pricePerUnit", e.target.value)}
                              className="h-10 w-24"
                            />
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(subtotal)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeItem(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4 px-2">
                {items.map((item, index) => {
                  const product = products.find(p => p.id === item.productId)
                  const subtotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.pricePerUnit) || 0)

                  return (
                    <Card key={index} className="p-4 relative border-primary/10">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 text-muted-foreground"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Товар</Label>
                          <Select 
                            value={item.productId} 
                            onValueChange={(val) => updateItem(index, "productId", val)}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Выберите товар" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p: any) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {product && (
                             <div className="flex items-center gap-2 mt-1">
                               <span className="text-[10px] text-muted-foreground">На складе:</span>
                               <Badge className="h-4 text-[9px] px-1" variant={Number(product.currentStock) <= Number(product.minStock) ? "destructive" : "outline"}>
                                 {Number(product.currentStock)} {product.unit}
                               </Badge>
                             </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Кол-во</Label>
                            <Input 
                              type="number" 
                              inputMode="decimal"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, "quantity", e.target.value)}
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Цена/ед</Label>
                            <Input 
                              type="number" 
                              inputMode="decimal"
                              value={item.pricePerUnit}
                              onChange={(e) => updateItem(index, "pricePerUnit", e.target.value)}
                              className="h-11"
                            />
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Подытог:</span>
                          <span className="font-bold text-primary">{formatCurrency(subtotal)}</span>
                        </div>
                      </div>
                    </Card>
                  )
                })}
                <Button variant="outline" className="w-full h-12 border-dashed border-2" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" /> Добавить еще
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <Card className="border-none shadow-none sm:border sm:shadow-sm sticky top-6">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Детали поставки
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supplier" className="text-xs font-bold uppercase text-muted-foreground">Поставщик / Магазин</Label>
                <Input 
                  id="supplier"
                  placeholder="Название..." 
                  className="h-11"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Источник оплаты</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant={paymentSource === PaymentSource.BUSINESS_CASH ? "default" : "outline"}
                    className={cn(
                      "h-11 justify-start font-medium px-4",
                      paymentSource === PaymentSource.BUSINESS_CASH && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    )}
                    onClick={() => setPaymentSource(PaymentSource.BUSINESS_CASH)}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Бизнес-счет
                  </Button>
                  <Button 
                    variant={paymentSource === PaymentSource.PERSONAL_FUNDS ? "default" : "outline"}
                    className={cn(
                      "h-11 justify-start font-medium px-4",
                      paymentSource === PaymentSource.PERSONAL_FUNDS && "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                    )}
                    onClick={() => setPaymentSource(PaymentSource.PERSONAL_FUNDS)}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Личные средства
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-muted-foreground">ИТОГО К ОПЛАТЕ:</span>
                  <span className="text-2xl font-black text-primary">{formatCurrency(totalAmount)}</span>
                </div>
                
                <Button 
                  className="w-full h-14 text-lg font-black shadow-lg shadow-primary/20"
                  disabled={isLoading || totalAmount === 0}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Оформление..." : "Оплатить и Принять"}
                </Button>
              </div>

              {totalAmount > 100000 && (
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                  <p className="text-[10px] text-yellow-700 font-medium">
                    Внимание: Сумма закупки превышает 100 000 KZT. Проверьте правильность введенных данных.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
