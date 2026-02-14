import { Trash2, Coins, AlertCircle, TrendingDown, Info, ShieldCheck, Database, Receipt, History, BarChart3, UserMinus } from "lucide-react";
import { WikiArticle } from "../types";
import { cn } from "@/lib/utils";

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", className)}>
    {children}
  </span>
);

export const disposalLogic: WikiArticle = {
  id: "disposal-logic",
  categoryId: "inventory",
  title: "Списание и Убытки",
  content: "Технический регламент списания ТМЦ. Учет финансовых потерь, причины списания и влияние на бухгалтерский баланс.",
  render: () => (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500/10 via-background to-red-500/5 p-8 md:p-12 border border-red-500/20 shadow-inner">
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="bg-red-500 text-white mb-4">Учет потерь</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            Управление <br />
            <span className="text-red-600">списаниями и браком</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Функционал <strong>Списания</strong> фиксирует безвозвратную потерю сырья или продукции, автоматически рассчитывая финансовый убыток на основе себестоимости партий.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Фиксация убытка
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="w-5 h-5 text-blue-500" />
              Коррекция склада
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              Аналитика брака
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="space-y-8">
        <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
          <Info className="w-6 h-6 text-primary" />
          Механика процесса
        </h3>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" /> Где и как списать?
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              В модуле <strong>«Склад»</strong> при выборе любого товара доступно действие «Списать». Вам необходимо указать количество и причину (порча, брак, дегустация).
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" /> Финансовый расчет
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Система не просто уменьшает остаток. Она находит партии этого товара (по методу FIFO) и вычисляет <strong>реальную стоимость потери</strong>, которая мгновенно попадает в отчет о расходах.
            </p>
          </div>
        </div>
      </div>

      {/* Scenarios Section */}
      <div className="space-y-8 bg-muted/30 rounded-[3rem] p-10 md:p-16 border border-border">
        <h3 className="text-2xl font-black tracking-tight text-center">Типовые сценарии списания</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-2xl bg-background border space-y-3">
            <Badge className="bg-orange-100 text-orange-700">Технологический брак</Badge>
            <p className="text-xs text-muted-foreground">Продукция, испорченная в процессе варки или копчения. Списывается с фиксацией партии.</p>
          </div>
          <div className="p-6 rounded-2xl bg-background border space-y-3">
            <Badge className="bg-purple-100 text-purple-700">Дегустации и Тесты</Badge>
            <p className="text-xs text-muted-foreground">Сырье, использованное для отработки новых рецептов. Позволяет точно знать стоимость разработки.</p>
          </div>
          <div className="p-6 rounded-2xl bg-background border space-y-3">
            <Badge className="bg-red-100 text-red-700">Истечение срока</Badge>
            <p className="text-xs text-muted-foreground">Списание товаров, не реализованных вовремя. Важный маркер для отдела продаж.</p>
          </div>
        </div>
      </div>

      {/* Accounting Integration */}
      <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border shadow-sm shrink-0">
           <Receipt className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-bold">Интеграция с бухгалтерией</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Каждое списание автоматически создает транзакцию в разделе <strong>«Бухгалтерия»</strong> с типом «Расход». Это гарантирует, что ваша чистая прибыль в конце месяца будет рассчитана с учетом всех производственных потерь.
          </p>
        </div>
      </div>

      {/* Caution */}
      <div className="flex items-start gap-4 p-8 rounded-3xl bg-yellow-500/[0.05] border border-yellow-500/20 shadow-sm">
         <AlertCircle className="w-8 h-8 text-yellow-600 shrink-0 mt-1" />
         <div className="space-y-2">
            <h4 className="font-bold text-yellow-800">Важное замечание</h4>
            <p className="text-sm text-yellow-700 leading-relaxed">
              Списание является необратимой операцией. Все детали (ID партий, цены на момент списания, исполнитель) сохраняются в <strong>Аудит-логе</strong> и <strong>Истории товара</strong> для последующего контроля.
            </p>
         </div>
      </div>
    </div>
  )
};
