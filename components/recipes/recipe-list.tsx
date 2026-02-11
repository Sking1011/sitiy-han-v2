"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import { RecipeDialog } from "./recipe-dialog"
import { useState } from "react"
import { deleteRecipeAction } from "@/app/actions/recipes.actions"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface RecipeListProps {
  recipes: any[]
  products: any[]
  canEdit: boolean
}

export function RecipeList({ recipes, products, canEdit }: RecipeListProps) {
  const [editingRecipe, setEditingRecipe] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = async (id: string) => {
    try {
      await deleteRecipeAction(id)
      toast.success("Рецепт удален")
    } catch (error) {
      toast.error("Ошибка при удалении рецепта")
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Card key={recipe.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{recipe.name}</CardTitle>
              {canEdit && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingRecipe(recipe)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить рецепт?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Рецепт "{recipe.name}" будет удален.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(recipe.id)} className="bg-destructive text-destructive-foreground">
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Мясная основа (на 1 кг):</h4>
                <div className="space-y-1">
                  {recipe.ingredients
                    .filter((i: any) => i.isMain)
                    .map((i: any) => (
                      <div key={i.id} className="flex justify-between text-sm">
                        <span>{i.ingredient.name}</span>
                        <span className="font-medium">{(i.quantity * 1000).toFixed(0)} г</span>
                      </div>
                    ))}
                </div>
              </div>
              
              {recipe.ingredients.some((i: any) => !i.isMain) && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-blue-600 dark:text-blue-400">Специи и добавки:</h4>
                  <div className="space-y-1">
                    {recipe.ingredients
                      .filter((i: any) => !i.isMain)
                      .map((i: any) => (
                        <div key={i.id} className="flex justify-between text-sm">
                          <span>{i.ingredient.name}</span>
                          <span className="font-medium">{(i.quantity * 1000).toFixed(1)} г</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {recipe.description && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground italic line-clamp-2">
                    {recipe.description}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {canEdit && (
        <RecipeDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          recipe={editingRecipe}
          products={products}
          onSuccess={() => {
            setEditingRecipe(null)
            setIsDialogOpen(false)
          }}
        />
      )}
    </div>
  )
}