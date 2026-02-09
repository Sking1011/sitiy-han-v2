"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Unit } from "@prisma/client"

interface UnitInputProps {
  value: number
  onChange: (value: number) => void
  baseUnit: Unit
  disabled?: boolean
  className?: string
}

export function UnitInput({
  value,
  onChange,
  baseUnit,
  disabled,
  className,
}: UnitInputProps) {
  // Локальное состояние для отображаемого значения и текущей выбранной под-единицы (г/кг)
  const [displayValue, setDisplayValue] = React.useState<string>("")
  const [currentUnit, setCurrentUnit] = React.useState<string>(baseUnit)

  // Инициализация
  React.useEffect(() => {
    if (baseUnit === Unit.KG) {
      if (value > 0 && value < 1) {
        setDisplayValue((value * 1000).toString())
        setCurrentUnit("GRAM")
      } else {
        setDisplayValue(value.toString())
        setCurrentUnit(Unit.KG)
      }
    } else if (baseUnit === Unit.LITER) {
      if (value > 0 && value < 1) {
        setDisplayValue((value * 1000).toString())
        setCurrentUnit("ML")
      } else {
        setDisplayValue(value.toString())
        setCurrentUnit(Unit.LITER)
      }
    } else {
      setDisplayValue(value.toString())
      setCurrentUnit(baseUnit)
    }
  }, [baseUnit]) // Только при смене базовой единицы

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDisplayValue(val)
    const num = parseFloat(val) || 0
    
    if (currentUnit === "GRAM" || currentUnit === "ML") {
      onChange(num / 1000)
    } else {
      onChange(num)
    }
  }

  const handleUnitChange = (newUnit: string) => {
    const num = parseFloat(displayValue) || 0
    setCurrentUnit(newUnit)

    if (newUnit === "GRAM" || newUnit === "ML") {
      // Если переключили с КГ на Г, значение в системе не меняется, но ввод меняется
      // Но обычно пользователь хочет сконвертировать то что ввел
      onChange(num / 1000)
    } else {
      onChange(num)
    }
  }

  const getOptions = () => {
    switch (baseUnit) {
      case Unit.KG:
        return [
          { label: "кг", value: Unit.KG },
          { label: "г", value: "GRAM" },
        ]
      case Unit.LITER:
        return [
          { label: "л", value: Unit.LITER },
          { label: "мл", value: "ML" },
        ]
      default:
        return [{ label: baseUnit.toLowerCase(), value: baseUnit }]
    }
  }

  const options = getOptions()

  return (
    <div className={`flex gap-2 ${className}`}>
      <Input
        type="number"
        step="any"
        value={displayValue}
        onChange={handleInputChange}
        disabled={disabled}
        className="flex-1"
      />
      <Select
        value={currentUnit}
        onValueChange={handleUnitChange}
        disabled={disabled || options.length <= 1}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
