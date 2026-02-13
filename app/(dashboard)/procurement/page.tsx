import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ProcurementClient } from "@/components/procurement/procurement-client"
import { redirect } from "next/navigation"
import { serializeEntity } from "@/lib/utils"

export default async function ProcurementPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: {
        category: true
    }
  })

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Закупки</h1>
        <p className="text-muted-foreground">Оформление прихода сырья и товаров на склад</p>
      </div>
      
      <ProcurementClient 
        products={serializeEntity(products)} 
        userId={(session.user as any).id} 
      />
    </div>
  )
}
