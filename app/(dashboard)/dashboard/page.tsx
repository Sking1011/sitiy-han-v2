import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { DashboardService } from "@/services/dashboard.service"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const stats = await DashboardService.getStats()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold lg:text-3xl">Сводка дня</h1>
        <p className="text-muted-foreground">
          Добро пожаловать, {session?.user?.name}!
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Свободные деньги</CardTitle>
            <Wallet className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.freeCash.toLocaleString()} ₸</div>
            <p className="text-xs opacity-70 mt-1">Доступно в кассе</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выручка (сегодня)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} ₸</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUpCircle className="mr-1 h-3 w-3" />
              Обновлено только что
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Закупки (сегодня)</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayProcurementSum.toLocaleString()} ₸</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.todayProcurementCount} операции</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Критический остаток</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.lowStockCount} поз.</div>
            <p className="text-xs text-muted-foreground mt-1">Требуется закуп</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Динамика прибыли</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center border-dashed border-2 rounded-lg m-4">
             <p className="text-muted-foreground italic">График будет доступен после накопления данных</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Последние действия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="flex-1">
                            <p className="font-medium">Производство партии #12{i}</p>
                            <p className="text-xs text-muted-foreground">Сегодня, 10:24</p>
                        </div>
                        <div className="text-right font-medium">
                            +24 кг
                        </div>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Package } from "lucide-react"
