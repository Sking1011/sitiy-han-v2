# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sitiy Han** — ERP-система для учета производства копченых деликатесов в Казахстане. Язык интерфейса — русский, валюта — KZT. Mobile-first (80% использования с телефона). Цель — заменить Excel удобным веб-приложением.

**Текущий статус:** Проект на стадии планирования. Документация и Docker-инфраструктура готовы, код ещё не реализован. План реализации — в `todo.md`.

## Tech Stack

- **Framework:** Next.js (App Router), TypeScript (strict, без `any`)
- **Database:** PostgreSQL 15 + Prisma ORM
- **Styling:** Tailwind CSS + Shadcn UI
- **State:** React Context / TanStack Query
- **Auth:** NextAuth.js (4 роли: ADMIN, DIRECTOR, OPERATOR, ACCOUNTANT)
- **Numbers:** `decimal.js` для всех финансовых и весовых вычислений (не float)
- **Export:** `xlsx` для Excel-экспорта
- **Infra:** Docker, Docker Compose

## Build & Run Commands

```bash
# Start database and app via Docker
docker-compose up -d

# Database (after Prisma schema is created)
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Development
npm run dev          # http://localhost:3000

# Build
npm run build
```

## Architecture

### Service Layer Pattern (critical)

All business logic lives in `services/`. API routes only validate input and call services. Services return complete operation data. This pattern exists to support future Telegram Bot integration via Event Bus.

```
app/api/          → validation only, calls services
services/         → business logic, returns full operation data
lib/              → utilities, DB client, helpers
store/            → client-side state management
types/            → shared TypeScript interfaces
hooks/            → custom React hooks
components/       → UI components (Shadcn-based)
```

### Routing (Next.js App Router)

```
app/(auth)/login, register     — авторизация
app/(dashboard)/               — основные страницы
  inventory/                   — склад
  procurement/                 — закупки
  recipes/                     — калькуляция/рецепты
  sales/                       — продажи
  settings/                    — настройки
app/api/                       — API endpoints
```

### Database — 14 Tables

Схема описана в `docs/04_db_schema.md`. Ключевые таблицы: User, Category (self-referential для подкатегорий), Product, Recipe, RecipeIngredient, Procurement, ProcurementItem, Production, ProductionItem, ProductionMaterial, Sale, SaleItem, Expense, SystemSetting.

**Движение товара:** Закупка → +сырьё | Производство → −сырьё, +готовая продукция | Продажа → −готовая продукция.

## Key Rules

1. **Файлы < 700 строк.** 1000+ — нарушение архитектуры. Декомпозируй на компоненты и хуки.
2. **Транзакции обязательны:** Все операции со складом (Закупка, Продажа, Производство) — только через `Prisma.$transaction`.
3. **Неизменяемость документов:** Завершённые документы (Закупка, Производство, Продажа) нельзя редактировать. Для исправлений — документы-коррекции.
4. **Источник оплаты:** Закупки и расходы имеют поле `paymentSource` (BUSINESS_CASH / PERSONAL_FUNDS). Личные средства не уменьшают «свободные деньги», но учитываются в расходах.
5. **Умные единицы:** Автоконвертация КГ↔Г, Л↔МЛ. Значения < 1 отображаются в мелких единицах (0.4 кг → 400 г). Хранение всегда в базовых единицах.
6. **Роли (RBAC):** Оператор не видит финансов, перенаправляется на `/production`. Бухгалтер видит только отчёты. Доступ к UI контролируется компонентом `<RoleGuard>`.

## Financial Formulas

- **Свободные деньги** = Выручка − Закупки(BUSINESS_CASH) − Расходы(BUSINESS_CASH)
- **Чистая прибыль** = Выручка − Себестоимость − Все расходы
- **EBITDA** = Выручка − Себестоимость − Расходы; Налог = EBITDA × TAX_RATE%; Чистый доход = EBITDA − Налог

## UI/UX Guidelines

- **Mobile-first:** Карточки вместо таблиц на мобильных. Нижняя навигация с FAB-кнопкой [+] для быстрых действий.
- **Workshop Mode (Режим цеха):** Крупный шрифт, чекбоксы ингредиентов, Wake Lock (экран не гаснет).
- **Стиль:** Минимализм, светлые тона, поддержка тёмной темы. Shadcn UI для консистентности.
- **Адаптивный интерфейс по ролям:** Оператор видит только склад и производство без цен.

## Documentation Reference

Полная документация — в папке `docs/`:
- `01_business_logic.md` — бизнес-логика и модули
- `02_functional_specs.md` — функциональные спецификации
- `03_tech_stack.md` — стек и правила разработки
- `04_db_schema.md` — схема БД (14 таблиц, формулы, движение товара)
- `05_ui_ux_guide.md` — дизайн-система, мобильный UX, роли в UI
- `06_file_structure.md` — файловая структура проекта
- `07_roles_and_security.md` — роли, права доступа, аудит-логи
