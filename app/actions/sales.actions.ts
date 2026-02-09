"use server"

import { SalesService } from "@/services/sales.service"
import { revalidatePath } from "next/cache"
import { serializeEntity } from "@/lib/utils"

export async function createSaleAction(data: {
  customer?: string;
  items: {
    productId: string;
    quantity: number;
    pricePerUnit: number;
  }[];
}) {
  try {
    const result = await SalesService.createSale(data)
    revalidatePath("/inventory")
    revalidatePath("/dashboard")
    revalidatePath("/sales")
    return { success: true, data: serializeEntity(result) }
  } catch (error: any) {
    return { success: false, error: error.message || "Произошла ошибка при регистрации продажи" }
  }
}
