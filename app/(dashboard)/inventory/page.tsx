import { InventoryService } from "@/services/inventory.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Plus, 
    Package, 
} from "lucide-react";
import Link from "next/link";
import { ProductGridClient } from "@/components/inventory/product-grid-client";
import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { serializeEntity } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InventoryPage(props: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const products = await InventoryService.getProducts({
    search: searchParams.q,
    categoryId: searchParams.category,
  });

  const categories = await InventoryService.getCategories();

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 className="text-2xl font-bold lg:text-3xl">Склад</h1>
            <p className="text-muted-foreground text-sm">Управление сырьем и готовой продукцией</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/inventory/categories">Категории</Link>
            </Button>
            <Button asChild>
                <Link href="/inventory/new">
                    <Plus className="mr-2 h-4 w-4" /> Добавить товар
                </Link>
            </Button>
        </div>
      </div>

      {/* Filters & Search (Client Side) */}
      <InventoryFilters categories={serializeEntity(categories)} />

      {/* Tiles Grid (Client Side) */}
      <ProductGridClient 
        products={serializeEntity(products)} 
        categories={serializeEntity(categories)} 
      />

      {products.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground font-medium">Склад пуст или ничего не найдено</p>
              <Button variant="link" asChild>
                  <Link href="/inventory/new">Добавить первый товар</Link>
              </Button>
          </div>
      )}
    </div>
  );
}
