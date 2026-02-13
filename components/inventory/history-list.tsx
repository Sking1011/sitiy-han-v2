"use client"

import { useState } from "react"
import { 
  History, 
  ShoppingCart, 
  Layers,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Trash2, 
  GitMerge,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatUnit, formatCurrency, formatDate } from "@/lib/formatters"

interface HistoryListProps {
  history: any[];
  productUnit: string;
}

const getTransactionTypeInfo = (type: string) => {
    switch (type) {
        case "PROCUREMENT":
            return { label: "Закуп", icon: ShoppingCart, color: "text-green-600 bg-green-50 border-green-100" };
        case "SALE":
            return { label: "Продажа", icon: TrendingUp, color: "text-blue-600 bg-blue-50 border-blue-100" };
        case "PRODUCTION_USAGE":
            return { label: "Цех (исп.)", icon: Layers, color: "text-orange-600 bg-orange-50 border-orange-100" };
        case "PRODUCTION_OUTPUT":
            return { label: "Цех (выпуск)", icon: CheckCircle2, color: "text-primary bg-primary/5 border-primary/10" };
        case "DISPOSAL":
            return { label: "Списание", icon: Trash2, color: "text-red-600 bg-red-50 border-red-100" };
        case "MERGE":
            return { 
                label: "Слияние", 
                icon: GitMerge, 
                color: "text-purple-600 bg-purple-50 border-purple-100" 
            };
        default:
            return { label: type, icon: Info, color: "text-muted-foreground bg-muted/50 border-border" };
    }
}

export function HistoryList({ history, productUnit }: HistoryListProps) {
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null)

  const toggleHistory = (id: string) => {
    setExpandedHistoryId(expandedHistoryId === id ? null : id)
  }

  if (history.length === 0) {
      return (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <History className="w-10 h-10 mx-auto text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">История движения пуста</p>
        </div>
      )
  }

  return (
    <div className="space-y-3">
        {history.map((item) => {
            const info = getTransactionTypeInfo(item.type);
            const isExpanded = expandedHistoryId === item.id;
            
            return (
            <div key={item.id} className={cn(
                "rounded-xl border transition-all overflow-hidden",
                isExpanded ? "ring-1 ring-primary/20 bg-muted/5 shadow-sm" : "bg-muted/5 hover:bg-muted/10"
            )}>
                {/* Header Area */}
                <div 
                onClick={() => toggleHistory(item.id)}
                className="flex items-center justify-between p-3 sm:p-4 cursor-pointer select-none"
                >
                <div className="flex gap-2 sm:gap-3 items-start">
                    <div className={cn("p-1.5 sm:p-2 rounded-lg border shrink-0", info.color)}>
                    <info.icon className="w-3.5 h-3.5 sm:w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                        {info.label}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">{formatDate(item.date)}</span>
                    </div>
                    <p className="font-semibold text-xs sm:text-sm line-clamp-1">{item.counterparty}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right shrink-0">
                        <p className={cn(
                        "text-sm sm:text-base font-bold",
                        item.quantity > 0 ? "text-green-600" : "text-red-600"
                        )}>
                        {item.quantity > 0 ? "+" : ""}{item.quantity} {productUnit.toLowerCase()}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{item.performedBy}</p>
                    </div>
                    <ChevronRight className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-200",
                        isExpanded && "rotate-90"
                    )} />
                </div>
                </div>

                {/* Expanded Content Area */}
                {isExpanded && (
                    <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="pt-3 border-t border-border/50 space-y-4">
                            {/* Type Specific Details */}
                            {item.type === "MERGE" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-background border space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Источник</p>
                                        <p className="text-xs font-semibold">{item.details.sourceInfo}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background border space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Цель</p>
                                        <p className="text-xs font-semibold">{item.details.targetInfo}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background border space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Цена на момент переноса</p>
                                        <p className="text-sm font-bold text-primary">{formatCurrency(item.details.priceAtMerge)}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background border space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Общая сумма</p>
                                        <p className="text-sm font-bold">{formatCurrency(item.details.priceAtMerge * Math.abs(item.quantity))}</p>
                                        <p className="text-[9px] text-muted-foreground leading-tight mt-1 italic">
                                            * Стоимость переносимого веса по его себестоимости.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {item.type === "PRODUCTION_OUTPUT" && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div className="p-2 border rounded-lg bg-background">
                                            <p className="text-[9px] text-muted-foreground uppercase font-bold">Начальный вес</p>
                                            <p className="text-xs font-bold">{formatUnit(item.details.initialWeight, "KG")}</p>
                                        </div>
                                        <div className="p-2 border rounded-lg bg-background">
                                            <p className="text-[9px] text-muted-foreground uppercase font-bold">Финальный вес</p>
                                            <p className="text-xs font-bold">{formatUnit(item.details.finalWeight, "KG")}</p>
                                        </div>
                                        <div className="p-2 border rounded-lg bg-background">
                                            <p className="text-[9px] text-muted-foreground uppercase font-bold">Усушка</p>
                                            <p className="text-xs font-bold text-red-500">{((item.details.initialWeight - item.details.finalWeight) / item.details.initialWeight * 100).toFixed(1)}%</p>
                                        </div>
                                    </div>
                                    
                                    <div className="p-3 rounded-lg bg-primary/[0.03] border border-primary/10">
                                        <p className="text-[10px] text-primary font-bold uppercase">Себестоимость производства</p>
                                        <p className="text-base font-bold text-primary">{formatCurrency(Math.abs(item.quantity) * (item.price || 0))}</p>
                                        <p className="text-[9px] text-muted-foreground leading-tight mt-1 italic">
                                            Суммарная стоимость всех ингредиентов (мясо, специи и др.), затраченных на получение данного веса готовой продукции.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase px-1">Затраченное сырье</p>
                                        <div className="rounded-lg border bg-background overflow-hidden">
                                            {item.details.materials.map((m: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center px-3 py-2 text-xs border-b last:border-0">
                                                    <span className="font-medium">{m.name}</span>
                                                    <span className="font-bold">{formatUnit(m.quantity, m.unit)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {item.type === "PROCUREMENT" && (
                                    <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-background border space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Поставщик</p>
                                        <p className="text-xs font-semibold">{item.details.supplier || "Не указан"}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background border space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Оплата</p>
                                        <p className="text-xs font-semibold">{item.details.paymentSource === "BUSINESS_CASH" ? "🏢 Бизнес касса" : "👤 Личные средства"}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background border space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Цена за ед.</p>
                                        <p className="text-sm font-bold text-primary">{formatCurrency(item.price)}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background border space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Общая сумма</p>
                                        <p className="text-sm font-bold">{formatCurrency(item.total)}</p>
                                    </div>
                                    </div>
                            )}

                            {item.type === "PRODUCTION_USAGE" && (
                                <div className="p-3 rounded-lg bg-background border space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Целевой продукт</p>
                                    <p className="text-sm font-bold">{item.details.targetProduct}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1 tracking-tighter italic">Списано со склада для производства данной партии</p>
                                </div>
                            )}

                            {item.type === "DISPOSAL" && (
                                <div className="p-3 rounded-lg bg-red-50/50 border border-red-100 space-y-1">
                                    <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Причина списания</p>
                                    <p className="text-sm font-semibold text-red-700 italic">"{item.details.reason || "Причина не указана"}"</p>
                                    {item.details.batchId && (
                                        <p className="text-[9px] text-red-500 font-medium pt-1 uppercase">Партия: #{item.details.batchId.slice(0,8)}</p>
                                    )}
                                </div>
                            )}

                            {/* Generic Footer */}
                            <div className="flex justify-between items-center text-[9px] text-muted-foreground uppercase font-bold tracking-widest px-1">
                                <span>ID: {item.id.split('-')[0].slice(0, 12)}</span>
                                <span>Провел: {item.performedBy}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            );
        })}
    </div>
  )
}