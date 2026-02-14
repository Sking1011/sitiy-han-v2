"use client"

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Clock } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface LogsTableProps {
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

export function LogsTable({ logs }: LogsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const formatDetails = (details: string | null) => {
    if (!details) return "—";
    try {
      const parsed = JSON.parse(details);
      if (Array.isArray(parsed)) return `Позиций: ${parsed.length}`;
      if (typeof parsed === 'object') {
         const parts = [];
         if (parsed.productName) parts.push(parsed.productName);
         if (parsed.quantity) parts.push(`${parsed.quantity} ед.`);
         if (parsed.totalCost) parts.push(`${parsed.totalCost} ₸`);
         if (parsed.reason) parts.push(`"${parsed.reason}"`);
         // Fallback if specific fields missing
         if (parts.length === 0) return JSON.stringify(parsed);
         return parts.join(", ");
      }
      return JSON.stringify(parsed);
    } catch (e) {
      return details; // Return as is if not JSON
    }
  }

  const filteredLogs = logs.filter(log => 
    log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Поиск по логам..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs text-muted-foreground font-medium">
            Всего записей: {filteredLogs.length}
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[150px]">Дата</TableHead>
              <TableHead className="w-[200px]">Пользователь</TableHead>
              <TableHead className="w-[150px]">Действие</TableHead>
              <TableHead>Детали</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  Записей не найдено
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => {
                const actionInfo = ACTION_MAP[log.action] || { label: log.action, color: "bg-slate-500" };
                
                return (
                  <TableRow key={log.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                      {format(new Date(log.timestamp), "dd.MM.yy HH:mm:ss", { locale: ru })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                            {log.user?.name?.slice(0,2).toUpperCase() || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-none">{log.user?.name || "Система"}</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">{log.user?.role || "SYSTEM"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-[10px] font-medium pointer-events-none whitespace-nowrap shadow-sm", actionInfo.color)}>
                        {actionInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="text-xs text-muted-foreground truncate max-w-[300px] md:max-w-[500px] cursor-help border-b border-dashed border-muted-foreground/30 inline-block pb-0.5" 
                        title={log.details || "Нет деталей"}
                      >
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
    </div>
  )
}
