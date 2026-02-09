import { prisma } from "@/lib/prisma";
import { PaymentSource, Unit } from "@prisma/client";

export type TransactionType = "INCOME" | "EXPENSE" | "PROCUREMENT";

export interface AccountingTransaction {
  id: string;
  date: Date;
  type: TransactionType;
  categoryName: string;
  itemName?: string;
  quantity?: number;
  unit?: Unit;
  pricePerUnit?: number;
  totalAmount: number;
  counterparty?: string;
  paymentSource: PaymentSource;
  performedBy?: string;
}

export class AccountingService {
  static async getTransactions(params?: {
    startDate?: Date;
    endDate?: Date;
    type?: TransactionType;
  }) {
    const where: any = {};
    if (params?.startDate || params?.endDate) {
      where.date = {};
      if (params.startDate) where.date.gte = params.startDate;
      if (params.endDate) where.date.lte = params.endDate;
    }

    // 1. Fetch Sales (Income)
    const sales = await prisma.sale.findMany({
      where: params?.type && params.type !== "INCOME" ? { id: "none" } : where,
      include: {
        user: { select: { name: true, username: true } },
        items: {
          include: {
            product: {
              include: { category: true }
            }
          }
        }
      },
      orderBy: { date: "desc" }
    });

    // 2. Fetch Procurements
    const procurements = await prisma.procurement.findMany({
      where: params?.type && params.type !== "PROCUREMENT" ? { id: "none" } : where,
      include: {
        user: { select: { name: true, username: true } },
        items: {
          include: {
            product: {
              include: { category: true }
            }
          }
        }
      },
      orderBy: { date: "desc" }
    });

    // 3. Fetch General Expenses
    const expenses = await prisma.expense.findMany({
      where: params?.type && params.type !== "EXPENSE" ? { id: "none" } : where,
      include: {
        user: { select: { name: true, username: true } },
        category: true
      },
      orderBy: { date: "desc" }
    });

    const transactions: AccountingTransaction[] = [];

    // Map Sales to Transactions (One transaction per sale item for detail, or per sale for summary)
    // Here we do per sale item for maximum detail as requested
    sales.forEach(sale => {
      sale.items.forEach(item => {
        transactions.push({
          id: `${sale.id}-${item.id}`,
          date: sale.date,
          type: "INCOME",
          categoryName: item.product.category.name,
          itemName: item.product.name,
          quantity: Number(item.quantity),
          unit: item.product.unit,
          pricePerUnit: Number(item.pricePerUnit),
          totalAmount: Number(item.quantity) * Number(item.pricePerUnit),
          counterparty: sale.customer || "Розничный клиент",
          paymentSource: "BUSINESS_CASH", // Sales usually go to cash
          performedBy: sale.user?.name || sale.user?.username || "Система"
        });
      });
    });

    // Map Procurements
    procurements.forEach(proc => {
      proc.items.forEach(item => {
        transactions.push({
          id: `${proc.id}-${item.id}`,
          date: proc.date,
          type: "PROCUREMENT",
          categoryName: item.product.category.name,
          itemName: item.product.name,
          quantity: Number(item.quantity),
          unit: item.product.unit,
          pricePerUnit: Number(item.pricePerUnit),
          totalAmount: Number(item.quantity) * Number(item.pricePerUnit),
          counterparty: proc.supplier || "Неизвестен",
          paymentSource: proc.paymentSource,
          performedBy: proc.user?.name || proc.user?.username || "Система"
        });
      });
    });

    // Map Expenses
    expenses.forEach(exp => {
      transactions.push({
        id: exp.id,
        date: exp.date,
        type: "EXPENSE",
        categoryName: exp.category.name,
        itemName: exp.name,
        totalAmount: Number(exp.amount),
        counterparty: "Прочие расходы",
        paymentSource: exp.paymentSource,
        performedBy: exp.user?.name || exp.user?.username || "Система"
      });
    });

    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
