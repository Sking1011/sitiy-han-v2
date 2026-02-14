import { Trash2, Truck, Zap, GitMerge, ShieldCheck, History, Search, AlertCircle, ArrowDownWideNarrow, Info, Layers, RefreshCcw, Database, GitBranch, BarChart3, Play } from "lucide-react";
import { WikiArticle } from "../types";
import { cn } from "@/lib/utils";

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", className)}>
    {children}
  </span>
);

export const batchMerging: WikiArticle = {
  id: "batch-merging",
  categoryId: "finance",
  title: "Слияние партий: Умное объединение",
  content: "Технология объединения остатков и пересчета себестоимости. Алгоритмы средневзвешенной цены и кросс-товарное слияние.",
  render: () => (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 md:p-12 border border-primary/20 shadow-inner">
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="bg-primary text-primary-foreground mb-4">Управление складом</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            Консолидация <br />
            <span className="text-primary">партий и остатков</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Инструмент <strong>Слияние</strong> позволяет объединять мелкие остатки сырья в единые партии, автоматически пересчитывая средневзвешенную цену без потери финансовой точности.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <GitBranch className="w-5 h-5 text-blue-500" />
              Средневзвешенная цена
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="w-5 h-5 text-green-500" />
              Кросс-товары
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              Аудит перемещений
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main Scenarios */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* ... existing scenario cards ... */}
      </div>

      {/* How to use */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
          <Play className="w-6 h-6 text-primary" />
          Инструкция: Как выполнить слияние
        </h3>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">1</div>
              <p className="text-sm text-muted-foreground pt-1">Перейдите в раздел <strong>«Склад»</strong> и выберите товар, который станет «принимающим» (целью).</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">2</div>
              <p className="text-sm text-muted-foreground pt-1">Нажмите <strong>«Действие» → «Слияние»</strong>. Откроется диалог управления партиями.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">3</div>
              <p className="text-sm text-muted-foreground pt-1">Выберите партию-источник, которую нужно <strong>влить</strong> в текущий товар. Система покажет доступные остатки в рамках одной категории.</p>
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col justify-center space-y-4">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <GitMerge className="w-5 h-5" /> Логика «Поглощения»
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Важно понимать: слияние всегда происходит <strong>в тот товар</strong>, из карточки которого вы вызвали действие. Исходная партия (та, которую вы выбираете в списке) будет списана, а её вес и стоимость будут перенесены в целевой товар.
            </p>
          </div>
        </div>
      </div>

      {/* Math Section */}
      <div className="space-y-8 bg-primary/5 rounded-[3rem] p-10 md:p-16 border border-primary/10 relative overflow-hidden">
        <div className="relative z-10 space-y-8">
            <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <Info className="w-8 h-8 text-primary" />
                    Алгоритм расчета стоимости
                </h3>
                <p className="text-muted-foreground max-w-xl">
                    При слиянии используется формула <strong>средневзвешенной цены</strong>. Это обеспечивает неизменность общей финансовой оценки складских запасов после операции останется неизменной.
                </p>
            </div>

            <div className="p-10 rounded-3xl bg-background border shadow-xl flex flex-col items-center justify-center space-y-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/50">Формула новой себестоимости:</p>
                <div className="text-3xl md:text-5xl font-black text-foreground tracking-tighter text-center">
                    <span className="text-primary">(Q₁·P₁ + Q₂·P₂)</span> <br className="md:hidden" />
                    <span className="mx-4 opacity-30 text-2xl font-light">/</span> <br className="md:hidden" />
                    <span className="text-blue-500">(Q₁ + Q₂)</span>
                </div>
                <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Q = Количество</span>
                    <span>P = Цена</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 rounded-2xl bg-background/50 border border-dashed flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">1</div>
                    <p className="text-sm italic">Партия А: 10кг по 2000₸ (Оценка: 20 000₸)</p>
                </div>
                <div className="p-6 rounded-2xl bg-background/50 border border-dashed flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">2</div>
                    <p className="text-sm italic">Партия Б: 5кг по 3000₸ (Оценка: 15 000₸)</p>
                </div>
                <div className="md:col-span-2 p-6 rounded-2xl bg-primary text-primary-foreground flex items-center justify-between">
                    <span className="font-bold">ИТОГОВАЯ ПАРТИЯ:</span>
                    <span className="font-black text-xl">15 кг по 2 333.33 ₸</span>
                </div>
            </div>
        </div>
      </div>

      {/* Categories Power */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
          <Layers className="w-7 h-7 text-primary" />
          Кросс-товарное слияние
        </h3>
        <div className="p-8 md:p-12 rounded-[2.5rem] border bg-gradient-to-br from-background to-muted/30 space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Система допускает слияние разных номенклатурных позиций при условии их нахождения в <strong>одной категории</strong>.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-8 py-6">
            <div className="px-6 py-3 rounded-xl bg-muted border font-bold">Обрезок лопатки</div>
            <ArrowDownWideNarrow className="w-8 h-8 text-primary rotate-[-90deg] hidden md:block" />
            <ArrowDownWideNarrow className="w-8 h-8 text-primary md:hidden" />
            <div className="px-6 py-3 rounded-xl bg-muted border font-bold">Обрезок шеи</div>
            <ArrowDownWideNarrow className="w-8 h-8 text-primary rotate-[-90deg] hidden md:block" />
            <ArrowDownWideNarrow className="w-8 h-8 text-primary md:hidden" />
            <div className="px-10 py-5 rounded-2xl bg-green-500 text-white font-black shadow-lg shadow-green-500/20 text-center uppercase tracking-tighter">Целевой полуфабрикат</div>
          </div>
          <p className="text-sm text-muted-foreground italic">
            * При кросс-товарном слиянии система генерирует записи о списании исходных позиций и оприходовании новой, сохраняя полную историю перемещения веса.
          </p>
        </div>
      </div>

      {/* Operational Constraints */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-8 rounded-3xl bg-blue-500/[0.03] border border-blue-500/20 space-y-4">
            <div className="flex items-center gap-3 text-blue-600">
                <Database className="w-6 h-6" />
                <h4 className="font-bold">Технический приоритет</h4>
            </div>
            <p className="text-sm text-muted-foreground">
                При слиянии система сохраняет дату создания <strong>целевой партии</strong>, в которую происходит объединение, для соблюдения логики FIFO в будущем.
            </p>
        </div>
        <div className="p-8 rounded-3xl bg-green-500/[0.03] border border-green-500/20 space-y-4">
            <div className="flex items-center gap-3 text-green-600">
                <ShieldCheck className="w-6 h-6" />
                <h4 className="font-bold">Бухгалтерская точность</h4>
            </div>
            <p className="text-sm text-muted-foreground">
                Каждая операция слияния фиксируется в базе данных как "Двойная запись": списание остатков с исходных партий и пополнение целевой с новой стоимостью.
            </p>
        </div>
      </div>
    </div>
  )
};
