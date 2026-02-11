import { LoginForm } from "@/components/auth/login-form"
import { BackgroundFood } from "@/components/auth/background-food"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"


export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <BackgroundFood />
      <div className="relative z-10 w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
