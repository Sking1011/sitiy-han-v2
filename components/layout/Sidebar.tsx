"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Role } from "@prisma/client"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  ChefHat,
  Settings,
  History,
  LogOut,
  User,
  PlusCircle,
  BarChart3,
  Factory,
  BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface NavItem {
  title: string
  href: string
  icon: any
  roles: Role[]
}

const navItems: NavItem[] = [
  {
    title: "Дашборд",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [Role.ADMIN, Role.DIRECTOR, Role.ACCOUNTANT],
  },
  {
    title: "Производство",
    href: "/production",
    icon: Factory,
    roles: [Role.ADMIN, Role.DIRECTOR, Role.OPERATOR],
  },
  {
    title: "Склад",
    href: "/inventory",
    icon: Package,
    roles: [Role.ADMIN, Role.DIRECTOR, Role.OPERATOR],
  },
  {
    title: "Закупки",
    href: "/procurement",
    icon: ShoppingCart,
    roles: [Role.ADMIN, Role.DIRECTOR, Role.ACCOUNTANT],
  },
  {
    title: "Продажи",
    href: "/sales",
    icon: TrendingUp,
    roles: [Role.ADMIN, Role.DIRECTOR, Role.ACCOUNTANT],
  },
  {
    title: "Рецепты",
    href: "/recipes",
    icon: ChefHat,
    roles: [Role.ADMIN, Role.DIRECTOR],
  },
  {
    title: "Бухгалтерия",
    href: "/accounting",
    icon: BarChart3,
    roles: [Role.ADMIN, Role.DIRECTOR, Role.ACCOUNTANT],
  },
  {
    title: "Справочник",
    href: "/wiki",
    icon: BookOpen,
    roles: [Role.ADMIN, Role.DIRECTOR, Role.ACCOUNTANT, Role.OPERATOR],
  },
  {
    title: "Журнал действий",
    href: "/admin/logs",
    icon: History,
    roles: [Role.ADMIN],
  },
  {
    title: "Настройки",
    href: "/settings",
    icon: Settings,
    roles: [Role.ADMIN, Role.DIRECTOR],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role

  const filteredItems = navItems.filter((item) =>
    userRole ? item.roles.includes(userRole) : false
  )

  return (
    <div className="hidden lg:flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <ChefHat className="h-6 w-6 text-primary" />
          <span>Сытый Хан</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto p-4 border-t space-y-2">
        <Link 
          href="/settings/profile"
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">
              {session?.user?.name}
            </span>
            <span className="text-xs text-muted-foreground truncate uppercase">
              {userRole}
            </span>
          </div>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  )
}