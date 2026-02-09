"use client"

import { Drumstick, Ham, Beef, Pizza } from "lucide-react"
import { useEffect, useState } from "react"

const FOOD_ICONS = [
  { Icon: Drumstick, color: "text-orange-500" },
  { Icon: Ham, color: "text-pink-500" },
  { Icon: Beef, color: "text-red-500" },
  { Icon: Pizza, color: "text-yellow-500" },
]

export function BackgroundFood() {
  const [elements, setElements] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const newElements = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      iconIndex: Math.floor(Math.random() * FOOD_ICONS.length),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `-${Math.random() * 20}s`, 
      duration: `${20 + Math.random() * 20}s`,
      size: Math.floor(Math.random() * 30) + 30,
      rotation: Math.floor(Math.random() * 360),
    }))
    setElements(newElements)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-background" suppressHydrationWarning>
      {/* Сетка */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      
      {elements.map((el) => {
        const { Icon, color } = FOOD_ICONS[el.iconIndex]
        return (
          <div
            key={el.id}
            className={`absolute animate-food-float opacity-10 ${color}`}
            style={{
              left: el.left,
              top: el.top,
              animationDelay: el.delay,
              animationDuration: el.duration,
              transform: `rotate(${el.rotation}deg)`,
            }}
          >
            <Icon size={el.size} strokeWidth={1} />
          </div>
        )
      })}
    </div>
  )
}