import { Zap, Calculator, Smartphone, XCircle, CheckCircle2, Factory, Truck, BarChart3, ShieldCheck, Globe, Users, Database, Rocket, Target, Heart } from "lucide-react";
import { WikiArticle } from "../types";
import { cn } from "@/lib/utils";

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", className)}>
    {children}
  </span>
);

export const gettingStarted: WikiArticle = {
  id: "getting-started",
  categoryId: "basics",
  title: "Введение в Sitiy Han CRM",
  content: "Техническое руководство по работе с ERP системой. Принципы автоматизации, партионный учет и мобильное управление.",
  render: () => (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 md:p-12 border border-primary/20 shadow-inner">
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="bg-primary text-primary-foreground mb-4">Документация системы</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            Автоматизация <br />
            <span className="text-primary">производственного учета</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Система <strong>Sitiy Han</strong> автоматизирует полный цикл производства мясных деликатесов: от закупа сырья по партиям до калькуляции себестоимости и контроля остатков на складе.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="w-5 h-5 text-blue-500" />
              SQL архитектура
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Партионный контроль
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              Точная аналитика
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Logic comparison Section */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Механика работы</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Сравнение ручного учета и алгоритмов автоматизации системы.</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="group space-y-4 p-8 rounded-3xl bg-red-500/[0.02] border border-red-500/10 transition-all shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 mb-2">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold flex items-center gap-2">Проблемы ручного учета</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span><strong>Фрагментация данных:</strong> информация о закупе, остатках и варках хранится в разных таблицах или записях.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span><span><strong>Усредненная себестоимость:</strong> невозможно точно рассчитать прибыль, когда цена сырья постоянно меняется.</span></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span><strong>Потеря прослеживаемости:</strong> отсутствие связи между партией сырья и партией готового продукта.</span>
              </li>
            </ul>
          </div>

          <div className="group space-y-4 p-8 rounded-3xl bg-green-500/[0.02] border border-green-500/10 transition-all shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold flex items-center gap-2">Решение Sitiy Han</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                <span><strong>Единый реестр партий:</strong> каждое поступление товара получает уникальный ID, цену и фиксированные характеристики.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                <span><strong>Алгоритм FIFO:</strong> автоматическое списание наиболее ранних запасов для защиты маржинальности.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                <span><strong>Технологические карты:</strong> автоматический пересчет веса с учетом процента ужарки и потерь.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Functional Pillars */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight border-b pb-4">Функциональные возможности</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="p-8 border rounded-3xl bg-card hover:shadow-xl transition-all relative group overflow-hidden">
            <Zap className="w-12 h-12 text-yellow-500 mb-6" />
            <h4 className="text-xl font-bold mb-3">Оптимизация ввода</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Интерфейс спроектирован для быстрого внесения данных. Закуп и запуск варки выполняются за минимальное количество действий.
            </p>
          </div>
          <div className="p-8 border rounded-3xl bg-card hover:shadow-xl transition-all relative group overflow-hidden">
            <Calculator className="w-12 h-12 text-blue-500 mb-6" />
            <h4 className="text-xl font-bold mb-3">Точность расчетов</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Учет идет до граммов и тиынов. Система фиксирует реальные затраты на специи, оболочку и основное сырье.
            </p>
          </div>
          <div className="p-8 border rounded-3xl bg-card hover:shadow-xl transition-all relative group overflow-hidden">
            <Smartphone className="w-12 h-12 text-purple-500 mb-6" />
            <h4 className="text-xl font-bold mb-3">Мобильный доступ</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Веб-приложение полностью адаптировано под смартфоны. Учет в цеху ведется без использования ПК.
            </p>
          </div>
        </div>
      </div>

      {/* Implementation Roadmap */}
      <div className="space-y-8 bg-muted/30 rounded-3xl p-8 md:p-12 border">
        <h2 className="text-3xl font-bold tracking-tight">Этапы внедрения учета</h2>
        <div className="space-y-12">
          {[
            { 
              step: "01", 
              title: "Формирование справочников", 
              desc: "Ввод категорий, товаров и ингредиентов. Настройка рецептур с параметрами потерь при производстве.",
              icon: Database,
              color: "text-blue-500"
            },
            { 
              step: "02", 
              title: "Поступление и партионирование", 
              desc: "Регистрация закупок. Каждая позиция в накладной становится отдельной партией с собственной ценой.",
              icon: Truck,
              color: "text-orange-500"
            },
            { 
              step: "03", 
              title: "Производственный цикл", 
              desc: "Списание сырья (FIFO или ручной выбор), фиксация выхода готовой продукции, контроль ужарки.",
              icon: Factory,
              color: "text-green-500"
            },
            { 
              step: "04", 
              title: "Финансовый контроль", 
              desc: "Анализ себестоимости реализованной продукции и расчет чистой прибыли на основе реальных затрат.",
              icon: BarChart3,
              color: "text-primary"
            }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-6 relative">
              {idx < 3 && <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-border -mb-12" />}
              <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center shrink-0 z-10 font-black text-primary">
                {item.step}
              </div>
              <div className="space-y-2 pt-1">
                <h4 className="text-xl font-bold flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5", item.color)} />
                  {item.title}
                </h4>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Action */}
      <div className="bg-primary rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 text-primary-foreground shadow-2xl">
        <div className="space-y-6 text-center md:text-left max-w-xl">
          <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Приступайте к <span className="underline decoration-white/30 underline-offset-8">настройке</span>
          </h3>
          <p className="text-lg opacity-80">
            Начните с заполнения категорий в разделе "Склад" или создайте первый рецепт для автоматизации калькуляций.
          </p>
        </div>
        <div className="px-10 py-5 rounded-2xl bg-background text-foreground font-black text-lg shadow-xl hover:scale-105 transition-transform active:scale-95 flex items-center gap-3">
          <Rocket className="w-6 h-6 text-primary" />
          В консоль
        </div>
      </div>
    </div>
  )
};
