import { PrismaClient, Role, CategoryType } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Create Admin User
  const adminPassword = 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@sitiyhan.kz',
      name: 'Admin',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
    },
  })

  console.log('Admin user created:', admin.username)

  // 2. Create Stock Categories
  const stockCategories = [
    { name: 'Птица', color: '#FFD700' }, // Gold
    { name: 'Мясо', color: '#FF4500' },  // OrangeRed
    { name: 'Специи', color: '#8B4513' }, // SaddleBrown
    { name: 'Упаковка', color: '#4682B4' }, // SteelBlue
    { name: 'Готовая продукция', color: '#32CD32' }, // LimeGreen
  ]

  for (const cat of stockCategories) {
    await prisma.category.upsert({
      where: { id: `stock-${cat.name}` }, // We don't have a unique constraint on name, so we use a custom ID for seeding or just findFirst
      update: {},
      create: {
        name: cat.name,
        color: cat.color,
        type: CategoryType.STOCK,
      },
    })
  }

  // 3. Create Expense Categories
  const expenseCategories = [
    { name: 'Аренда', color: '#A9A9A9' }, // DarkGray
    { name: 'Коммунальные', color: '#00CED1' }, // DarkTurquoise
    { name: 'Зарплата', color: '#FF69B4' }, // HotPink
    { name: 'Хозтовары', color: '#778899' }, // LightSlateGray
  ]

  for (const cat of expenseCategories) {
    await prisma.category.upsert({
      where: { id: `expense-${cat.name}` },
      update: {},
      create: {
        name: cat.name,
        color: cat.color,
        type: CategoryType.EXPENSE,
      },
    })
  }

  console.log('Base categories created')
  
  // 4. Create System Settings
  await prisma.systemSetting.upsert({
    where: { key: 'TAX_RATE_PERCENT' },
    update: {},
    create: {
      key: 'TAX_RATE_PERCENT',
      value: '6',
      description: 'Ставка налога в процентах',
    },
  })
  
  console.log('System settings initialized')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
