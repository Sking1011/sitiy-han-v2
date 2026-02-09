"use server"

import { ProcurementService } from "@/services/procurement.service"
import { revalidatePath } from "next/cache"
import { PaymentSource } from "@prisma/client"
import { serializeEntity } from "@/lib/utils"

export async function createProcurementAction(data: {
  supplier?: string;
  paymentSource: PaymentSource;
  items: {
    productId: string;
    quantity: number;
    pricePerUnit: number;
  }[];
}) {
  const result = await ProcurementService.createProcurement(data)
  revalidatePath("/inventory")
  revalidatePath("/dashboard")
  revalidatePath("/procurement")
  return serializeEntity(result)
}
