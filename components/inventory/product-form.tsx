"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Category, Product, Unit } from "@prisma/client"
import { createProductAction, updateProductAction, deleteProductAction } from "@/app/actions/inventory.actions"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProductFormProps {
  product?: Product | null
  categories: Category[]
  onSuccess?: () => void
}

export function ProductForm({ product, categories, onSuccess }: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      name: product?.name || "",
      categoryId: product?.categoryId || "",
      unit: product?.unit || Unit.KG,
      minStock: product ? Number(product.minStock) : 0,
    },
  })

  async function onSubmit(values: any) {
    setIsLoading(true)
    try {
      if (product) {
        await updateProductAction(product.id, values)
      } else {
        await createProductAction(values)
      }
      
      startTransition(() => {
        router.refresh()
        if (onSuccess) {
            onSuccess()
        } else {
            router.push("/inventory")
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onDelete() {
    if (!product) return
    setIsLoading(true)
    try {
      await deleteProductAction(product.id)
      
      // Закрываем модальное окно МГНОВЕННО до начала рефреша страницы
      if (onSuccess) onSuccess()
      
      // Запускаем обновление данных в фоновом режиме
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="Напр: Куриная грудка" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Единица измерения</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Unit.KG}>Килограммы (кг)</SelectItem>
                    <SelectItem value={Unit.LITER}>Литры (л)</SelectItem>
                    <SelectItem value={Unit.PIECE}>Штуки (шт)</SelectItem>
                    <SelectItem value={Unit.PACK}>Упаковки (уп)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Крит. остаток</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-2">
          <Button type="submit" className="flex-1" disabled={isLoading || isPending}>
            {(isLoading || isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Сохранить изменения" : "Создать товар"}
          </Button>
          
          {product && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="icon" disabled={isLoading || isPending}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Товар "{product.name}" будет полностью удален из базы данных.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  )
}
