const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Синхронизация пароля с системным bcrypt ---');
  
  // Этот хеш взят напрямую из логов вашего приложения для пароля 'admin123'
  const systemHash = '$2b$10$NJJM2MzGhkRIT2dUsE1M.u2azJdNCiiUlseCmGa.pHMA6TUqZB3ki';

  await prisma.user.update({
    where: { username: 'admin' },
    data: { passwordHash: systemHash },
  });

  console.log('✅ Пароль admin синхронизирован с системным bcrypt');
  console.log('Попробуйте войти под admin / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
