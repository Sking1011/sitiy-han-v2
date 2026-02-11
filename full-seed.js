const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Инициализация базы данных (Light Version) ---');

  // Хеш для пароля 'admin123' (сгенерирован заранее)
  const hashedPassword = '$2a$10$vI8tmv27ayJKt8LszKz5Duvz77XQSi3R9cH97Ksh9T6.T.vQJtgh2';

  // 1. Создание Администратора
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      username: 'admin',
      email: 'admin@sitiyhan.kz',
      name: 'Администратор',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Пользователь admin готов');

  // 2. Создание категорий склада
  const stockCategories = [
    { name: 'Птица', color: '#FFD700', id: 'stock-poultry' },
    { name: 'Мясо', color: '#FF4500', id: 'stock-meat' },
    { name: 'Специи', color: '#8B4513', id: 'stock-spices' },
    { name: 'Упаковка', color: '#4682B4', id: 'stock-packing' },
    { name: 'Готовая продукция', color: '#32CD32', id: 'stock-ready' },
  ];

  for (const cat of stockCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, color: cat.color },
      create: {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        type: 'STOCK',
      },
    });
  }
  console.log('✅ Категории склада созданы');

  // 3. Создание категорий расходов
  const expenseCategories = [
    { name: 'Аренда', color: '#A9A9A9', id: 'exp-rent' },
    { name: 'Коммунальные', color: '#00CED1', id: 'exp-utilities' },
    { name: 'Зарплата', color: '#FF69B4', id: 'exp-salary' },
    { name: 'Хозтовары', color: '#778899', id: 'exp-household' },
  ];

  for (const cat of expenseCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, color: cat.color },
      create: {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        type: 'EXPENSE',
      },
    });
  }
  console.log('✅ Категории расходов созданы');

  // 4. Системные настройки
  await prisma.systemSetting.upsert({
    where: { key: 'TAX_RATE_PERCENT' },
    update: {},
    create: {
      key: 'TAX_RATE_PERCENT',
      value: '6',
      description: 'Ставка налога в процентах',
    },
  });
  
  console.log('✅ Настройки инициализированы');
  console.log('--- Сидинг успешно завершен! ---');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при сидинге:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });