const { PrismaClient } = require('@prisma/client');
// Попытаемся найти bcryptjs в путях Next.js standalone
let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  try {
    // В standalone режиме пути могут быть другими
    bcrypt = require('./node_modules/bcryptjs');
  } catch (e2) {
    console.error('❌ Не удалось найти bcryptjs. Используем упрощенный метод.');
  }
}

const prisma = new PrismaClient();

async function run() {
  const login = 'admin';
  const pass = 'admin123';

  console.log('--- Экстренная настройка авторизации ---');

  // Если bcrypt найден, генерируем хеш им
  let hash;
  if (bcrypt) {
    hash = await bcrypt.hash(pass, 10);
    console.log('✅ Хеш сгенерирован библиотекой bcryptjs');
  } else {
    // Если нет, используем заранее подготовленный хеш, 
    // но этот раз я взял самый простой и совместимый
    hash = '$2a$10$vI8tmv27ayJKt8LszKz5Duvz77XQSi3R9cH97Ksh9T6.T.vQJtgh2';
    console.log('⚠️ Используем предустановленный хеш');
  }

  const user = await prisma.user.upsert({
    where: { username: login },
    update: { passwordHash: hash },
    create: {
      username: login,
      name: 'Admin',
      passwordHash: hash,
      role: 'ADMIN'
    }
  });

  console.log('--- ПРОВЕРКА ДАННЫХ В БАЗЕ ---');
  console.log('ID:', user.id);
  console.log('Username:', user.username);
  console.log('Role:', user.role);
  console.log('Hash in DB:', user.passwordHash.substring(0, 15) + '...');
  
  console.log('
🚀 Теперь попробуйте войти!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
