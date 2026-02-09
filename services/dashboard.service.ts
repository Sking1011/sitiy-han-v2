import { prisma } from "@/lib/prisma";
import { PaymentSource } from "@prisma/client";

export class DashboardService {
  static async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Свободные деньги (Free Cash)
    // Сумма всех продаж - Сумма закупок (из бизнес-кассы) - Сумма расходов (из бизнес-кассы)
    const [salesSum, procurementSum, expenseSum] = await Promise.all([
      prisma.sale.aggregate({ _sum: { totalRevenue: true } }),
      prisma.procurement.aggregate({
        where: { paymentSource: PaymentSource.BUSINESS_CASH },
        _sum: { totalAmount: true },
      }),
      prisma.expense.aggregate({
        where: { paymentSource: PaymentSource.BUSINESS_CASH },
        _sum: { amount: true },
      }),
    ]);

    const freeCash = 
      Number(salesSum._sum.totalRevenue || 0) - 
      Number(procurementSum._sum.totalAmount || 0) - 
      Number(expenseSum._sum.amount || 0);

    // 2. Выручка за сегодня
    const todaySales = await prisma.sale.aggregate({
      where: { date: { gte: today } },
      _sum: { totalRevenue: true },
    });

    // 3. Закупки за сегодня
    const todayProcurements = await prisma.procurement.findMany({
      where: { date: { gte: today } },
    });
    const todayProcurementSum = todayProcurements.reduce((acc, p) => acc + Number(p.totalAmount), 0);

    // 4. Критические остатки
    const lowStockCount = await prisma.product.count({
      where: {
        currentStock: {
          lte: prisma.product.fields.minStock
        }
      }
    });

    return {
      freeCash,
      todayRevenue: Number(todaySales._sum.totalRevenue || 0),
      todayProcurementSum,
      todayProcurementCount: todayProcurements.length,
      lowStockCount
    };
  }
}
