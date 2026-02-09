"use server"

import { ProcurementService } from "@/services/procurement.service"
import { revalidatePath } from "next/cache"
import { PaymentSource } from "@prisma/client"
import { serializeEntity } from "@/lib/utils"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createProcurementAction(data: {
  supplier?: string;
  paymentSource: PaymentSource;
  items: {
    productId: string;
    quantity: number;
    pricePerUnit: number;
  }[];
}) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  const result = await ProcurementService.createProcurement({
    ...data,
    userId
  })
  revalidatePath("/inventory")
  revalidatePath("/dashboard")
  revalidatePath("/procurement")
  revalidatePath("/accounting")
  return serializeEntity(result)
}
