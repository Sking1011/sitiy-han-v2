import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ModeToggle } from "@/components/layout/mode-toggle"

export default async function ProductionPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Производство</h1>
        <ModeToggle />
      </div>
      <p className="text-muted-foreground">
        Рабочая область оператора: {session?.user?.name}
      </p>
    </div>
  )
}
