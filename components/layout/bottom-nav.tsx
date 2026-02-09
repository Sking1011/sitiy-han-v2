"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Role } from "@prisma/client"
import {
  LayoutDashboard,
  Package,
  Plus,
  TrendingUp,
  Settings,
  Factory,
  ChevronUp,
  ShoppingCart,
  BarChart3,
  History,
  ChefHat,
  LogOut,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { QuickProcurementDialog } from "@/components/procurement/quick-procurement-dialog"
import { QuickSaleDialog } from "@/components/sales/quick-sale-dialog"

export function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role
  const isOperator = userRole === Role.OPERATOR

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background px-6 py-3 flex justify-between items-center z-50">
      <Link
        href={isOperator ? "/production" : "/dashboard"}
        className={cn(
          "flex flex-col items-center gap-1",
          pathname === (isOperator ? "/production" : "/dashboard") ? "text-primary" : "text-muted-foreground"
        )}
      >
        {isOperator ? <Factory className="h-6 w-6" /> : <LayoutDashboard className="h-6 w-6" />}
        <span className="text-[10px] uppercase font-bold">{isOperator ? "Цех" : "Главная"}</span>
      </Link>

      <Link
        href="/inventory"
        className={cn(
          "flex flex-col items-center gap-1",
          pathname === "/inventory" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Package className="h-6 w-6" />
        <span className="text-[10px] uppercase font-bold">Склад</span>
      </Link>

      {/* FAB - Quick Actions */}
      <div className="relative -top-6">
        <QuickActions />
      </div>

      <Link
        href={isOperator ? "/recipes" : "/sales"}
        className={cn(
          "flex flex-col items-center gap-1",
          pathname === (isOperator ? "/recipes" : "/sales") ? "text-primary" : "text-muted-foreground"
        )}
      >
        {isOperator ? <ChevronUp className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
        <span className="text-[10px] uppercase font-bold">{isOperator ? "Техкарты" : "Продажи"}</span>
      </Link>

      <MobileMenu />
    </div>
  )
}

export function MobileMenu() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role
  const [open, setOpen] = useState(false)

  const menuItems = [
    { title: "Дашборд", href: "/dashboard", icon: LayoutDashboard, roles: [Role.ADMIN, Role.DIRECTOR, Role.ACCOUNTANT] },
    { title: "Производство", href: "/production", icon: Factory, roles: [Role.ADMIN, Role.DIRECTOR, Role.OPERATOR] },
    { title: "Склад", href: "/inventory", icon: Package, roles: [Role.ADMIN, Role.DIRECTOR, Role.OPERATOR] },
    { title: "Закупки", href: "/procurement", icon: ShoppingCart, roles: [Role.ADMIN, Role.DIRECTOR, Role.ACCOUNTANT] },
    { title: "Продажи", href: "/sales", icon: TrendingUp, roles: [Role.ADMIN, Role.DIRECTOR, Role.ACCOUNTANT] },
    { title: "Рецепты", href: "/recipes", icon: ChefHat, roles: [Role.ADMIN, Role.DIRECTOR] },
    { title: "Бухгалтерия", href: "/accounting", icon: BarChart3, roles: [Role.ADMIN, Role.DIRECTOR, Role.ACCOUNTANT] },
    { title: "Журнал действий", href: "/admin/logs", icon: History, roles: [Role.ADMIN] },
    { title: "Настройки", href: "/settings", icon: Settings, roles: [Role.ADMIN, Role.DIRECTOR] },
  ]

  const filteredItems = menuItems.filter((item) =>
    userRole ? item.roles.includes(userRole) : false
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex flex-col items-center gap-1 text-muted-foreground">
          <Menu className="h-6 w-6" />
          <span className="text-[10px] uppercase font-bold">Меню</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] sm:w-[350px]">
        <SheetHeader className="text-left pb-6">
          <SheetTitle className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            Сити Хан
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-accent",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
          <Separator className="my-4" />
          <Button
            variant="ghost"
            className="justify-start text-muted-foreground hover:text-destructive px-3 h-12 text-base"
            onClick={() => {
              setOpen(false)
              signOut({ callbackUrl: "/login" })
            }}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Выйти
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function QuickActions() {
  const { data: session } = useSession()
  const userRole = session?.user?.role
  const isOperator = userRole === Role.OPERATOR
  const [open, setOpen] = useState(false)

  const [isProcurementOpen, setIsProcurementOpen] = useState(false)
  const [isSaleOpen, setIsSaleOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-8 w-8" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="text-center">Быстрые действия</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-4 p-4 mt-4">
            <Button variant="outline" className="h-24 flex-col gap-2" asChild onClick={() => setOpen(false)}>
              <Link href="/production/new">
                <Factory className="h-6 w-6" />
                <span>Произвести</span>
              </Link>
            </Button>
            {!isOperator && (
              <>
                <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2" 
                    onClick={() => {
                        setOpen(false)
                        setIsSaleOpen(true)
                    }}
                >
                  <TrendingUp className="h-6 w-6" />
                  <span>Продать</span>
                </Button>
                <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2"
                    onClick={() => {
                        setOpen(false)
                        setIsProcurementOpen(true)
                    }}
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>Закупить</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2" asChild onClick={() => setOpen(false)}>
                  <Link href="/expenses/new">
                    <Plus className="h-6 w-6" />
                    <span>Расход</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <QuickProcurementDialog 
        open={isProcurementOpen} 
        onOpenChange={setIsProcurementOpen} 
      />
      <QuickSaleDialog 
        open={isSaleOpen} 
        onOpenChange={setIsSaleOpen} 
      />
    </>
  )
}