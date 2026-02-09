import { InventoryService } from "@/services/inventory.service";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CategoryListClient } from "@/components/inventory/category-list-client";

export default async function CategoriesPage() {
  const categories = await InventoryService.getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/inventory">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold lg:text-3xl">Категории</h1>
      </div>

      <CategoryListClient categories={categories} />
    </div>
  );
}
