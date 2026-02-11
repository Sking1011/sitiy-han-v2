"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, Table as TableIcon, ShoppingCart, TrendingUp, BookOpen, Loader2 } from "lucide-react"
import { exportToExcel } from "@/lib/excel-export"
import { getProcurementExportData, getSalesExportData, getProductsExportData } from "@/app/actions/export.actions"

export function ExportData() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleExport = async (type: string) => {
    setLoading(type)
    try {
      let data: any[] = []
      let fileName = ""
      
      switch (type) {
        case "Закупки":
          data = await getProcurementExportData()
          fileName = "zakupki"
          break
        case "Продажи":
          data = await getSalesExportData()
          fileName = "prodazhi"
          break
        case "Меню (Розница)":
        case "Меню (Опт)":
          data = await getProductsExportData()
          fileName = "price_list"
          break
        default:
          return
      }

      if (data.length > 0) {
        exportToExcel(data, fileName, type)
      } else {
        alert("Нет данных для выгрузки")
      }
    } catch (error) {
      console.error("Export failed:", error)
      alert("Ошибка при выгрузке данных")
    } finally {
      setLoading(null)
    }
  }

  const exportOptions = [
    { id: "Закупки", name: "Закупки", description: "История всех закупок сырья и материалов", icon: ShoppingCart },
    { id: "Продажи", name: "Продажи", description: "Данные о продажах за весь период", icon: TrendingUp },
    { id: "Меню (Розница)", name: "Меню (Розница)", description: "Актуальный прайс-лист для розничных клиентов", icon: FileDown },
    { id: "Меню (Опт)", name: "Меню (Опт)", description: "Оптовый прайс-лист и условия", icon: TableIcon },
    { id: "Рецептуры", name: "Рецептуры", description: "Технологические карты и калькуляции", icon: BookOpen },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-20 md:pb-0">
      {exportOptions.map((option) => (
        <Card key={option.id} className="flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <option.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">{option.name}</CardTitle>
            </div>
            <CardDescription className="mt-2">{option.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              className="w-full h-12 md:h-10 text-base md:text-sm font-medium transition-all active:scale-95" 
              variant="outline" 
              onClick={() => handleExport(option.id)}
              disabled={loading === option.id}
            >
              {loading === option.id ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <FileDown className="mr-2 h-5 w-5 md:h-4 md:w-4" />
              )}
              {loading === option.id ? "Выгрузка..." : "Выгрузить .xlsx"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
