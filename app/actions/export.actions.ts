"use server"

import { prisma } from "@/lib/prisma"

export async function getProcurementExportData() {
  const data = await prisma.procurement.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: true
    }
  })
  
  return data.flatMap(p => p.items.map(item => ({
    "Дата": p.date.toLocaleDateString("ru-RU"),
    "Товар": item.product.name,
    "Кол-во": Number(item.quantity),
    "Цена": Number(item.pricePerUnit),
    "Итого": Number(item.quantity) * Number(item.pricePerUnit),
    "Поставщик": p.supplier || "-",
    "Источник": p.paymentSource,
    "Создал": p.user?.name || "Система"
  })))
}

export async function getSalesExportData() {
  const data = await prisma.sale.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: true
    }
  })
  
  return data.flatMap(s => s.items.map(item => ({
    "Дата": s.date.toLocaleDateString("ru-RU"),
    "Товар": item.product.name,
    "Кол-во": Number(item.quantity),
    "Цена": Number(item.pricePerUnit),
    "Итого": Number(item.quantity) * Number(item.pricePerUnit),
    "Клиент": s.customer || "-",
    "Продавец": s.user?.name || "Система"
  })))
}

export async function getProductsExportData() {
  const data = await prisma.product.findMany({
    include: {
      category: true
    }
  })
  
  return data.map(p => ({
    "Наименование": p.name,
    "Категория": p.category.name,
    "Ед. изм.": p.unit,
    "Текущий остаток": Number(p.currentStock),
    "Мин. остаток": Number(p.minStock),
    "Средняя цена закупа": Number(p.averagePurchasePrice)
  }))
}
