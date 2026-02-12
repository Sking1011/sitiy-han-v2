"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Category, CategoryType } from "@prisma/client"
import { createCategoryAction, updateCategoryAction } from "@/app/actions/inventory.actions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

interface CategoryDialogProps {
  category?: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDialog({ category, open, onOpenChange }: CategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      name: "",
      type: CategoryType.STOCK,
      color: "#3b82f6",
      isFinished: false,
    },
  })

  // Update form when category changes or dialog opens
  useEffect(() => {
    if (open) {
      if (category) {
        form.reset({
          name: category.name,
          type: category.type,
          color: category.color || "#3b82f6",
          isFinished: (category as any).isFinished || false,
        })
      } else {
        form.reset({
          name: "",
          type: CategoryType.STOCK,
          color: "#3b82f6",
          isFinished: false,
        })
      }
    }
  }, [category, open, form])

  async function onSubmit(values: any) {
    setIsLoading(true)
    try {
      if (category) {
        await updateCategoryAction(category.id, values)
      } else {
        await createCategoryAction(values)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const categoryType = form.watch("type")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Редактировать категорию" : "Создать категорию"}
          </DialogTitle>
          <DialogDescription>
            Настройте имя и цвет для классификации товаров или расходов.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Напр: Мясо птицы" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!!category}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CategoryType.STOCK}>Складская (Товары)</SelectItem>
                      <SelectItem value={CategoryType.EXPENSE}>Расходная (Траты)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {categoryType === CategoryType.STOCK && (
              <FormField
                control={form.control}
                name="isFinished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Это готовая продукция
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Отметьте, если в этой категории будут храниться товары собственного производства (на продажу).
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цвет (HEX)</FormLabel>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 h-10 p-1" {...field} />
                    <Input placeholder="#000000" {...field} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {category ? "Сохранить" : "Создать"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
