"use server"

import { InventoryService } from "@/services/inventory.service"
import { revalidatePath } from "next/cache"
import { CategoryType, Unit } from "@prisma/client"
import { serializeEntity } from "@/lib/utils"

// --- Category Actions ---

export async function createCategoryAction(data: {
  name: string
  type: CategoryType
  color?: string
  parentId?: string
}) {
  const category = await InventoryService.createCategory(data)
  revalidatePath("/inventory")
  revalidatePath("/inventory/categories")
  return serializeEntity(category)
}

export async function updateCategoryAction(
  id: string,
  data: { name?: string; color?: string; parentId?: string }
) {
  const category = await InventoryService.updateCategory(id, data)
  revalidatePath("/inventory")
  revalidatePath("/inventory/categories")
  return serializeEntity(category)
}

export async function deleteCategoryAction(id: string) {
  await InventoryService.deleteCategory(id)
  revalidatePath("/inventory")
  revalidatePath("/inventory/categories")
}

// --- Product Actions ---

export async function createProductAction(data: {
  name: string
  categoryId: string
  unit: Unit
  minStock?: number
  image?: string
}) {
  const product = await InventoryService.createProduct(data)
  revalidatePath("/inventory")
  return serializeEntity(product)
}

export async function updateProductAction(
  id: string,
  data: Partial<{
    name: string
    categoryId: string
    unit: Unit
    minStock: number
    currentStock: number
    averagePurchasePrice: number
    image: string
  }>
) {
  const product = await InventoryService.updateProduct(id, data)
  revalidatePath("/inventory")
  return serializeEntity(product)
}

export async function deleteProductAction(id: string) {
  await InventoryService.deleteProduct(id)
  revalidatePath("/inventory")
}

export async function getProductHistoryAction(productId: string) {
  const history = await InventoryService.getProductHistory(productId)
  return serializeEntity(history)
}

export async function searchProductsAction(query: string) {
  const products = await InventoryService.getProducts({ search: query })
  return serializeEntity(products)
}