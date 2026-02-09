"use server"

import { AccountingService, TransactionType } from "@/services/accounting.service"
import { serializeEntity } from "@/lib/utils"

export async function getTransactionsAction(params?: {
  startDate?: Date;
  endDate?: Date;
  type?: TransactionType;
}) {
  const transactions = await AccountingService.getTransactions(params)
  return serializeEntity(transactions)
}
