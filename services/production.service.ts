import { prisma } from "@/lib/prisma";
import { ProductionStatus, Prisma } from "@prisma/client";

export class ProductionService {
  static async getProductionMaterials() {
    const products = await prisma.product.findMany({
      include: { 
        category: {
          select: {
            id: true,
            name: true,
            parentId: true
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
    materials: { productId: string; quantityUsed: number }[];
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
              quantityUsed: new Prisma.Decimal(mat.quantityUsed)
            }))
          }
        }
      });

      // 2. Update Stocks and Prices if COMPLETED
      if (production.status === ProductionStatus.COMPLETED) {
          // Subtract materials from stock
          for (const mat of data.materials) {
            await tx.product.update({
              where: { id: mat.productId },
              data: {
                currentStock: { decrement: new Prisma.Decimal(mat.quantityUsed) }
              }
            });
          }

          // Add items to stock and update averagePurchasePrice (as cost price)
          for (const item of data.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                currentStock: { increment: new Prisma.Decimal(item.quantityProduced) },
                averagePurchasePrice: new Prisma.Decimal(item.calculatedCostPerUnit)
              }
            });
          }
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
  }) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.production.findUnique({
        where: { id },
        include: { items: true, materials: true }
      });

      if (!current) throw new Error("Production not found");

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
        }
      });

      // Logic for transitioning from IN_PROGRESS to COMPLETED
      if (current.status !== ProductionStatus.COMPLETED && data.status === ProductionStatus.COMPLETED) {
        // Subtract materials
        for (const mat of current.materials) {
          await tx.product.update({
            where: { id: mat.productId },
            data: {
              currentStock: { decrement: mat.quantityUsed }
            }
          });
        }

        // Add items (and update items if provided in data)
        const itemsToProcess = data.items || current.items.map(i => ({
            productId: i.productId,
            quantityProduced: Number(i.quantityProduced),
            calculatedCostPerUnit: Number(i.calculatedCostPerUnit)
        }));

        for (const item of itemsToProcess) {
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    currentStock: { increment: new Prisma.Decimal(item.quantityProduced) },
                    averagePurchasePrice: new Prisma.Decimal(item.calculatedCostPerUnit)
                }
            });
            
            // If items were updated, update ProductionItem record
            if (data.items) {
                const existingItem = current.items.find(i => i.productId === item.productId);
                if (existingItem) {
                    await tx.productionItem.update({
                        where: { id: existingItem.id },
                        data: {
                            quantityProduced: new Prisma.Decimal(item.quantityProduced),
                            calculatedCostPerUnit: new Prisma.Decimal(item.calculatedCostPerUnit)
                        }
                    });
                }
            }
        }
      }

      return updated;
    });
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
