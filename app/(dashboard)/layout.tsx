import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { ChefHat } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background overscroll-none">
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Desktop Header */}
        <DashboardHeader />

        {/* Mobile Header */}
        <header className="lg:hidden flex h-14 items-center justify-between border-b px-6 bg-card flex-shrink-0">
          <div className="flex items-center gap-2 font-bold text-lg">
            <ChefHat className="h-5 w-5 text-primary" />
            <span>Сити Хан</span>
          </div>
          <ModeToggle />
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-32 lg:pb-4 scroll-smooth">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  )
}
