import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user.role === Role.OPERATOR) {
    redirect("/production")
  }

  redirect("/dashboard")
}
