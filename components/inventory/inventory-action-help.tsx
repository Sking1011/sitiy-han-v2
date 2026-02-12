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
    title: "Описание варки",
    icon: ClipboardList,
    content: (
      <div className="space-y-10">
        <div className="space-y-4">
            <h3 className="text-4xl font-bold tracking-tight text-primary">Паспорт варки</h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Детальный цифровой документ, фиксирующий "генетический код" конкретной партии продукта в момент её создания.</p>
                <p><b>Зачем нужно:</b> Для обеспечения 100% прослеживаемости качества по стандарту HACCP и глубокого анализа производственной эффективности.</p>
                <p><b>Как работает:</b> При завершении варки система "замораживает" текущие цены сырья, веса и тайминги, создавая нередактируемый архив данных для этой партии.</p>
            </div>
        </div>
        
        <div className="grid gap-8">
          <div className="p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-6">
            <h4 className="text-xl font-bold flex items-center gap-3 text-primary">
                <Calculator className="w-6 h-6" /> Математика выхода (Yield)
            </h4>
            <div className="space-y-4">
                <div className="bg-background p-6 rounded-2xl border border-border font-mono text-sm shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 bg-primary/5 text-[10px] font-black uppercase">Core Formula</div>
                    <code className="text-primary font-bold text-lg">Yield % = (Final_W / Initial_W) * 100</code>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p><b>Initial_W:</b> Сумма всех компонентов (мясо + добавки). Это база ваших затрат.</p>
                    <p><b>Final_W:</b> Вес готового продукта. Это база вашей выручки.</p>
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 italic">
                        <b>Пример:</b> Загрузили 32 кг, получили 25 кг. <br/>
                        ((32 - 25) / 32) * 100 = <b>21.8%</b> потерянного веса. Если этот процент растет от партии к партии — пора проверить оборудование или рецептуру.
                    </div>
                </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-4">
            <h4 className="text-xl font-bold flex items-center gap-3 text-primary">
                <Layers className="w-6 h-6" /> Прослеживаемость сырья
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
                В таблице состава указаны не просто названия, а <b>ссылки на конкретные закупы</b>. Если через месяц возникнет вопрос к качеству, вы увидите, от какого поставщика было мясо именно в этой палке колбасы.
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
      <div className="space-y-10">
        <div className="space-y-4">
            <h3 className="text-4xl font-bold tracking-tight text-primary">Архитектура партий</h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Метод раздельного хранения товара на складе, где каждая поставка или варка — это независимая единица учета.</p>
                <p><b>Зачем нужно:</b> Чтобы видеть реальную маржинальность. Разные партии имеют разную себестоимость из-за колебаний цен на рынке и разной усушки.</p>
                <p><b>Как работает:</b> Система не "сваливает" всё в одну кучу, а создает уникальный ID для каждого прихода, позволяя списывать вес точечно.</p>
            </div>
        </div>
        
        <div className="space-y-6">
            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-4">
                <h4 className="font-bold text-primary flex items-center gap-2">
                    <Info className="w-5 h-5" /> Проблема "Котлового учета"
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    Обычные системы (Excel) усредняют цену. Если вы купили мясо по 1850 и 2200, они скажут "средняя 2025". Но при продаже вы не узнаете, сработали вы в плюс или в минус по конкретной сделке. Партии Sitiy Han показывают <b>правду</b>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-2xl bg-muted/20 space-y-3">
                    <p className="font-bold text-sm uppercase tracking-tighter text-primary flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Принцип FIFO
                    </p>
                    <p className="text-xs text-muted-foreground"><b>First In, First Out.</b> Автоматическое предложение использовать сначала самое старое сырье для минимизации риска порчи.</p>
                </div>
                <div className="p-6 border rounded-2xl bg-muted/20 space-y-3">
                    <p className="font-bold text-sm uppercase tracking-tighter text-primary flex items-center gap-2">
                        <User className="w-4 h-4" /> Specific ID
                    </p>
                    <p className="text-xs text-muted-foreground">Ручной выбор конкретной партии оператором в обход очереди, если этого требует технология или заказчик.</p>
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
      <div className="space-y-10">
        <div className="space-y-4">
            <h3 className="text-4xl font-bold tracking-tight text-primary">Хронология событий</h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Непрерывная лента всех манипуляций, совершенных с товаром или конкретной партией.</p>
                <p><b>Зачем нужно:</b> Для финансового аудита, предотвращения ошибок и прозрачности ответственности персонала.</p>
                <p><b>Как работает:</b> Каждое действие в системе оставляет "цифровой отпечаток" с указанием типа операции, веса, времени и исполнителя.</p>
            </div>
        </div>
        
        <div className="grid gap-3">
            {[
                { type: "Закуп (PROCUREMENT)", desc: "Внешнее поступление. Увеличивает задолженность и складские остатки.", icon: ShoppingCart, color: "bg-green-100 text-green-700" },
                { type: "Выпуск (PRODUCTION_OUTPUT)", desc: "Результат варки. Трансформация сырья в готовый продукт.", icon: CheckCircle2, color: "bg-blue-100 text-blue-700" },
                { type: "Расход (PRODUCTION_USAGE)", desc: "Списание сырья на производство. Уменьшает остаток партии.", icon: Layers, color: "bg-orange-100 text-orange-700" },
                { type: "Слияние (MERGE)", desc: "Бухгалтерский перенос веса между партиями без изменения общего итога.", icon: GitMerge, color: "bg-purple-100 text-purple-700" },
                { type: "Списание (DISPOSAL)", desc: "Чистый убыток предприятия. Безвозвратная потеря материальной ценности.", icon: Trash2, color: "bg-red-100 text-red-700" }
            ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl border bg-muted/5 flex gap-5 items-start">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm", item.color)}>
                        <item.icon className="w-6 h-6"/>
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-base">{item.type}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
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
      <div className="space-y-10">
        <div className="space-y-4">
            <h3 className="text-4xl font-bold tracking-tight text-primary">Интеллектуальное слияние</h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Инструмент объединения остатков (например, 2 кг старой варки и 10 кг новой) в одну учетную карточку.</p>
                <p><b>Зачем нужно:</b> Для наведения порядка на складе и устранения "хвостов", которые мешают оперативной работе.</p>
                <p><b>Как работает:</b> Система суммирует общую стоимость всех объединяемых частей и вычисляет новую справедливую цену закупа.</p>
            </div>
        </div>
        
        <div className="p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-6">
          <h4 className="text-xl font-bold flex items-center gap-3 text-primary">
            <Calculator className="w-6 h-6" /> Формула средневзвешенной цены
          </h4>
          <div className="space-y-4">
            <div className="bg-background p-6 rounded-2xl border border-border font-mono text-sm leading-relaxed shadow-inner">
                <p className="text-[10px] uppercase text-muted-foreground mb-2">Алгоритм пересчета:</p>
                <code className="text-primary font-bold text-lg">P_new = (Q1*P1 + Q2*P2) / (Q1+Q2)</code>
            </div>
            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-3 text-xs leading-relaxed">
                <p className="font-bold text-primary">Пример для бухгалтерии:</p>
                <p>Партия 1: 5 кг по 2000 ₸ (Стоимость: 10 000 ₸)</p>
                <p>Партия 2: 15 кг по 2500 ₸ (Стоимость: 37 500 ₸)</p>
                <div className="pt-2 border-t border-primary/10">
                    <p>Общая стоимость: 47 500 ₸. Итоговый вес: 20 кг.</p>
                    <p className="font-bold">Новая цена партии в системе: 2 375 ₸/кг.</p>
                </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-muted/10 space-y-2">
                <h5 className="font-bold text-sm">Кросс-продуктовое слияние</h5>
                <p className="text-xs text-muted-foreground">Можно сливать разные товары внутри одной категории (напр. "Обрезь" в "Фарш"), если они имеют одинаковую ценность для производства.</p>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-muted/10 space-y-2">
                <h5 className="font-bold text-sm">Проверка категорий</h5>
                <p className="text-xs text-muted-foreground">Система заблокирует слияние товаров из разных категорий (напр. Специи и Мясо) для защиты от ошибок учета.</p>
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
      <div className="space-y-10">
        <div className="space-y-4">
            <h3 className="text-4xl font-bold tracking-tight text-primary">Управление потерями</h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Регистрация безвозвратной потери товара (порча, брак, списание на образцы).</p>
                <p><b>Зачем нужно:</b> Для поддержания актуальности склада и корректного формирования отчета о прибылях и убытках.</p>
                <p><b>Как работает:</b> Вес вычитается из конкретной партии, а стоимость этого веса записывается в операционные расходы предприятия.</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 border rounded-3xl bg-muted/20 space-y-4">
            <div className="w-12 h-12 bg-background rounded-2xl border flex items-center justify-center"><Info className="w-6 h-6 text-blue-500"/></div>
            <div className="space-y-2">
                <p className="font-bold">Влияние на Net Profit</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Списанный товар не просто исчезает — он напрямую уменьшает вашу чистую прибыль. Каждый кг брака требует продажи 3-5 кг нормального товара для компенсации убытка.</p>
            </div>
          </div>
          <div className="p-8 border rounded-3xl bg-muted/20 space-y-4">
            <div className="w-12 h-12 bg-background rounded-2xl border flex items-center justify-center"><User className="w-6 h-6 text-orange-500"/></div>
            <div className="space-y-2">
                <p className="font-bold">Анализ причин</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Классификация (Брак/Порча/Дегустация) помогает выявить системные ошибки в техпроцессе или условиях хранения на складе.</p>
            </div>
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
      <div className="space-y-10">
        <div className="space-y-4">
            <h3 className="text-4xl font-bold tracking-tight text-primary">Приемка сырья</h3>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p><b>Что это:</b> Процесс превращения денежных средств компании в материальные запасы на складе.</p>
                <p><b>Зачем нужно:</b> Учет входящих цен — это фундамент для расчета всей дальнейшей экономики производства.</p>
                <p><b>Как работает:</b> Вы вносите данные из накладной, система создает новую партию и фиксирует "входную" себестоимость.</p>
            </div>
        </div>
        
        <div className="space-y-8">
            <div className="p-8 rounded-3xl border bg-muted/30 space-y-6">
                <h4 className="text-xl font-bold text-primary flex items-center gap-3">
                    <ScrollText className="w-6 h-6" /> Режимы ввода цен
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-background rounded-2xl border space-y-2">
                        <p className="font-bold text-sm">Цена за единицу</p>
                        <p className="text-xs text-muted-foreground">Классический ввод стоимости за 1 кг. Система умножит её на вес для бухгалтерии.</p>
                    </div>
                    <div className="p-6 bg-background rounded-2xl border space-y-2">
                        <p className="font-bold text-sm">Общая сумма</p>
                        <p className="text-xs text-muted-foreground">Ввод итоговой суммы из чека. Система сама вычислит точную цену за единицу (Total / Quantity).</p>
                    </div>
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
          className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1000px] p-0 gap-0 overflow-hidden sm:rounded-xl border bg-background h-[750px] max-h-[90vh] flex flex-col z-[100]">
        <DialogHeader className="p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-muted rounded-lg">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Энциклопедия управления товаром</DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">База знаний Sitiy Han v2.0</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden h-full">
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
          <div className="flex-1 bg-background overflow-hidden relative">
            <ScrollArea className="h-full">
              <div className="p-10 max-sm:p-6">
                {SECTIONS.find(s => s.id === activeSection)?.content}
                
                <div className="mt-20 pt-8 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em]">
                    <Layers className="w-4 h-4" />
                    <span>Сити Хан Intelligence</span>
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