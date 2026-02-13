"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { PaymentSource, ProcurementStatus } from "@prisma/client"
import { serializeEntity } from "@/lib/utils"

export async function createBulkProcurementAction(data: {
  userId: string
  supplier?: string
  paymentSource: PaymentSource
  items: {
    productId: string
    quantity: number
    pricePerUnit: number
  }[]
}) {
  const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0)

  const result = await prisma.$transaction(async (tx) => {
    // ... (внутри транзакции без изменений)
    const procurement = await tx.procurement.create({
      data: {
        userId: data.userId,
        supplier: data.supplier,
        paymentSource: data.paymentSource,
        totalAmount,
        status: ProcurementStatus.COMPLETED,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            pricePerUnit: item.pricePerUnit,
          }))
        }
      },
      include: {
        items: true
      }
    })

    for (const item of procurement.items) {
      await tx.batch.create({
        data: {
          productId: item.productId,
          procurementItemId: item.id,
          initialQuantity: item.quantity,
          remainingQuantity: item.quantity,
          pricePerUnit: item.pricePerUnit,
        }
      })

      const product = await tx.product.findUnique({
        where: { id: item.productId }
      })

      if (product) {
        const currentStock = Number(product.currentStock)
        const currentAvgPrice = Number(product.averagePurchasePrice)
        const newQuantity = Number(item.quantity)
        const newPrice = Number(item.pricePerUnit)

        const totalQuantity = currentStock + newQuantity
        const newAveragePrice = totalQuantity > 0 
          ? ((currentStock * currentAvgPrice) + (newQuantity * newPrice)) / totalQuantity
          : newPrice

        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: totalQuantity,
            averagePurchasePrice: newAveragePrice
          }
        })
      }

      await tx.auditLog.create({
        data: {
          userId: data.userId,
          action: "PROCUREMENT_ITEM",
          details: `Закуплен товар: ${item.productId}, кол-во: ${item.quantity}, цена: ${item.pricePerUnit}`
        }
      })
    }

    return procurement
  })

  revalidatePath("/procurement")
  revalidatePath("/inventory")
  revalidatePath("/accounting")
  
  return serializeEntity(result)
}
