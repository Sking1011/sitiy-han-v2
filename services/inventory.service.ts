import { prisma } from "@/lib/prisma";
import { CategoryType, Unit, Prisma } from "@prisma/client";

export class InventoryService {
  // --- Categories ---

  static async getCategories(type?: CategoryType) {
    return prisma.category.findMany({
      where: type ? { type } : undefined,
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: "asc" }
    });
  }

  static async createCategory(data: { name: string; type: CategoryType; color?: string; parentId?: string }) {
    return prisma.category.create({
      data
    });
  }

  static async updateCategory(id: string, data: { name?: string; color?: string; parentId?: string }) {
    return prisma.category.update({
      where: { id },
      data
    });
  }

  static async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id }
    });
  }

  // --- Products ---

  static async getProducts(params?: { categoryId?: string; search?: string }) {
    const where: Prisma.ProductWhereInput = {};
    
    if (params?.categoryId) {
      where.categoryId = params.categoryId;
    }
    
    if (params?.search) {
      where.name = { contains: params.search, mode: 'insensitive' };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        procurementItems: {
            orderBy: { procurement: { date: 'desc' } },
            take: 1,
            select: {
                procurement: {
                    select: { date: true }
                }
            }
        }
      },
      orderBy: { name: "asc" }
    });

    return products.map(p => ({
        ...p,
        minStock: Number(p.minStock),
        currentStock: Number(p.currentStock),
        averagePurchasePrice: Number(p.averagePurchasePrice),
    }));
  }

  static async getLowStockProducts() {
    const products = await prisma.product.findMany({
      where: {
        currentStock: {
          lte: prisma.product.fields.minStock
        }
      },
      include: {
        category: true
      }
    });

    return products.map(p => ({
        ...p,
        minStock: Number(p.minStock),
        currentStock: Number(p.currentStock),
        averagePurchasePrice: Number(p.averagePurchasePrice),
    }));
  }

    static async createProduct(data: {

      name: string;

      categoryId: string;

      unit: Unit;

      minStock?: number;

      image?: string;

    }) {

      const product = await prisma.product.create({

        data: {

          ...data,

          minStock: new Prisma.Decimal(data.minStock || 0),

          currentStock: new Prisma.Decimal(0),

          averagePurchasePrice: new Prisma.Decimal(0),

        }

      });

  

      return {

          ...product,

          minStock: Number(product.minStock),

          currentStock: Number(product.currentStock),

          averagePurchasePrice: Number(product.averagePurchasePrice),

      }

    }

  

    static async updateProduct(id: string, data: Partial<{

      name: string;

      categoryId: string;

      unit: Unit;

      minStock: number;

      currentStock: number;

      averagePurchasePrice: number;

      image: string;

    }>) {

      const updateData: any = { ...data };

      

      if (data.minStock !== undefined) updateData.minStock = new Prisma.Decimal(data.minStock);

      if (data.currentStock !== undefined) updateData.currentStock = new Prisma.Decimal(data.currentStock);

      if (data.averagePurchasePrice !== undefined) updateData.averagePurchasePrice = new Prisma.Decimal(data.averagePurchasePrice);

  

      const product = await prisma.product.update({

        where: { id },

        data: updateData

      });

  

          return {

  

              ...product,

  

              minStock: Number(product.minStock),

  

              currentStock: Number(product.currentStock),

  

              averagePurchasePrice: Number(product.averagePurchasePrice),

  

          }

  

        }

  

      

  

        static async deleteProduct(id: string) {

  

          return prisma.product.delete({

  

            where: { id }

  

          });

  

        }

  

      }

  

      

  