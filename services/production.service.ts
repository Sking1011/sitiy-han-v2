import { prisma } from "@/lib/prisma";
import { ProductionStatus, Prisma } from "@prisma/client";
import { InventoryService } from "./inventory.service";

export class ProductionService {
  static async getProductionMaterials() {
    const products = await prisma.product.findMany({
      include: { 
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
            isFinished: true
          }
        },
        batches: {
            where: { remainingQuantity: { gt: 0 } },
            orderBy: { createdAt: 'asc' },
            include: {
                procurementItem: {
                    include: { procurement: { select: { supplier: true, date: true } } }
                }
            }
        }
      },
      orderBy: { name: 'asc' }
    });
    return products.map(p => ({
        ...p,
        averagePurchasePrice: Number(p.averagePurchasePrice),
        currentStock: Number(p.currentStock),
        minStock: Number(p.minStock),
        batches: p.batches.map(b => ({
            ...b,
            initialQuantity: Number(b.initialQuantity),
            remainingQuantity: Number(b.remainingQuantity),
            pricePerUnit: Number(b.pricePerUnit),
            supplier: b.procurementItem?.procurement?.supplier,
            date: b.procurementItem?.procurement?.date || b.createdAt
        }))
    }));
  }

  static async getRecipes() {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    });
    return recipes.map(r => ({
        ...r,
        ingredients: r.ingredients.map(i => ({
            ...i,
            quantity: Number(i.quantity),
            ingredient: {
                ...i.ingredient,
                averagePurchasePrice: Number(i.ingredient.averagePurchasePrice),
                currentStock: Number(i.ingredient.currentStock),
                minStock: Number(i.ingredient.minStock),
            }
        }))
    }));
  }

  static async createProduction(data: {
    performedBy: string;
    items: { productId: string; quantityProduced: number; calculatedCostPerUnit: number }[];
    materials: { productId: string; quantityUsed: number; batchId?: string }[];
    initialWeight?: number;
    finalWeight?: number;
    prepTime?: number;
    dryingTime?: number;
    smokingTime?: number;
    boilingTime?: number;
    totalCost?: number;
    status?: ProductionStatus;
    note?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Production record
      const production = await tx.production.create({
        data: {
          performedBy: data.performedBy,
          status: data.status || ProductionStatus.COMPLETED,
          note: data.note,
          initialWeight: data.initialWeight ? new Prisma.Decimal(data.initialWeight) : null,
          finalWeight: data.finalWeight ? new Prisma.Decimal(data.finalWeight) : null,
          prepTime: data.prepTime,
          dryingTime: data.dryingTime,
          smokingTime: data.smokingTime,
          boilingTime: data.boilingTime,
          totalCost: data.totalCost ? new Prisma.Decimal(data.totalCost) : null,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantityProduced: new Prisma.Decimal(item.quantityProduced),
              calculatedCostPerUnit: new Prisma.Decimal(item.calculatedCostPerUnit)
            }))
          },
          materials: {
            create: data.materials.map(mat => ({
              productId: mat.productId,
              quantityUsed: new Prisma.Decimal(mat.quantityUsed),
              batchId: mat.batchId
            }))
          }
        },
        include: { items: true }
      });

      if (production.status === ProductionStatus.COMPLETED) {
          await this.processProductionCompletion(tx, production, data.materials);
      }

      return production;
    });
  }

  static async updateProduction(id: string, data: {
    status?: ProductionStatus;
    note?: string;
    finalWeight?: number;
    prepTime?: number;
    dryingTime?: number;
    smokingTime?: number;
    boilingTime?: number;
    totalCost?: number;
    items?: { productId: string; quantityProduced: number; calculatedCostPerUnit: number }[];
    materials?: { productId: string; quantityUsed: number; batchId?: string }[];
  }) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.production.findUnique({
        where: { id },
        include: { items: true, materials: true }
      });

      if (!current) throw new Error("Production not found");

      // Update basic fields
      const updated = await tx.production.update({
        where: { id },
        data: {
          status: data.status,
          note: data.note,
          finalWeight: data.finalWeight ? new Prisma.Decimal(data.finalWeight) : undefined,
          prepTime: data.prepTime,
          dryingTime: data.dryingTime,
          smokingTime: data.smokingTime,
          boilingTime: data.boilingTime,
          totalCost: data.totalCost ? new Prisma.Decimal(data.totalCost) : undefined,
        },
        include: { items: true, materials: true }
      });

      // Transition to COMPLETED
      if (current.status !== ProductionStatus.COMPLETED && data.status === ProductionStatus.COMPLETED) {
          // If materials were updated in the form, use them, otherwise use from DB
          const materialsToDeduct = data.materials || current.materials.map(m => ({
              productId: m.productId,
              quantityUsed: Number(m.quantityUsed),
              batchId: m.batchId || undefined
          }));
          
          await this.processProductionCompletion(tx, updated, materialsToDeduct);
      }

      return updated;
    });
  }

  /**
   * Вспомогательный метод для обработки завершения производства:
   * 1. Списание сырья (Product + Batches FIFO)
   * 2. Приход готовой продукции (Product + New Batch)
   */
  private static async processProductionCompletion(tx: any, production: any, materials: any[]) {
      // 1. Списание сырья
      for (const mat of materials) {
          const qty = Number(mat.quantityUsed);
          await InventoryService.deductStock(tx, mat.productId, qty, mat.batchId);
      }

      // 2. Приход готовой продукции
      for (const item of production.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product) continue;

          const producedQty = Number(item.quantityProduced);
          const producedCost = Number(item.calculatedCostPerUnit);

          // Обновляем среднюю цену (справочно)
          const currentStock = Number(product.currentStock);
          const currentAvgPrice = Number(product.averagePurchasePrice);
          let newAvgPrice = producedCost;
          const totalQty = currentStock + producedQty;
          if (totalQty > 0) {
              newAvgPrice = ((currentStock * currentAvgPrice) + (producedQty * producedCost)) / totalQty;
          }

          await tx.product.update({
              where: { id: item.productId },
              data: {
                  currentStock: { increment: new Prisma.Decimal(producedQty) },
                  averagePurchasePrice: new Prisma.Decimal(newAvgPrice)
              }
          });

          // Создаем уникальную Партию для этого выпуска
          // Используем create, так как при переходе в COMPLETED партии еще не должно быть
          await tx.batch.create({
              data: {
                  productId: item.productId,
                  productionItemId: item.id,
                  initialQuantity: new Prisma.Decimal(producedQty),
                  remainingQuantity: new Prisma.Decimal(producedQty),
                  pricePerUnit: new Prisma.Decimal(producedCost)
              }
          });
      }
  }

  static async getProductionHistory() {
    const productions = await prisma.production.findMany({
      include: {
        performer: true,
        items: {
          include: { product: true }
        },
        materials: {
          include: { product: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    return productions.map(p => ({
      ...p,
      initialWeight: p.initialWeight ? Number(p.initialWeight) : null,
      finalWeight: p.finalWeight ? Number(p.finalWeight) : null,
      totalCost: p.totalCost ? Number(p.totalCost) : null,
      items: p.items.map(i => ({
        ...i,
        quantityProduced: Number(i.quantityProduced),
        calculatedCostPerUnit: Number(i.calculatedCostPerUnit)
      })),
      materials: p.materials.map(m => ({
        ...m,
        quantityUsed: Number(m.quantityUsed)
      }))
    }));
  }
}
