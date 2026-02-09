"use client"

import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: Role[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return null // Or a loading spinner
  }

  if (!session || !allowedRoles.includes(session.user.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
