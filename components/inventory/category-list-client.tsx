"use client"

import { useState } from "react"
import { Category, CategoryType } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings2 } from "lucide-react"
import { CategoryDialog } from "./category-dialog"

interface CategoryListClientProps {
  categories: (Category & { _count: { products: number } })[]
}

export function CategoryListClient({ categories }: CategoryListClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Добавить
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {cat.type === CategoryType.STOCK ? "Складская" : "Расходная"}
              </CardTitle>
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: cat.color || "#ccc" }}
              />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">{cat.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cat._count.products} товаров
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CategoryDialog
        category={selectedCategory}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}
