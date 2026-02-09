"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
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
  ShoppingCart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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



      <Link

        href="/settings"

        className={cn(

          "flex flex-col items-center gap-1",

          pathname === "/settings" ? "text-primary" : "text-muted-foreground"

        )}

      >

        <Settings className="h-6 w-6" />

        <span className="text-[10px] uppercase font-bold">Меню</span>

      </Link>

    </div>

  )

}



export function QuickActions() {

  const { data: session } = useSession()

  const userRole = session?.user?.role

  const isOperator = userRole === Role.OPERATOR



  const [isProcurementOpen, setIsProcurementOpen] = useState(false)

  const [isSaleOpen, setIsSaleOpen] = useState(false)



  return (

    <>

      <Sheet>

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

            <Button variant="outline" className="h-24 flex-col gap-2" asChild>

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

                    onClick={() => setIsSaleOpen(true)}

                >

                  <TrendingUp className="h-6 w-6" />

                  <span>Продать</span>

                </Button>

                <Button 

                    variant="outline" 

                    className="h-24 flex-col gap-2"

                    onClick={() => setIsProcurementOpen(true)}

                >

                  <ShoppingCart className="h-6 w-6" />

                  <span>Закупить</span>

                </Button>

                <Button variant="outline" className="h-24 flex-col gap-2" asChild>

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
