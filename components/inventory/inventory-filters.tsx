"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Category } from "@prisma/client"
import { useTransition, useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"

interface InventoryFiltersProps {
  categories: Category[]
}

export function InventoryFilters({ categories }: InventoryFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentCategory = searchParams.get("category")
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const debouncedSearch = useDebounce(searchQuery, 500)

  // Sync searchQuery with URL if it changes (e.g. back button)
  useEffect(() => {
    const q = searchParams.get("q") || ""
    if (q !== searchQuery) {
      setSearchQuery(q)
    }
  }, [searchParams.get("q")])

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
    })
  }

  useEffect(() => {
    const currentQ = searchParams.get("q") || ""
    if (debouncedSearch !== currentQ) {
        setFilter("q", debouncedSearch || null)
    }
  }, [debouncedSearch])

  return (
    <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${isPending ? 'animate-pulse' : ''}`} />
          <Input 
              placeholder="Поиск товара..." 
              className="pl-9 h-11 bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Button 
                variant={!currentCategory ? "secondary" : "outline"} 
                size="sm" 
                className="whitespace-nowrap"
                onClick={() => setFilter("category", null)}
            >
                Все
            </Button>
            {categories.map(cat => (
                <Button 
                    key={cat.id} 
                    variant={currentCategory === cat.id ? "secondary" : "outline"} 
                    size="sm" 
                    className="whitespace-nowrap"
                    onClick={() => setFilter("category", cat.id)}
                    style={currentCategory !== cat.id ? { 
                        borderColor: cat.color || undefined,
                        color: cat.color || undefined
                    } : {
                        backgroundColor: cat.color || undefined,
                        color: '#fff'
                    }}
                >
                    {cat.name}
                </Button>
            ))}
        </div>
    </div>
  )
}
