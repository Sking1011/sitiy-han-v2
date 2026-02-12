"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Badge } from "@/components/ui/badge"
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
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Scale, Pipette, Check, ChevronsUpDown } from "lucide-react"
import { createRecipeAction, updateRecipeAction } from "@/app/actions/recipes.actions"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const ingredientSchema = z.object({
  ingredientId: z.string().min(1, "Выберите продукт"),
  quantity: z.number().min(0.1, "Количество должно быть больше 0"),
  isMain: z.boolean(),
})

const recipeSchema = z.object({
  name: z.string().min(2, "Название должно быть не менее 2 символов"),
  description: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1, "Добавьте хотя бы один ингредиент"),
})

type RecipeFormValues = z.infer<typeof recipeSchema>

interface RecipeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipe?: any
  products: any[]
  onSuccess: () => void
}

export function RecipeDialog({ open, onOpenChange, recipe, products, onSuccess }: RecipeDialogProps) {
  const [loading, setLoading] = useState(false)
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

  const setPopoverOpen = (id: string, isOpen: boolean) => {
    setOpenStates(prev => ({ ...prev, [id]: isOpen }))
  }

  // Extract unique categories
  const categories = Array.from(new Set(products.map(p => JSON.stringify({id: p.categoryId, name: p.category.name}))))
    .map(s => JSON.parse(s))
    .sort((a, b) => a.name.localeCompare(b.name))

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      description: "",
      ingredients: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  })

  useEffect(() => {
    if (recipe) {
      form.reset({
        name: recipe.name,
        description: recipe.description || "",
        ingredients: recipe.ingredients.map((i: any) => ({
          ingredientId: i.ingredientId,
          quantity: i.quantity * 1000,
          isMain: i.isMain,
        })),
      })
    } else {
      form.reset({
        name: "",
        description: "",
        ingredients: [],
      })
    }
  }, [recipe, form, open])

  const ingredients = form.watch("ingredients") || []
  const totalMainWeight = ingredients
    .filter(i => i.isMain)
    .reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)

  async function onSubmit(values: RecipeFormValues) {
    const totalMainGrams = values.ingredients
      .filter(i => i.isMain)
      .reduce((sum, i) => sum + i.quantity, 0)

    if (Math.abs(totalMainGrams - 1000) > 0.1) {
      toast.error(`Сумма основных ингредиентов должна быть ровно 1000 г (сейчас: ${totalMainGrams.toFixed(1)} г)`)
      return
    }

    setLoading(true)
    try {
      const dataToSave = {
        ...values,
        ingredients: values.ingredients.map(i => ({
          ...i,
          quantity: i.quantity / 1000
        }))
      }

      if (recipe) {
        await updateRecipeAction(recipe.id, dataToSave)
        toast.success("Рецепт обновлен")
      } else {
        await createRecipeAction(dataToSave)
        toast.success("Рецепт создан")
      }
      onSuccess()
    } catch (error) {
      toast.error("Ошибка при сохранении рецепта")
    } finally {
      setLoading(false)
    }
  }

  const addIngredient = (isMain: boolean) => {
    append({ ingredientId: "", quantity: 0, isMain })
  }

  const mainCategories = categories.filter(c => {
    const name = c.name.toLowerCase();
    return !name.includes("специ") && !name.includes("маринад") && !name.includes("готов");
  });

  const spiceCategories = categories.filter(c => {
    const name = c.name.toLowerCase();
    return name.includes("специ") || name.includes("маринад");
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 max-sm:h-[100dvh] max-sm:max-h-none max-sm:rounded-none max-sm:top-0 max-sm:translate-y-0 border-none flex flex-col overflow-hidden">
        <DialogHeader className="p-4 border-b bg-card shrink-0">
          <DialogTitle>{recipe ? "Редактировать рецепт" : "Создать новый рецепт"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto touch-pan-y p-4">
              <div className="space-y-6 pb-40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название рецепта</FormLabel>
                        <FormControl>
                          <Input placeholder="Например: Смесь для копчения №1" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание / Заметки</FormLabel>
                        <FormControl>
                          <Input placeholder="Особенности приготовления..." className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Основные ингредиенты */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Мясная основа (ровно 1000 г)</h3>
                    </div>
                    <Badge variant={Math.abs(totalMainWeight - 1000) < 0.1 ? "default" : "destructive"}>
                      Итого: {totalMainWeight.toFixed(0)} / 1000 г
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {fields.filter(f => f.isMain).map((item) => {
                      const actualIndex = fields.findIndex(f => f.id === item.id)
                      return (
                        <div key={item.id} className="flex gap-2 items-start p-3 rounded-lg border bg-primary/5 border-primary/20">
                          <FormField
                            control={form.control}
                            name={`ingredients.${actualIndex}.ingredientId`}
                            render={({ field: formField }) => (
                              <FormItem className="flex-1">
                                <Popover open={openStates[item.id]} onOpenChange={(o) => setPopoverOpen(item.id, o)}>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between h-12 text-xs",
                                          !formField.value && "text-muted-foreground"
                                        )}
                                      >
                                        <span className="truncate">
                                          {formField.value
                                            ? products.find((p) => p.id === formField.value)?.name
                                            : "Поиск сырья..."}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0" align="start">
                                    <Command>
                                      <CommandInput placeholder="Введите название..." />
                                      <CommandList>
                                        <CommandEmpty>Не найдено.</CommandEmpty>
                                        {mainCategories.map((category) => (
                                          <CommandGroup key={category.id} heading={category.name}>
                                            {products
                                              .filter(p => p.categoryId === category.id)
                                              .map((product) => (
                                                <CommandItem
                                                  value={product.name}
                                                  key={product.id}
                                                  onSelect={() => {
                                                    form.setValue(`ingredients.${actualIndex}.ingredientId`, product.id)
                                                    setPopoverOpen(item.id, false)
                                                  }}
                                                >
                                                  <Check
                                                    className={cn(
                                                      "mr-2 h-4 w-4",
                                                      product.id === formField.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                  />
                                                  {product.name}
                                                </CommandItem>
                                              ))}
                                          </CommandGroup>
                                        ))}
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`ingredients.${actualIndex}.quantity`}
                            render={({ field: formField }) => (
                              <FormItem className="w-24 shrink-0">
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      type="number" 
                                      inputMode="decimal"
                                      step="any"
                                      className="h-12 text-right pr-6 text-xs font-bold"
                                      value={formField.value === 0 ? "" : formField.value}
                                      onChange={e => formField.onChange(e.target.value === "" ? 0 : Number(e.target.value.replace(',', '.')))}
                                      onFocus={(e) => e.target.select()}
                                      placeholder="0"
                                    />
                                    <span className="absolute right-2 top-4 text-muted-foreground text-[10px]">г</span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive shrink-0 h-12 w-10"
                            onClick={() => remove(actualIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full border-dashed text-xs bg-primary/5 h-12"
                      onClick={() => addIngredient(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Добавить основу
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Специи и добавки */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Pipette className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-medium">Специи и добавки (на 1000 г основы)</h3>
                  </div>

                  <div className="space-y-3">
                    {fields.filter(f => !f.isMain).map((item) => {
                      const actualIndex = fields.findIndex(f => f.id === item.id)
                      return (
                        <div key={item.id} className="flex gap-2 items-start p-3 rounded-lg border bg-card">
                          <FormField
                            control={form.control}
                            name={`ingredients.${actualIndex}.ingredientId`}
                            render={({ field: formField }) => (
                              <FormItem className="flex-1">
                                <Popover open={openStates[item.id]} onOpenChange={(o) => setPopoverOpen(item.id, o)}>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between h-12 text-xs",
                                          !formField.value && "text-muted-foreground"
                                        )}
                                      >
                                        <span className="truncate">
                                          {formField.value
                                            ? products.find((p) => p.id === formField.value)?.name
                                            : "Поиск специи..."}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0" align="start">
                                    <Command>
                                      <CommandInput placeholder="Введите название..." />
                                      <CommandList>
                                        <CommandEmpty>Не найдено.</CommandEmpty>
                                        {spiceCategories.map((category) => (
                                          <CommandGroup key={category.id} heading={category.name}>
                                            {products
                                              .filter(p => p.categoryId === category.id)
                                              .map((product) => (
                                                <CommandItem
                                                  value={product.name}
                                                  key={product.id}
                                                  onSelect={() => {
                                                    form.setValue(`ingredients.${actualIndex}.ingredientId`, product.id)
                                                    setPopoverOpen(item.id, false)
                                                  }}
                                                >
                                                  <Check
                                                    className={cn(
                                                      "mr-2 h-4 w-4",
                                                      product.id === formField.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                  />
                                                  {product.name}
                                                </CommandItem>
                                              ))}
                                          </CommandGroup>
                                        ))}
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`ingredients.${actualIndex}.quantity`}
                            render={({ field: formField }) => (
                              <FormItem className="w-24 shrink-0">
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      type="number" 
                                      inputMode="decimal"
                                      step="any"
                                      className="h-12 text-right pr-6 text-xs font-bold"
                                      value={formField.value === 0 ? "" : formField.value}
                                      onChange={e => formField.onChange(e.target.value === "" ? 0 : Number(e.target.value.replace(',', '.')))}
                                      onFocus={(e) => e.target.select()}
                                      placeholder="0"
                                    />
                                    <span className="absolute right-2 top-4 text-muted-foreground text-[10px]">г</span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive shrink-0 h-12 w-10"
                            onClick={() => remove(actualIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full border-dashed text-xs h-12"
                      onClick={() => addIngredient(false)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Добавить специю
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 border-t shrink-0 bg-card mt-auto flex-row gap-2">
              <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit" className="flex-1 h-12" disabled={loading}>
                {loading ? "Сохранение..." : recipe ? "Сохранить" : "Создать"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
