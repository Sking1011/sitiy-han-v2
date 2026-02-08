# Подробная схема базы данных (PostgreSQL)

## Таблицы и Поля

### 1. `User` (Пользователи)
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String (Unique)
- `passwordHash`: String
- `role`: Enum (ADMIN, DIRECTOR, OPERATOR, ACCOUNTANT)
- `createdAt`: DateTime

### 2. `Category` (Категории и Подкатегории)
- `id`: UUID (Primary Key)
- `name`: String (напр. "Птица", "Специи")
- `parentId`: UUID (Self-relation для подкатегорий: "Птица" -> "Курица" -> "Ножки")
- `type`: Enum (STOCK, EXPENSE)
- `color`: String (HEX code для UI, напр. "#FF5733")

### 3. `Product` (Товары и Ингредиенты)
- `id`: UUID (Primary Key)
- `categoryId`: UUID (Foreign Key)
- `name`: String (напр. "Куриная грудка", "Соль поваренная")
- `unit`: Enum (KG, PIECE, LITER, PACK)
- `minStock`: Decimal (Уровень для уведомления о нехватке)
- `currentStock`: Decimal (Текущий остаток)
- `averagePurchasePrice`: Decimal (Средняя цена закупа для расчета себестоимости)
- `image`: String (URL картинки/иконки - опционально)

### 4. `Recipe` (Техкарты / Калькуляция)
- `id`: UUID (Primary Key)
- `productId`: UUID (Foreign Key -> Готовый продукт)
- `name`: String
- `description`: Text
- `expectedYield`: Decimal (Ожидаемый выход готового продукта в %, напр. 80% после копчения)

### 5. `RecipeIngredient` (Состав рецепта)
- `id`: UUID (Primary Key)
- `recipeId`: UUID (Foreign Key)
- `ingredientId`: UUID (Foreign Key -> Product)
- `quantity`: Decimal (Количество на единицу готового продукта)

### 6. `Procurement` (Закупки)
- `id`: UUID (Primary Key)
- `date`: DateTime
- `supplier`: String (Nullable)
- `totalAmount`: Decimal (Сумма в KZT)
- `status`: Enum (COMPLETED, CANCELLED)

### 7. `ProcurementItem` (Позиции в закупке)
- `id`: UUID (Primary Key)
- `procurementId`: UUID (Foreign Key)
- `productId`: UUID (Foreign Key)
- `quantity`: Decimal
- `pricePerUnit`: Decimal (Цена в KZT)

### 8. `Production` (Производство / Акт выпуска)
- `id`: UUID (Primary Key)
- `date`: DateTime
- `status`: Enum (DRAFT, COMPLETED)
- `note`: String (Комментарий, напр. "Партия утренняя")
- `performedBy`: UUID (Кто произвел)

### 9. `ProductionItem` (Результат - Готовая продукция)
- `id`: UUID (Primary Key)
- `productionId`: UUID (Foreign Key)
- `productId`: UUID (Foreign Key -> Готовый продукт)
- `quantityProduced`: Decimal (Сколько произвели)
- `calculatedCostPerUnit`: Decimal (Себестоимость единицы)

### 9.1 `ProductionMaterial` (Расход - Ингредиенты)
- `id`: UUID (Primary Key)
- `productionId`: UUID (Foreign Key)
- `productId`: UUID (Сырье)
- `quantityUsed`: Decimal (Фактический расход, может отличаться от рецепта)

### 10. `Sale` (Продажи)
- `id`: UUID (Primary Key)
- `date`: DateTime
- `totalRevenue`: Decimal (Выручка в KZT)
- `customer`: String (Nullable)

### 11. `SaleItem` (Позиции в продаже)
- `id`: UUID (Primary Key)
- `saleId`: UUID (Foreign Key)
- `productId`: UUID (Foreign Key)
- `quantity`: Decimal
- `pricePerUnit`: Decimal (Цена реализации)

### 12. `Expense` (Дополнительные расходы)
- `id`: UUID (Primary Key)
- `categoryId`: UUID (Foreign Key)
- `amount`: Decimal (KZT)
- `description`: String
- `date`: DateTime

### 14. `SystemSetting` (Глобальные настройки)
- `key`: String (Primary Key, напр. "TAX_RATE_PERCENT")
- `value`: String (напр. "6")
- `description`: String

## Изменения в существующих таблицах

### 6. `Procurement` (Закупки)
- ... (существующие поля)
- `paymentSource`: Enum (BUSINESS_CASH, PERSONAL_FUNDS) — *Новое поле*
- `isExpensed`: Boolean (Учитывать ли в расходах, по умолчанию True)

### 12. `Expense` (Дополнительные расходы и Прочее)
- `id`: UUID (Primary Key)
- `categoryId`: UUID (Foreign Key -> Категория "Хозтовары", "Аренда")
- `name`: String (Произвольное название, напр. "Перчатки 3 пачки")
- `amount`: Decimal (Сумма)
- `paymentSource`: Enum (BUSINESS_CASH, PERSONAL_FUNDS) — *Новое поле*
- `date`: DateTime

## Логика расчетов (Бизнес-информация)

1. **Свободные деньги (Free Cash):**
   - `Выручка`
   - МИНУС `Закупки` (где `paymentSource` = BUSINESS_CASH)
   - МИНУС `Расходы` (где `paymentSource` = BUSINESS_CASH).
   *Покупки за личные деньги НЕ уменьшают Free Cash в системе.*

2. **Прибыль (Net Profit):**
   - `Выручка`
   - МИНУС `Себестоимость продаж`
   - МИНУС `Все Расходы` (включая оплаченные лично, т.к. это расходы бизнеса).

3. **Налоги:**
   - `EBITDA` (Прибыль до налогов) = Выручка - Себестоимость - Расходы.
   - `TaxAmount` = EBITDA * (TAX_RATE / 100).
   - `NetIncome` (Чистая прибыль после налогов) = EBITDA - TaxAmount.
   - **Закуп:** `+Сырье` (растет остаток мяса).
   - **Производство:** `-Сырье` (по таблице ProductionMaterial) -> `+Готовая Продукция` (по ProductionItem).
   - **Продажа:** `-Готовая Продукция`.

2. **Себестоимость (COGS):**
   - Считается в момент **Производства**. Система берет текущую цену ингредиентов из `ProductionMaterial` и делит на объем `ProductionItem`.

3. **Чистая прибыль:** `Выручка с Продаж` - `Себестоимость Проданного` - `Expenses`.