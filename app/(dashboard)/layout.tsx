import { Sidebar } from "@/components/layout/sidebar"
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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Desktop Header */}
        <DashboardHeader />

        {/* Mobile Header */}
        <header className="lg:hidden flex h-14 items-center justify-between border-b px-6 bg-card">
          <div className="flex items-center gap-2 font-bold text-lg">
            <ChefHat className="h-5 w-5 text-primary" />
            <span>Сити Хан</span>
          </div>
          <ModeToggle />
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-20 lg:pb-4">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  )
}
