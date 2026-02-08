# Структура проекта (File Structure)

```text
/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Группа маршрутов авторизации
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/        # Основной интерфейс
│   │   ├── layout.tsx      # Общий лейаут с навигацией
│   │   ├── page.tsx        # Главная (Обзор/Диаграммы)
│   │   ├── inventory/      # Склад
│   │   ├── procurement/    # Закупки
│   │   ├── sales/          # Продажи
│   │   ├── recipes/        # Калькуляция
│   │   └── settings/       # Настройки (категории, профиль)
│   ├── api/                # API эндпоинты
│   └── globals.css
├── components/             # UI компоненты (атомарные)
│   ├── ui/                 # Shadcn компоненты
│   ├── forms/              # Формы (закуп, продажа)
│   ├── charts/             # Диаграммы (Recharts)
│   └── layout/             # Компоненты разметки
├── hooks/                  # Кастомные React хуки
├── lib/                    # Утилиты, инициализация БД (Prisma/Drizzle)
├── services/               # Бизнес-логика (Server Actions)
├── store/                  # Управление стейтом (Zustand/Context)
├── types/                  # TypeScript интерфейсы
├── docs/                   # Техническая документация
├── prisma/                 # Схема БД (если Prisma)
├── public/                 # Статические файлы
└── GEMINI.md               # Контекст для ИИ
```
