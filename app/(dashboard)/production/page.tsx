import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getProductionInitialData, getProductionHistoryAction } from "@/app/actions/production.actions"
import { ProductionClient } from "@/components/production/production-client"

import { ProductionHelp } from "@/components/production/production-help"

export const dynamic = "force-dynamic"

export default async function ProductionPage() {
  const session = await getServerSession(authOptions)
  const { materials, recipes } = await getProductionInitialData()
  const history = await getProductionHistoryAction()

  if (!session?.user) return null

  const activeProductions = history.filter((p: any) => p.status === "IN_PROGRESS").slice(0, 5)

  return (
    <div className="space-y-6 pb-32 lg:pb-10">
      <div className="flex justify-between items-center px-4 md:px-0">
        <h1 className="text-3xl font-bold">Производство</h1>
        <ProductionHelp />
      </div>
      
      <ProductionClient 
        initialMaterials={materials} 
        initialRecipes={recipes}
        history={history}
        activeProductions={activeProductions}
        userId={session.user.id}
      />
    </div>
  )
}
