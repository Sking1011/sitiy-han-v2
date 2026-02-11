"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Activity, Server, Database, HardDrive, Clock } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface SystemMonitoringProps {
  logs: any[]
}

export function SystemMonitoring({ logs }: SystemMonitoringProps) {
  const systemMetrics = [
    { name: "Загрузка CPU", value: 15, icon: Activity },
    { name: "Память", value: 42, icon: Server },
    { name: "БД Соединения", value: 8, max: 100, icon: Database },
    { name: "Диск", value: 28, icon: HardDrive },
  ]

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Metrics Grid - Horizontal scroll on mobile */}
      <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible scrollbar-hide">
        {systemMetrics.map((metric) => (
          <Card key={metric.name} className="min-w-[200px] flex-shrink-0 md:min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{metric.name}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}{metric.max ? "" : "%"}</div>
              <Progress value={metric.value} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-none md:border md:shadow-sm">
        <CardHeader className="px-0 md:px-6">
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Логи аудита
          </CardTitle>
          <CardDescription>Последние действия пользователей в системе</CardDescription>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          <ScrollArea className="h-[500px] w-full rounded-md border p-0 md:p-4">
            <div className="divide-y">
              {logs.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">Логов пока нет</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="font-normal text-[10px] md:text-xs">
                          {log.user?.name || "Система"}
                        </Badge>
                        <span className="text-muted-foreground text-[10px] md:text-xs font-mono">
                          {format(new Date(log.timestamp), "HH:mm:ss, d MMM", { locale: ru })}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-sm text-foreground">{log.action}</span>
                        {log.details && (
                          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded mt-1 overflow-x-auto font-mono">
                            {log.details}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
