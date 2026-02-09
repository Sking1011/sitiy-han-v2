"use server"

import { SalesService } from "@/services/sales.service"
import { revalidatePath } from "next/cache"
import { serializeEntity } from "@/lib/utils"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createSaleAction(data: {
  customer?: string;
  items: {
    productId: string;
    quantity: number;
    pricePerUnit: number;
  }[];
}) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id

    const result = await SalesService.createSale({
      ...data,
      userId
    })
    revalidatePath("/inventory")
    revalidatePath("/dashboard")
    revalidatePath("/sales")
    revalidatePath("/accounting")
    return { success: true, data: serializeEntity(result) }
  } catch (error: any) {
    return { success: false, error: error.message || "Произошла ошибка при регистрации продажи" }
  }
}
