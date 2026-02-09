import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold lg:text-3xl">Личный профиль</h1>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{session?.user?.name}</CardTitle>
            <CardDescription className="uppercase">{session?.user?.role}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Логин</Label>
            <Input value={(session?.user as any)?.username || "admin"} disabled />
          </div>
          <div className="grid gap-2">
            <Label>Имя</Label>
            <Input value={session?.user?.name || ""} disabled />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={session?.user?.email || "Не указан"} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Безопасность</CardTitle>
          <CardDescription>Измените ваш пароль для доступа к системе</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current">Текущий пароль</Label>
            <Input id="current" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new">Новый пароль</Label>
            <Input id="new" type="password" />
          </div>
          <Button className="w-full sm:w-auto">Обновить пароль</Button>
        </CardContent>
      </Card>
    </div>
  )
}
