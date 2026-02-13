"use server"

import { InventoryService } from "@/services/inventory.service"
import { revalidatePath } from "next/cache"
import { CategoryType, Unit } from "@prisma/client"
import { serializeEntity } from "@/lib/utils"

// --- Category Actions ---

export async function getCategoriesAction(type?: CategoryType) {
  const categories = await InventoryService.getCategories(type)
  return serializeEntity(categories)
}

export async function createCategoryAction(data: {
  name: string
  type: CategoryType
  color?: string
  parentId?: string
  isFinished?: boolean
}) {
  const category = await InventoryService.createCategory(data)
  revalidatePath("/inventory")
  revalidatePath("/inventory/categories")
  return serializeEntity(category)
}

export async function updateCategoryAction(
  id: string,
  data: { name?: string; color?: string; parentId?: string; isFinished?: boolean }
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
  sellingPrice?: number
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
    sellingPrice: number
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

export async function getProductHistoryAction(productId: string, batchId?: string) {
  const history = await InventoryService.getProductHistory(productId, batchId)
  return serializeEntity(history)
}

export async function searchProductsAction(query: string) {
  const products = await InventoryService.getProducts({ search: query })
  return serializeEntity(products)
}

export async function createDisposalAction(data: {
  productId: string
  quantity: number
  reason?: string
  userId: string
  batchId?: string
}) {
  const disposal = await InventoryService.createDisposal(data)
  revalidatePath("/inventory")
  return serializeEntity(disposal)
}

export async function getBatchesAction(productId: string) {
  const batches = await InventoryService.getBatches(productId)
  return serializeEntity(batches)
}

export async function getBatchesByCategoryAction(categoryId: string) {
  const batches = await InventoryService.getBatchesByCategory(categoryId)
  return serializeEntity(batches)
}

export async function mergeBatchesAction(data: {
  productId: string
  sourceBatchId: string
  targetBatchId: string
  userId: string
  quantity?: number
}) {
  const result = await InventoryService.mergeBatches(data)
  revalidatePath("/inventory")
  return serializeEntity(result)
}