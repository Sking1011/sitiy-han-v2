import { Clock, Zap, CheckCircle2, Scale, Calculator, History, Layers, Info, TrendingDown, Thermometer, Timer, ChefHat, Play, Weight, Receipt, AlertCircle, Database, ShieldCheck, BarChart3, ArrowRightLeft } from "lucide-react";
import { WikiArticle } from "../types";
import { cn } from "@/lib/utils";

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", className)}>
    {children}
  </span>
);

export const productionProcess: WikiArticle = {
  id: "production-process",
  categoryId: "production",
  title: "Цикл производства",
  content: "Глубокое техническое руководство по производственному модулю: от выбора сырья по партиям до анализа процента выхода и финальной себестоимости.",
  render: () => (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 md:p-12 border border-primary/20 shadow-inner">
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="bg-primary text-primary-foreground mb-4">Ядро системы</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            Управление <br />
            <span className="text-primary">производственным циклом</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Модуль <strong>Производство</strong> автоматизирует превращение сырья в готовую продукцию, рассчитывая реальную экономику каждой варки с учетом ужарки и точной стоимости партий.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="w-5 h-5 text-blue-500" />
              Технологические карты
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              FIFO списание
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              Контроль ужарки
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Stage 1: Planning & Raw Materials */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Этап 1: Планирование и Сборка</h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-4">
              <h4 className="font-bold flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" /> Интеллектуальный рецепт
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Выбор рецепта автоматически подтягивает список ингредиентов и их пропорции. Изменяя <strong>«Вес мясной основы»</strong>, вы мгновенно пересчитываете весь замес.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-4">
              <h4 className="font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" /> Управление партиями
              </h4>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <span><strong>Мясная масса:</strong> Выбор конкретной партии закупа для фиксации точной входной цены.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <span><strong>Специи и добавки:</strong> Система использует <strong>Авто-FIFO</strong>, списывая остатки с самых старых поступлений.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-muted/30 rounded-[2.5rem] p-8 border space-y-6">
             <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Экономика планирования</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-dashed">
                    <span className="text-sm">Расчетный вес (Σ ингредиентов)</span>
                    <span className="font-bold text-primary">Автоматически</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-dashed">
                    <span className="text-sm">Прогноз затрат</span>
                    <span className="font-bold text-primary">На лету</span>
                </div>
                <div className="flex justify-between items-center py-3">
                    <span className="text-sm">Маржинальность (прогноз)</span>
                    <Badge className="bg-green-500/10 text-green-600 border-green-200">Доступна сразу</Badge>
                </div>
             </div>
             <p className="text-[11px] text-muted-foreground italic leading-tight">
                * Прогноз прибыли строится на разнице между текущей стоимостью выбранных партий сырья и установленной ценой продажи готового продукта в Справочнике.
             </p>
          </div>
        </div>
      </div>

      {/* Stage 2: In Progress */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600">
            <Play className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Этап 2: Производственный процесс</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            { label: "Подготовка", icon: Timer },
            { label: "Сушка", icon: Thermometer },
            { label: "Копчение", icon: Zap },
            { label: "Варка", icon: Clock },
          ].map((stage, idx) => (
            <div key={idx} className="p-6 rounded-3xl border bg-card text-center space-y-2">
              <stage.icon className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
              <p className="text-xs font-bold uppercase tracking-tighter">{stage.label}</p>
              <p className="text-[10px] text-muted-foreground">Минуты</p>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border shadow-sm shrink-0">
             <Scale className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Весовая точка отсчета</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Перед началом готовки важно внести <strong>Фактический вес замеса</strong>. Часто он отличается от расчетного (добавили больше льда, округлили специи). Этот вес — базис для расчета «Ужарки» в финале.
            </p>
          </div>
        </div>
      </div>

      {/* Stage 3: Completion & Economics */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Этап 3: Завершение и Анализ</h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Shrinkage Logic */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" /> Физика усушки (Ужарка)
            </h4>
            <div className="p-8 rounded-3xl bg-red-500/[0.03] border border-red-500/10 space-y-4">
               <p className="text-sm leading-relaxed">
                 При потере влаги (усушке) вес готовой продукции уменьшается, но <strong>общая стоимость затрат не меняется</strong>. Это приводит к математическому росту себестоимости каждого килограмма на выходе.
               </p>
               <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-dashed">
                 <div className="text-center px-4">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">До</p>
                   <p className="font-black text-lg">30 кг</p>
                 </div>
                 <ArrowRightLeft className="w-4 h-4 text-muted-foreground opacity-30" />
                 <div className="text-center px-4">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">После</p>
                   <p className="font-black text-lg">24 кг</p>
                 </div>
                 <div className="text-center px-4 bg-red-500 text-white rounded-xl py-1">
                   <p className="text-[10px] font-bold uppercase">Потери</p>
                   <p className="font-black text-lg">-20%</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Final Costing */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold flex items-center gap-2">
              <Receipt className="w-5 h-5 text-green-600" /> Итоговая себестоимость
            </h4>
            <div className="p-8 rounded-[2.5rem] bg-background border-2 border-primary/20 shadow-xl space-y-6">
               <div className="space-y-1">
                 <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Формула финала:</p>
                 <p className="text-2xl font-black tracking-tighter">Σ Затрат / Вес готовый</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-muted/50">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Чистая прибыль</p>
                    <p className="font-black text-green-600 text-lg">+ Реальные ₸</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-muted/50">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Приход на склад</p>
                    <p className="font-black text-primary text-lg">Новая партия</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Highlights */}
      <div className="bg-primary/5 rounded-[3rem] p-10 md:p-16 border border-primary/10 space-y-10">
        <h3 className="text-3xl font-black tracking-tight text-center">Технические гарантии модуля</h3>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
            <h5 className="font-bold">Заморозка цен</h5>
            <p className="text-sm text-muted-foreground">В момент начала варки цены сырья фиксируются. Даже если на склад поступит новая партия с другой ценой, текущее производство сохранит свою плановую экономику.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
            <div className="flex items-center gap-2">
               <h5 className="font-bold">Алгоритмический подбор (FIFO)</h5>
               <Badge className="bg-primary/10 text-primary">Core</Badge>
            </div>
            <p className="text-sm text-muted-foreground">В момент нажатия кнопки «Завершить», система автоматически подбирает партии для специй и добавок по методу FIFO. Это избавляет оператора от необходимости вручную выбирать конкретный лот соли или паприки, сохраняя при этом идеальный порядок в остатках.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
            <h5 className="font-bold">Двойная запись</h5>
            <p className="text-sm text-muted-foreground">Каждое завершение производства — это атомарная транзакция: списание сырья и приход новой партии готовой продукции происходят одновременно.</p>
          </div>
        </div>
      </div>

      {/* Alert / Warning */}
      <div className="flex items-start gap-4 p-8 rounded-3xl bg-yellow-500/[0.05] border border-yellow-500/20">
         <AlertCircle className="w-8 h-8 text-yellow-600 shrink-0 mt-1" />
         <div className="space-y-2">
            <h4 className="font-bold text-yellow-800">Критическая точность</h4>
            <p className="text-sm text-yellow-700 leading-relaxed">
              Не забывайте нажимать <strong>«Завершить и Списать»</strong> только после того, как продукция фактически взвешена после всех этапов термообработки. Отмена завершенного производства требует ручной корректировки остатков через аудит-лог.
            </p>
         </div>
      </div>
    </div>
  )
};
