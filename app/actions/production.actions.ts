"use server"

import { ProductionService } from "@/services/production.service"
import { revalidatePath } from "next/cache"
import { ProductionStatus } from "@prisma/client"
import { serializeEntity } from "@/lib/utils"

export async function getProductionInitialData() {
  const [materials, recipes] = await Promise.all([
    ProductionService.getProductionMaterials(),
    ProductionService.getRecipes(),
  ])

  return {
    materials: serializeEntity(materials),
    recipes: serializeEntity(recipes),
  }
}

export async function createProductionAction(data: {
  performedBy: string;
  items: { productId: string; quantityProduced: number; calculatedCostPerUnit: number }[];
  materials: { productId: string; quantityUsed: number; batchId?: string }[];
  initialWeight?: number;
  finalWeight?: number;
  prepTime?: number;
  dryingTime?: number;
  smokingTime?: number;
  boilingTime?: number;
  totalCost?: number;
  status?: ProductionStatus;
  note?: string;
}) {
  const production = await ProductionService.createProduction(data)
  revalidatePath("/production")
  revalidatePath("/inventory")
  return serializeEntity(production)
}

export async function updateProductionAction(id: string, data: {
  status?: ProductionStatus;
  note?: string;
  finalWeight?: number;
  prepTime?: number;
  dryingTime?: number;
  smokingTime?: number;
  boilingTime?: number;
  totalCost?: number;
  items?: { productId: string; quantityProduced: number; calculatedCostPerUnit: number }[];
}) {
  const production = await ProductionService.updateProduction(id, data)
  revalidatePath("/production")
  revalidatePath("/inventory")
  return serializeEntity(production)
}

export async function getProductionHistoryAction() {
  const history = await ProductionService.getProductionHistory()
  return serializeEntity(history)
}
