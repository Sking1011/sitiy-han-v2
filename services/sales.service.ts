import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { InventoryService } from "./inventory.service";

export class SalesService {
  static async createSale(data: {
    customer?: string;
    userId?: string;
    items: {
      productId: string;
      quantity: number;
      pricePerUnit: number;
    }[];
  }) {
    const totalRevenue = data.items.reduce(
      (sum, item) => sum + item.quantity * item.pricePerUnit,
      0
    );

    return prisma.$transaction(async (tx) => {
      // 1. Создаем запись о продаже
      const sale = await tx.sale.create({
        data: {
          customer: data.customer,
          userId: data.userId,
          totalRevenue: new Prisma.Decimal(totalRevenue),
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: new Prisma.Decimal(item.quantity),
              pricePerUnit: new Prisma.Decimal(item.pricePerUnit),
            })),
          },
        },
      });

      // 2. Списываем со склада используя централизованную логику FIFO
      for (const item of data.items) {
        await InventoryService.deductStock(tx, item.productId, item.quantity);
      }

      return sale;
    });
  }

  static async getSales() {
    return prisma.sale.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { date: "desc" },
    });
  }
}
