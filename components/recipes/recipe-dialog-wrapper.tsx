"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { RecipeDialog } from "./recipe-dialog"

interface RecipeDialogWrapperProps {
  products: any[]
}

export function RecipeDialogWrapper({ products }: RecipeDialogWrapperProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Добавить рецепт
      </Button>
      <RecipeDialog 
        open={open} 
        onOpenChange={setOpen} 
        products={products} 
        onSuccess={() => setOpen(false)} 
      />
    </>
  )
}
