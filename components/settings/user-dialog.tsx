"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Role } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { createUser, updateUser } from "@/app/actions/user.actions"

const userSchema = z.object({
  username: z.string().min(3, "Минимум 3 символа"),
  name: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Неверный email").optional().or(z.literal("")),
  password: z.string().min(6, "Минимум 6 символов").optional().or(z.literal("")),
  role: z.nativeEnum(Role),
})

type UserFormValues = z.infer<typeof userSchema>

interface UserDialogProps {
  user?: any // If editing
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDialog({ user, open, onOpenChange }: UserDialogProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      role: Role.OPERATOR,
      password: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        username: user?.username || "",
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || Role.OPERATOR,
        password: "",
      })
    }
  }, [user, open, form])

  async function onSubmit(values: UserFormValues) {
    setLoading(true)
    try {
      if (user) {
        await updateUser(user.id, values)
      } else {
        if (!values.password) {
          form.setError("password", { message: "Пароль обязателен для нового пользователя" })
          setLoading(false)
          return
        }
        await createUser(values as any)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Редактировать пользователя" : "Добавить пользователя"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="johndoe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Иван Иванов" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (необязательно)</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="ivan@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роль</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Role).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{user ? "Новый пароль (оставьте пустым для сохранения)" : "Пароль"}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
