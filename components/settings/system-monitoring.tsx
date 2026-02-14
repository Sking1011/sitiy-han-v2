"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Activity, 
  Server, 
  Database, 
  HardDrive, 
  Clock, 
  User as UserIcon,
  Search,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface SystemMonitoringProps {
  logs: any[]
}

const ACTION_MAP: Record<string, { label: string, color: string }> = {
  "DISPOSAL_CREATED": { label: "Списание", color: "bg-red-500 hover:bg-red-600" },
  "PROCUREMENT_ITEM": { label: "Закуп", color: "bg-blue-500 hover:bg-blue-600" },
  "USER_LOGIN": { label: "Вход", color: "bg-green-500 hover:bg-green-600" },
  "PRODUCTION_CREATED": { label: "Производство", color: "bg-orange-500 hover:bg-orange-600" },
  "PRODUCTION_COMPLETED": { label: "Выпуск", color: "bg-primary hover:bg-primary/90" },
  "SALE_CREATED": { label: "Продажа", color: "bg-green-600 hover:bg-green-700" },
}

export function SystemMonitoring({ logs }: SystemMonitoringProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const systemMetrics = [
    { name: "Загрузка CPU", value: 15, icon: Activity },
    { name: "Память", value: 42, icon: Server },
    { name: "БД Соединения", value: 8, max: 100, icon: Database },
    { name: "Диск", value: 28, icon: HardDrive },
  ]

  const formatDetails = (details: string | null) => {
    if (!details) return "—";
    try {
      const parsed = JSON.parse(details);
      // Если это массив (например, список списаний из deductStock)
      if (Array.isArray(parsed)) {
         return `Позиций: ${parsed.length}`;
      }
      // Если объект
      if (typeof parsed === 'object') {
         // Пытаемся сформировать читаемую строку
         const parts = [];
         if (parsed.productId) parts.push(`Товар ID: ...${parsed.productId.slice(-4)}`);
         if (parsed.productName) parts.push(parsed.productName);
         if (parsed.quantity) parts.push(`${parsed.quantity} ед.`);
         if (parsed.totalCost) parts.push(`Сумма: ${parsed.totalCost}`);
         if (parsed.reason) parts.push(`"${parsed.reason}"`);
         
         return parts.length > 0 ? parts.join(", ") : JSON.stringify(parsed);
      }
      return JSON.stringify(parsed);
    } catch (e) {
      return details;
    }
  }

  const filteredLogs = logs.filter(log => 
    log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Metrics Grid */}
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
        <CardHeader className="px-0 md:px-6 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Логи аудита
                </CardTitle>
                <CardDescription>Последние действия пользователей в системе</CardDescription>
            </div>
            <div className="relative w-[200px] hidden md:block">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Поиск..." 
                    className="pl-8 h-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[140px]">Время</TableHead>
                        <TableHead className="w-[180px]">Пользователь</TableHead>
                        <TableHead className="w-[120px]">Действие</TableHead>
                        <TableHead>Детали</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredLogs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                Действий не найдено
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredLogs.map((log) => {
                            const actionInfo = ACTION_MAP[log.action] || { label: log.action, color: "bg-slate-500" };
                            
                            return (
                                <TableRow key={log.id} className="group">
                                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                                        {format(new Date(log.timestamp), "dd.MM.yy HH:mm", { locale: ru })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                    {log.user?.name?.slice(0,2).toUpperCase() || "SY"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium leading-none">{log.user?.name || "Система"}</span>
                                                <span className="text-[9px] text-muted-foreground">{log.user?.role || "SYSTEM"}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn("text-[10px] font-normal pointer-events-none whitespace-nowrap", actionInfo.color)}>
                                            {actionInfo.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs truncate max-w-[200px] md:max-w-[400px] lg:max-w-[600px] text-muted-foreground group-hover:text-foreground transition-colors" title={log.details}>
                                            {formatDetails(log.details)}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
