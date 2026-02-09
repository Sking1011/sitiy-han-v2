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

interface DecimalValue {
    toNumber: () => number
}
