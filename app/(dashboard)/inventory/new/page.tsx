import { InventoryService } from "@/services/inventory.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/inventory/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await InventoryService.getCategories();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/inventory">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Новый товар</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Основные данные</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
