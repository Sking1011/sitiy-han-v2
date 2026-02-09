import { getTransactionsAction } from "@/app/actions/accounting.actions"
import { TransactionTable } from "@/components/accounting/transaction-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AccountingPage() {
  const transactions = await getTransactionsAction()

  const stats = transactions.reduce(
    (acc: any, t: any) => {
      if (t.type === "INCOME") {
        acc.income += t.totalAmount
      } else {
        acc.expense += t.totalAmount
      }
      return acc
    },
    { income: 0, expense: 0 }
  )

  const profit = stats.income - stats.expense

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Бухгалтерия</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.income)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий расход</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.expense)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Чистая прибыль</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? "text-blue-600" : "text-destructive"}`}>
              {formatCurrency(profit)}
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionTable initialTransactions={transactions} />
    </div>
  )
}
