import { prisma } from "@/lib/prisma";
import { PaymentSource, ProcurementStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";

export class ProcurementService {
  static async createProcurement(data: {
    supplier?: string;
    paymentSource: PaymentSource;
    userId?: string;
    items: {
      productId: string;
      quantity: number;
      pricePerUnit: number;
    }[];
  }) {
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.quantity * item.pricePerUnit,
      0
    );

    // Используем транзакцию, чтобы всё обновилось атомарно
    return prisma.$transaction(async (tx) => {
      // 1. Создаем запись о закупе
      const procurement = await tx.procurement.create({
        data: {
          supplier: data.supplier,
          paymentSource: data.paymentSource,
          userId: data.userId,
          totalAmount: new Prisma.Decimal(totalAmount),
          status: ProcurementStatus.COMPLETED,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: new Prisma.Decimal(item.quantity),
              pricePerUnit: new Prisma.Decimal(item.pricePerUnit),
            })),
          },
        },
      });

      // 2. Обновляем склад для каждой позиции и создаем Партии (Batches)
      for (const item of data.items) {
        // Find the procurement item ID we just created
        const procItem = await tx.procurementItem.findFirst({
            where: {
                procurementId: procurement.id,
                productId: item.productId,
                quantity: new Prisma.Decimal(item.quantity)
            }
        });

        // Создаем Партию (Batch)
        await tx.batch.create({
            data: {
                productId: item.productId,
                procurementItemId: procItem?.id, // Link if found, strictly logic
                initialQuantity: new Prisma.Decimal(item.quantity),
                remainingQuantity: new Prisma.Decimal(item.quantity),
                pricePerUnit: new Prisma.Decimal(item.pricePerUnit)
            }
        });

        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) continue;

        const currentStock = Number(product.currentStock);
        const currentAvgPrice = Number(product.averagePurchasePrice);
        const newQty = item.quantity;
        const newPrice = item.pricePerUnit;

        // Расчет новой средней цены (оставляем как справочную, хотя основной учет теперь по партиям)
        const totalQty = currentStock + newQty;
        let newAvgPurchasePrice = currentAvgPrice;

        if (totalQty > 0) {
          newAvgPurchasePrice = (currentStock * currentAvgPrice + newQty * newPrice) / totalQty;
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: new Prisma.Decimal(totalQty),
            averagePurchasePrice: new Prisma.Decimal(newAvgPurchasePrice),
          },
        });
      }

      return procurement;
    });
  }

  static async getProcurements() {
    return prisma.procurement.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { date: "desc" },
    });
  }
}
