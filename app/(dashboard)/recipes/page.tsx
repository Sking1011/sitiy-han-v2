import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getRecipesAction, getProductsForRecipesAction } from "@/app/actions/recipes.actions"
import { RecipeList } from "@/components/recipes/recipe-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { RecipeDialogWrapper } from "@/components/recipes/recipe-dialog-wrapper"
import { Role } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function RecipesPage() {
  const session = await getServerSession(authOptions)
  const recipes = await getRecipesAction()
  const products = await getProductsForRecipesAction()

  const canEdit = session?.user?.role === Role.ADMIN || session?.user?.role === Role.DIRECTOR

  return (
    <div className="container mx-auto py-6 space-y-6 pb-32 lg:pb-10">
      <div className="flex justify-between items-center px-4 md:px-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Рецепты</h1>
          <p className="text-muted-foreground">
            Управление рецептурами и калькуляция на 1 кг продукции
          </p>
        </div>
        {canEdit && (
          <RecipeDialogWrapper products={products} />
        )}
      </div>

      {recipes.length > 0 ? (
        <RecipeList recipes={recipes} products={products} canEdit={canEdit} />
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium">Рецептов пока нет</h3>
          <p className="text-muted-foreground">Создайте свой первый рецепт, чтобы начать учет производства</p>
        </div>
      )}
    </div>
  )
}