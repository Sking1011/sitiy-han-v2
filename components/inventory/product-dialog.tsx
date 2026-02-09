"use client"

import { Product, Category } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ProductForm } from "./product-form"

interface ProductDialogProps {
  product: Product | null
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDialog({ product, categories, open, onOpenChange }: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? `Редактирование: ${product.name}` : "Новый товар"}
          </DialogTitle>
          <DialogDescription>
            Измените параметры товара и нажмите сохранить.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <ProductForm 
                product={product} 
                categories={categories} 
                // Передаем callback для закрытия после успеха
                onSuccess={() => onOpenChange(false)}
            />
        </div>
      </DialogContent>
    </Dialog>
  )
}
