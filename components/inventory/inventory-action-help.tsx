"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  HelpCircle, 
  ClipboardList,
  Package,
  History,
  GitMerge,
  Trash2,
  ShoppingCart,
  Info,
  Layers,
  Calculator,
  User,
  Clock,
  CheckCircle2,
  ScrollText,
  TrendingUp,
  Scale,
  Weight
} from "lucide-react"
import { cn } from "@/lib/utils"

const SECTIONS = [
  {
    id: "overview",
    title: "Описание готовки",
    icon: ClipboardList,
    content: (
      <div className="space-y-8 sm:space-y-10">
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-primary">Паспорт готовки</h3>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Детальный цифровой документ, фиксирующий "генетический код" конкретной партии продукта в момент её создания.</p>
                <p><b>Зачем нужно:</b> Для обеспечения 100% прослеживаемости качества по стандарту HACCP и глубокого анализа производственной эффективности.</p>
                <p><b>Как работает:</b> При завершении процесса система "замораживает" текущие цены сырья, веса и тайминги, создавая нередактируемый архив данных для этой партии.</p>
            </div>
        </div>
        
        <div className="grid gap-6 sm:gap-8">
          <div className="p-5 sm:p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-4 sm:space-y-6">
            <h4 className="text-base sm:text-xl font-bold flex items-center gap-3 text-primary">
                <Calculator className="w-5 h-5 sm:w-6 sm:h-6" /> Расчет себестоимости
            </h4>
            <div className="space-y-4">
                <div className="bg-background p-4 sm:p-6 rounded-2xl border border-border font-mono text-xs sm:text-sm shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 bg-primary/5 text-[9px] font-black uppercase">Cost Calculation</div>
                    <code className="text-primary font-bold text-base sm:text-lg">UnitCost = Sum(Material_Costs) / Final_Weight</code>
                </div>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <p><b>Себестоимость выходного продукта:</b> Формируется динамически в момент выпуска. Система суммирует стоимость всех списанных партий сырья и специй, а затем делит эту сумму на фактический финальный вес готового изделия.</p>
                    <div className="p-4 sm:p-6 bg-primary/5 rounded-2xl border border-primary/10 italic">
                        <b>Важно:</b> Чем больше усушка (потеря веса), тем выше себестоимость каждого килограмма готового продукта, так как затраты на сырье распределяются на меньший итоговый объем.
                    </div>
                </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-xl font-bold flex items-center gap-3 text-primary">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" /> Математика выхода (Yield)
            </h4>
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <p><b>Yield % = (Final_W / Initial_W) * 100</b></p>
                <p><b>Initial_W:</b> База ваших затрат.</p>
                <p><b>Final_W:</b> База вашей выручки.</p>
            </div>
          </div>

          <div className="p-5 sm:p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-xl font-bold flex items-center gap-3 text-primary">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" /> Прослеживаемость сырья
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                В таблице состава указаны не просто названия, а <b>ссылки на конкретные закупы</b>. Если возникнет вопрос к качеству, вы увидите поставщика мяса именно в этой палке колбасы.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "batches",
    title: "Партии (Остатки)",
    icon: Package,
    content: (
      <div className="space-y-8 sm:space-y-10">
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-primary">Архитектура партий</h3>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Метод раздельного хранения товара на складе, где каждая поставка или варка — это независимая единица учета.</p>
                <p><b>Зачем нужно:</b> Чтобы видеть реальную маржинальность. Разные партии имеют разную себестоимость из-за колебаний цен на рынке и разной усушки.</p>
            </div>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
            <div className="p-5 sm:p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-3 sm:space-y-4">
                <h4 className="text-base sm:text-xl font-bold text-primary flex items-center gap-3">
                    <Info className="w-5 h-5 sm:w-6 sm:h-6" /> Проблема усреднения
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    Обычные системы усредняют цену. Но при продаже вы не узнаете, сработали вы в плюс или в минус по конкретной сделке. Партии Sitiy Han показывают <b>правду</b>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-5 sm:p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-3 sm:space-y-4">
                    <h4 className="text-base sm:text-xl font-bold flex items-center gap-3 text-primary">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6" /> Принцип FIFO
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <b>First In, First Out.</b> Автоматическое предложение использовать сначала самое старое сырье для минимизации риска порчи.
                    </p>
                </div>
                <div className="p-5 sm:p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-3 sm:space-y-4">
                    <h4 className="text-base sm:text-xl font-bold flex items-center gap-3 text-primary">
                        <User className="w-5 h-5 sm:w-6 sm:h-6" /> Specific ID
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Ручной выбор конкретной партии оператором в обход очереди, если этого требует технология или заказчик.
                    </p>
                </div>
            </div>
        </div>
      </div>
    )
  },
  {
    id: "history",
    title: "История движения",
    icon: History,
    content: (
      <div className="space-y-8 sm:space-y-10">
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-primary">Хронология</h3>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Непрерывная лента всех манипуляций, совершенных с товаром или конкретной партией.</p>
                <p><b>Зачем нужно:</b> Для финансового аудита, предотвращения ошибок и прозрачности ответственности персонала.</p>
            </div>
        </div>
        
        <div className="grid gap-3 sm:gap-4">
            {[
                { type: "Закуп (PROCUREMENT)", desc: "Внешнее поступление. Увеличивает задолженность и складские остатки.", icon: ShoppingCart, color: "bg-green-100 text-green-700" },
                { type: "Выпуск (PRODUCTION_OUTPUT)", desc: "Результат варки. Трансформация сырья в готовый продукт.", icon: CheckCircle2, color: "bg-blue-100 text-blue-700" },
                { type: "Расход (PRODUCTION_USAGE)", desc: "Списание сырья на производство. Уменьшает остаток партии.", icon: Layers, color: "bg-orange-100 text-orange-700" },
                { type: "Слияние (MERGE)", desc: "Бухгалтерский перенос веса между партиями без изменения общего итога.", icon: GitMerge, color: "bg-purple-100 text-purple-700" },
                { type: "Списание (DISPOSAL)", desc: "Чистый убыток предприятия. Безвозвратная потеря материальной ценности.", icon: Trash2, color: "bg-red-100 text-red-700" }
            ].map((item, i) => (
                <div key={i} className="p-4 sm:p-6 rounded-3xl border bg-muted/30 border-border/50 flex gap-4 sm:gap-6 items-start shadow-sm">
                    <div className={cn("w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", item.color)}>
                        <item.icon className="w-5 h-5 sm:w-7 sm:h-7"/>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                        <p className="font-bold text-base sm:text-xl text-primary">{item.type}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    )
  },
  {
    id: "merge",
    title: "Слияние",
    icon: GitMerge,
    content: (
      <div className="space-y-8 sm:space-y-10">
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-primary">Интеллектуальное слияние</h3>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Инструмент объединения остатков в одну учетную карточку с пересчетом себестоимости.</p>
                <p><b>Зачем нужно:</b> Для избавления от "хвостов" на складе, когда осталось много мелких карточек.</p>
            </div>
        </div>
        
        <div className="p-5 sm:p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-4 sm:space-y-6">
          <h4 className="text-base sm:text-xl font-bold flex items-center gap-3 text-primary">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6" /> Формула балансировки
          </h4>
          <div className="space-y-4">
            <div className="bg-background p-4 sm:p-6 rounded-2xl border border-border font-mono text-xs sm:text-sm leading-relaxed shadow-inner">
                <p className="text-[9px] sm:text-[10px] uppercase text-muted-foreground mb-2">Расчет новой цены:</p>
                <code className="text-primary font-bold text-base sm:text-lg">P_final = (Q1*P1 + Q2*P2) / (Q1+Q2)</code>
            </div>
            <div className="p-4 sm:p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-2 sm:space-y-3 text-xs sm:text-sm leading-relaxed">
                <p><b>Пример:</b> 5 кг по 2000 ₸ + 15 кг по 2500 ₸.</p>
                <p className="font-bold text-primary">Новая цена партии: 2 375 ₸/кг.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "disposal",
    title: "Списание",
    icon: Trash2,
    content: (
      <div className="space-y-8 sm:space-y-10">
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-primary">Управление потерями</h3>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Регистрация безвозвратной потери товара (порча, брак, дегустация).</p>
                <p><b>Зачем нужно:</b> Для актуальности склада и корректного отчета о прибыли.</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="p-5 sm:p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-xl font-bold flex items-center gap-3 text-primary">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" /> Чистая прибыль
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Списанный товар напрямую уменьшает вашу чистую прибыль. Каждый кг брака требует продажи 3-5 кг товара для компенсации.
            </p>
          </div>
          <div className="p-5 sm:p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-xl font-bold flex items-center gap-3 text-primary">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" /> Контроль
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Классификация (Брак/Порча/Дегустация) помогает выявить ошибки в техпроцессе.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "purchase",
    title: "Закуп",
    icon: ShoppingCart,
    content: (
      <div className="space-y-8 sm:space-y-10">
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-primary">Приемка сырья</h3>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Процесс превращения денежных средств компании в материальные запасы.</p>
                <p><b>Зачем нужно:</b> Учет входящих цен — это фундамент для расчета экономики производства.</p>
            </div>
        </div>
        
        <div className="p-5 sm:p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-4 sm:space-y-6">
            <h4 className="text-base sm:text-xl font-bold text-primary flex items-center gap-3">
                <ScrollText className="w-5 h-5 sm:w-6 sm:h-6" /> Режимы ввода
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 sm:p-6 bg-background rounded-2xl border space-y-1 sm:space-y-2">
                    <p className="font-bold text-sm sm:text-base text-primary">Цена за единицу</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Ввод стоимости за 1 кг.</p>
                </div>
                <div className="p-4 sm:p-6 bg-background rounded-2xl border space-y-1 sm:space-y-2">
                    <p className="font-bold text-sm sm:text-base text-primary">Общая сумма</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Ввод итоговой суммы из чека.</p>
                </div>
            </div>
        </div>
      </div>
    )
  }
]

export function InventoryActionHelp() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
        >
          <HelpCircle className="h-5 w-5 sm:h-6 sm:h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1000px] p-0 gap-0 overflow-hidden sm:rounded-xl border bg-background sm:h-[750px] sm:max-h-[90vh] max-sm:h-[100dvh] max-sm:max-h-none max-sm:rounded-none max-sm:top-0 max-sm:translate-y-0 max-sm:border-none flex flex-col z-[100]">
        <DialogHeader className="p-4 sm:p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-2.5 bg-muted rounded-lg">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-2xl font-bold tracking-tight">Энциклопедия товара</DialogTitle>
              <p className="text-[10px] sm:text-sm text-muted-foreground mt-0.5">База знаний Sitiy Han v2.0</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden h-full flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-64 bg-muted/20 border-r flex-shrink-0 hidden md:block">
            <div className="p-4 space-y-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left",
                    activeSection === section.id 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <section.icon className="w-4 h-4 shrink-0" />
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Tab Icons */}
          <div className="flex md:hidden border-b bg-muted/10 p-2 overflow-x-auto gap-2 no-scrollbar">
             {SECTIONS.map((section) => (
                <Button
                    key={section.id}
                    size="sm"
                    variant={activeSection === section.id ? "default" : "ghost"}
                    onClick={() => setActiveSection(section.id)}
                    className="shrink-0 rounded-lg h-10"
                >
                    <section.icon className="w-4 h-4 mr-2" />
                    <span className="text-xs font-bold">{section.title}</span>
                </Button>
             ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-background overflow-hidden relative flex flex-col min-h-0">
            <ScrollArea className="flex-1">
              <div className="sm:p-10 p-5 max-sm:pb-32">
                {SECTIONS.find(s => s.id === activeSection)?.content}
                
                <div className="mt-10 sm:mt-20 pt-8 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                    <Layers className="w-3.5 h-3.5 sm:w-4 h-4" />
                    <span>Сити Хан Intelligence</span>
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground font-medium italic">2026</div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
