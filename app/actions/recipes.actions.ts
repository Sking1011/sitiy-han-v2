"use server"

import { RecipesService } from "@/services/recipes.service"
import { revalidatePath } from "next/cache"
import { serializeEntity } from "@/lib/utils"

export async function getRecipesAction() {
  const recipes = await RecipesService.getRecipes()
  return serializeEntity(recipes)
}

export async function getProductsForRecipesAction() {
  const products = await RecipesService.getProductsForRecipes()
  return serializeEntity(products)
}

export async function createRecipeAction(data: {
  name: string;
  description?: string;
  ingredients: {
    ingredientId: string;
    quantity: number;
    isMain: boolean;
  }[];
}) {
  const recipe = await RecipesService.createRecipe(data)
  revalidatePath("/recipes")
  revalidatePath("/production")
  return serializeEntity(recipe)
}

export async function updateRecipeAction(id: string, data: {
  name?: string;
  description?: string;
  ingredients?: {
    ingredientId: string;
    quantity: number;
    isMain: boolean;
  }[];
}) {
  const recipe = await RecipesService.updateRecipe(id, data)
  revalidatePath("/recipes")
  revalidatePath("/production")
  return serializeEntity(recipe)
}

export async function deleteRecipeAction(id: string) {
  await RecipesService.deleteRecipe(id)
  revalidatePath("/recipes")
  revalidatePath("/production")
}