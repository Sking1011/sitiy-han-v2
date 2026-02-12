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
  ChevronRight, 
  Scale, 
  Banknote, 
  Clock, 
  TrendingUp,
  Info,
  Layers,
  ShoppingBasket,
  Calculator
} from "lucide-react"
import { cn } from "@/lib/utils"

const SECTIONS = [
  {
    id: "batches",
    title: "Партии и Себестоимость",
    icon: Layers,
    content: (
      <div className="space-y-6">
        <h3 className="text-3xl font-black text-primary tracking-tight">Система партий</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          В Сити Хан v2.0 мы внедрили <b>попарный учет</b>. Это значит, что каждый закуп мяса — это отдельная "партия" со своей ценой.
        </p>
        
        <div className="grid gap-4">
          <div className="p-6 rounded-2xl bg-muted/50 border border-border">
            <h4 className="text-lg font-bold mb-2">Зачем выбирать партию?</h4>
            <p className="text-sm text-muted-foreground">
              Цены на рынке меняются. Сегодня вы купили говядину по 1800 тг, а завтра по 2000 тг. 
              Выбирая конкретную партию при производстве, вы получаете <b>честную себестоимость</b> именно этой кастрюли или батона колбасы.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
            <h4 className="text-lg font-bold text-primary mb-2">Как это работает?</h4>
            <ul className="text-sm space-y-2 list-disc pl-4 text-muted-foreground">
              <li>При закупке создается новая партия.</li>
              <li>В производстве вы выбираете, из какой партии берете мясо.</li>
              <li>Система списывает вес именно с этой партии.</li>
              <li>Когда партия заканчивается, она исчезает из списка выбора.</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "weights",
    title: "Вес и Усушка",
    icon: Scale,
    content: (
      <div className="space-y-6">
        <h3 className="text-3xl font-black text-primary tracking-tight">Подсчёт веса</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Точный учет веса — это основа прибыльности. В системе Сити Хан мы различаем два типа начального веса:
        </p>
        
        <div className="grid gap-4">
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30">
            <h4 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">1. Расчетный вес</h4>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Это математическая сумма всех ингредиентов по рецепту. Например: 30кг мяса + 0.5кг специй + 2кг льда = <b>32.500кг</b>. Система подставляет это число автоматически.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30">
            <h4 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">2. Фактический вес (замес)</h4>
            <p className="text-sm text-amber-800 dark:text-amber-400">
              Если после замешивания вы взвесили готовый фарш (вместе со всеми специями и добавками) и получили другое число — внесите его вручную. <b>Это число станет точкой отсчета для всей экономики партии.</b>
            </p>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <h4 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="text-red-500" /> Усушка и её влияние
          </h4>
          <p className="text-base text-muted-foreground">
            Разница между весом "До" и весом "После" — это ваша усушка. 
            <br/><br/>
            <span className="p-2 bg-red-100 text-red-700 rounded font-bold">Важно:</span> Чем больше воды или веса ушло при копчении, тем меньше килограмм готовой продукции вы получите. При этом <b>все затраты</b> на 30кг мяса распределятся на оставшиеся, например, 25кг. Это мгновенно поднимает себестоимость 1 кг готового продукта.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "meat-prices",
    title: "Цены на сырье",
    icon: ShoppingBasket,
    content: (
      <div className="space-y-6">
        <h3 className="text-3xl font-black text-primary tracking-tight">Откуда берутся цены?</h3>
        <p className="text-lg text-muted-foreground">
          Система Сити Хан автоматически следит за рынком ваших закупок.
        </p>
        
        <div className="space-y-4">
          <div className="relative pl-8 border-l-4 border-primary/20 space-y-6 py-2">
            <div className="space-y-1">
              <div className="absolute -left-[14px] top-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">1</div>
              <h4 className="font-bold text-xl">Закуп (Страница "Закупки")</h4>
              <p className="text-sm text-muted-foreground font-medium">Когда вы вносите новый закуп мяса, вы указываете цену поставщика (например, 4000 тг).</p>
            </div>
            
            <div className="space-y-1">
              <div className="absolute -left-[14px] top-[108px] w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">2</div>
              <h4 className="font-bold text-xl">Склад и Усреднение</h4>
              <p className="text-sm text-muted-foreground font-medium">Если на складе уже было мясо по 3700 тг, система смешает его с новым по 4000 тг и вычислит <b>Средневзвешенную цену</b>.</p>
            </div>

            <div className="space-y-1">
              <div className="absolute -left-[14px] top-[214px] w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">3</div>
              <h4 className="font-bold text-xl">Производство</h4>
              <p className="text-sm text-muted-foreground font-medium">В момент нажатия "Начать производство", система фиксирует текущую среднюю цену со склада и "замораживает" её в этой партии.</p>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
          <p className="text-sm font-bold leading-relaxed italic">
            "Таким образом, цена на вес мясной продукции — это не случайное число, а точное отражение ваших реальных трат на закуп сырья."
          </p>
        </div>
      </div>
    )
  },
  {
    id: "economy",
    title: "Математика прибыли",
    icon: Calculator,
    content: (
      <div className="space-y-6">
        <h3 className="text-3xl font-bold tracking-tight">Как считается доход?</h3>
        
        <div className="bg-muted/50 p-8 rounded-2xl border space-y-6 font-mono">
          <div className="space-y-2 border-b pb-4 border-border/50">
            <p className="text-[10px] uppercase text-muted-foreground font-black">Шаг 1: Выручка</p>
            <div className="flex justify-between text-lg">
              <span>Вес готовый × Цена продажи</span>
              <span className="text-green-600 font-bold">ДОХОД</span>
            </div>
          </div>

          <div className="space-y-2 border-b pb-4 border-border/50">
            <p className="text-[10px] uppercase text-muted-foreground font-black">Шаг 2: Затраты</p>
            <div className="flex justify-between text-lg text-red-500">
              <span>Партии мяса + Ингредиенты</span>
              <span className="font-bold">РАСХОД</span>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-xl font-bold">ЧИСТАЯ ПРИБЫЛЬ</span>
            <div className="text-2xl font-bold bg-green-600 text-white px-4 py-1 rounded-lg">ИТОГО</div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h4 className="text-xl font-bold flex items-center gap-2">Зачем устанавливать Цену Продажи?</h4>
          <p className="text-base text-muted-foreground leading-relaxed">
            На странице <b>Склад</b> для готовой продукции нужно заранее указать розничную цену. 
            Только тогда система сможет в реальном времени (еще до окончания готовки!) показать вам, сколько вы заработаете на этой партии.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "timing",
    title: "Зачем нужно время?",
    icon: Clock,
    content: (
      <div className="space-y-6">
        <h3 className="text-3xl font-black text-primary tracking-tight">Контроль времени</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Заполнение этапов (Подготовка, Сушка, Копчение, Варка) в минутах преследует три цели:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 border rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
            <p className="font-bold text-sm">Аналитика поваров</p>
            <p className="text-[11px] text-muted-foreground">Кто готовит быстрее без потери качества?</p>
          </div>
          <div className="p-5 border rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">2</div>
            <p className="font-bold text-sm">Золотой стандарт</p>
            <p className="text-[11px] text-muted-foreground">Вывод идеального времени для каждого рецепта.</p>
          </div>
          <div className="p-5 border rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">3</div>
            <p className="font-bold text-sm">Планирование</p>
            <p className="text-[11px] text-muted-foreground">Система поймет нагрузку цеха и занятость камер.</p>
          </div>
        </div>
      </div>
    )
  }
]

export function ProductionHelp() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-12 w-12 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-md group"
        >
          <HelpCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1100px] p-0 gap-0 overflow-hidden sm:rounded-xl border bg-background h-[750px] max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-muted rounded-lg">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Справочник Базы Знаний</DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Экономика и процессы Сити Хан v2.0</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden h-full">
          {/* Sidebar */}
          <div className="w-80 bg-muted/20 border-r flex-shrink-0 hidden md:block">
            <div className="p-4 space-y-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
                    activeSection === section.id 
                      ? "bg-primary text-primary-foreground" 
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
          <div className="flex-1 bg-background overflow-hidden relative">
            <ScrollArea className="h-full">
              <div className="p-12 max-sm:p-8">
                {SECTIONS.find(s => s.id === activeSection)?.content}
                
                <div className="mt-20 pt-8 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-black uppercase tracking-[0.3em]">
                    <Layers className="w-4 h-4" />
                    <span>Sytyi Han Intelligence</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium italic">Обновлено: 2026</div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}