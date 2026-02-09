import { Unit } from "@prisma/client"

/**
 * Умное форматирование единиц измерения.
 * Если значение < 1 и единица KG/LITER, переводит в Г/МЛ.
 */
export function formatUnit(value: number | string | DecimalValue, unit: Unit): string {
  const numValue = typeof value === "string" ? parseFloat(value) : (value as any).toNumber ? (value as any).toNumber() : Number(value)

  if (isNaN(numValue)) return "0"

  switch (unit) {
    case Unit.KG:
      if (numValue < 1) {
        return `${(numValue * 1000).toFixed(0)} г`
      }
      return `${numValue.toFixed(2)} кг`
    
    case Unit.LITER:
      if (numValue < 1) {
        return `${(numValue * 1000).toFixed(0)} мл`
      }
      return `${numValue.toFixed(2)} л`

    case Unit.PIECE:
      return `${numValue} шт`

    case Unit.PACK:
      return `${numValue} уп`

    default:
      return `${numValue}`
  }
}

/**
 * Форматирование валюты (KZT)
 */
export function formatCurrency(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : Number(amount)
  
  return new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Форматирование даты
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface DecimalValue {
    toNumber: () => number
}
