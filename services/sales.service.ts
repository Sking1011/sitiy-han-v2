import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

      // 2. Списываем со склада
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) throw new Error(`Товар не найден`);

        const currentStock = Number(product.currentStock);
        if (currentStock < item.quantity) {
          throw new Error(`Недостаточно товара "${product.name}" на складе (доступно: ${currentStock})`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: new Prisma.Decimal(currentStock - item.quantity),
          },
        });
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
