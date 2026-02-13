"use server"

import { AccountingService, TransactionType } from "@/services/accounting.service"
import { serializeEntity } from "@/lib/utils"
import { PaymentSource } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getTransactionsAction(params?: {
  startDate?: Date;
  endDate?: Date;
  type?: TransactionType;
}) {
  const transactions = await AccountingService.getTransactions(params)
  return serializeEntity(transactions)
}

export async function createExpenseAction(data: {
  categoryId: string;
  amount: number;
  paymentSource: PaymentSource;
  description?: string;
  name: string; // Обычно это название расхода (например "За февраль")
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const expense = await AccountingService.createExpense({
    ...data,
    userId: session.user.id
  })

  revalidatePath("/accounting")
  revalidatePath("/dashboard")
  
  return serializeEntity(expense)
}
