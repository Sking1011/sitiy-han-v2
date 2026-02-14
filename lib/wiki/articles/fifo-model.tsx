import { ShieldCheck, TrendingUp, XCircle, CheckCircle2, Factory, Truck, BarChart3, Settings, AlertCircle, User as UserIcon, Layers, Coins, ArrowRightLeft, Scale, Info, Zap, Terminal, Database } from "lucide-react";
import { WikiArticle } from "../types";
import { cn } from "@/lib/utils";

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", className)}>
    {children}
  </span>
);

export const fifoModel: WikiArticle = {
  id: "fifo-model",
  categoryId: "finance",
  title: "Модель FIFO: Фундамент прибыли",
  content: "Техническое описание метода First-In, First-Out. Логика списания партий, расчет себестоимости и защита от инфляционных рисков.",
  render: () => (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 md:p-12 border border-primary/20 shadow-inner">
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="bg-primary text-primary-foreground mb-4">Финансовая модель</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            Принципы <br />
            <span className="text-primary">метода FIFO</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Алгоритм <strong>First-In, First-Out</strong> обеспечивает точность себестоимости, списывая сырье в порядке его поступления на склад. Это фундамент прозрачной прибыли.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Защита маржи
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="w-5 h-5 text-blue-500" />
              Точный аудит
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Анализ инфляции
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main Principle Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 rounded-3xl bg-green-500/[0.03] border border-green-500/10 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg leading-tight">Инфляционная защита</h4>
          <p className="text-sm text-muted-foreground">
            В условиях роста цен метод позволяет использовать сырье по цене закупа, совершенного ранее, что стабилизирует финансовые показатели в краткосрочном периоде.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-blue-500/[0.03] border border-blue-500/10 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg leading-tight">Фиксация себестоимости</h4>
          <p className="text-sm text-muted-foreground">
            Система исключает усреднение цен. Каждая единица продукции привязывается к конкретным финансовым затратам на сырье.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-purple-500/[0.03] border border-purple-500/10 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg leading-tight">Аудит и контроль</h4>
          <p className="text-sm text-muted-foreground">
            Обеспечивается полная прослеживаемость: связь между финальным чеком реализации и первичным документом закупа сырья.
          </p>
        </div>
      </div>

      {/* Visual Diagram Section */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
          <ArrowRightLeft className="w-6 h-6 text-primary" /> 
          Алгоритм списания запасов
        </h3>
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-muted/20 border shadow-inner overflow-x-auto">
          <div className="min-w-[600px] flex items-center justify-between gap-4">
            {/* Batch 1 */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="w-full h-32 rounded-2xl bg-orange-100 border-2 border-orange-200 flex flex-col items-center justify-center p-4 relative group">
                <div className="absolute -top-3 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Партия #1</div>
                <span className="text-orange-600 font-black text-xl">10 кг</span>
                <span className="text-orange-400 text-xs font-bold">2 000 ₸/кг</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-1 h-8 bg-orange-200" />
                <Badge className="bg-orange-500">Первый приоритет</Badge>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <ArrowRightLeft className="w-8 h-8 opacity-20" />
            </div>

            {/* Batch 2 */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="w-full h-32 rounded-2xl bg-blue-100 border-2 border-blue-200 flex flex-col items-center justify-center p-4 relative">
                <div className="absolute -top-3 bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Партия #2</div>
                <span className="text-blue-600 font-black text-xl">10 кг</span>
                <span className="text-blue-400 text-xs font-bold">3 000 ₸/кг</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-1 h-8 bg-blue-200" />
                <Badge variant="outline" className="border-blue-200 text-blue-400">Второй приоритет</Badge>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground text-2xl font-black px-4">
              =
            </div>

            {/* Production */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="w-full h-32 rounded-3xl bg-primary text-primary-foreground flex flex-col items-center justify-center p-6 shadow-xl shadow-primary/20">
                <Zap className="w-8 h-8 mb-2 animate-pulse" />
                <span className="font-black text-sm uppercase tracking-tighter">Списание 15 кг</span>
                <span className="text-xl font-black">35 000 ₸</span>
              </div>
              <p className="text-[10px] text-center font-bold text-muted-foreground uppercase leading-tight">
                10кг по 2000 + 5кг по 3000
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Logic */}
      <div className="bg-primary/5 rounded-[2.5rem] p-8 md:p-12 space-y-8 border border-primary/10">
        <div className="flex items-center gap-4">
          <Terminal className="w-10 h-10 text-primary" />
          <h3 className="text-2xl font-black tracking-tight">Обработка исключений и дефицита</h3>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2 uppercase text-xs tracking-widest">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              Отрицательные остатки
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Система позволяет проводить списание даже при отсутствии физического остатка в базе. В этом случае себестоимость дефицита рассчитывается по цене последней закупки или средней цене товара для сохранения непрерывности учета.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2 uppercase text-xs tracking-widest">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Детальная прослеживаемость
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Для каждой операции потребления (производство или списание) в базе сохраняется подробный JSON-лог с указанием точных ID партий и цен, из которых сложилась итоговая стоимость списания.
            </p>
          </div>
        </div>
      </div>

      {/* Technical fact */}
      <div className="flex items-center justify-center p-8 border border-dashed rounded-3xl">
        <p className="text-sm italic text-muted-foreground text-center">
          <AlertCircle className="w-4 h-4 inline mr-2 text-primary" />
          <strong>Примечание:</strong> Использование FIFO критично для предприятий с высокой оборачиваемостью склада и нестабильными закупочными ценами.
        </p>
      </div>
    </div>
  )
};
