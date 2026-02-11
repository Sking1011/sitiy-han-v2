const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function run() {
  const login = 'admin';
  const pass = 'admin123';

  console.log('--- Сброс пароля администратора ---');

  try {
    // Генерируем соль и хеш внутри контейнера
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);

    const user = await prisma.user.update({
      where: { username: login },
      data: { passwordHash: hash }
    });

    console.log(`✅ Пароль для пользователя "${user.username}" успешно обновлен!`);
    console.log('Теперь вы можете войти, используя пароль: ' + pass);
  } catch (error) {
    if (error.code === 'P2025') {
      console.error('❌ Ошибка: Пользователь "admin" не найден в базе данных. Сначала запустите сид.');
    } else {
      console.error('❌ Ошибка при обновлении пароля:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

run();
