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

  static async createCategory(data: { name: string; type: CategoryType; color?: string; parentId?: string; isFinished?: boolean }) {
    return prisma.category.create({
      data
    });
  }

  static async updateCategory(id: string, data: { name?: string; color?: string; parentId?: string; isFinished?: boolean }) {
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
        batches: {
            where: { remainingQuantity: { gt: 0 } },
            orderBy: { createdAt: 'desc' },
            include: {
                procurementItem: { include: { procurement: true } },
                productionItem: { 
                    include: { 
                        production: { 
                            include: { 
                                performer: true,
                                materials: { include: { product: { select: { name: true, unit: true } } } }
                            } 
                        } 
                    } 
                }
            }
        },
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

    const recipes = await prisma.recipe.findMany();

    return products.map(p => ({
        ...p,
        minStock: Number(p.minStock),
        currentStock: Number(p.currentStock),
        averagePurchasePrice: Number(p.averagePurchasePrice),
        sellingPrice: Number(p.sellingPrice),
        batches: p.batches.map(b => {
            const production = b.productionItem?.production;
            let recipeInfo = null;
            
            if (production?.note) {
                const recipeMatch = production.note.match(/\[RecipeID:(.*?)\]/);
                const recipeId = recipeMatch ? recipeMatch[1] : null;
                if (recipeId) {
                    recipeInfo = recipes.find(r => r.id === recipeId);
                }
            }

            return {
                ...b,
                initialQuantity: Number(b.initialQuantity),
                remainingQuantity: Number(b.remainingQuantity),
                pricePerUnit: Number(b.pricePerUnit),
                date: production?.date || b.createdAt,
                performer: production?.performer.name || (b.procurementItem?.procurement?.supplier || "Склад"),
                production: production ? {
                    ...production,
                    recipe: recipeInfo ? { name: recipeInfo.name, description: recipeInfo.description } : null,
                    initialWeight: Number(production.initialWeight),
                    finalWeight: Number(production.finalWeight),
                    totalCost: Number(production.totalCost),
                    materials: production.materials.map((m: any) => ({
                        ...m,
                        quantityUsed: Number(m.quantityUsed)
                    }))
                } : null,
                info: b.productionItem 
                    ? `Варка от ${b.productionItem.production.date.toLocaleDateString()} (${b.productionItem.production.performer.name})`
                    : (b.procurementItem?.procurement?.supplier || "Склад")
            };
        })
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
        sellingPrice: Number(p.sellingPrice),
    }));
  }

    static async createProduct(data: {

      name: string;

      categoryId: string;

      unit: Unit;

      minStock?: number;

      image?: string;
      
      sellingPrice?: number;

    }) {

      const product = await prisma.product.create({

        data: {

          ...data,

          minStock: new Prisma.Decimal(data.minStock || 0),

          currentStock: new Prisma.Decimal(0),

          averagePurchasePrice: new Prisma.Decimal(0),

          sellingPrice: new Prisma.Decimal(data.sellingPrice || 0),

        }

      });

  

      return {

          ...product,

          minStock: Number(product.minStock),

          currentStock: Number(product.currentStock),

          averagePurchasePrice: Number(product.averagePurchasePrice),

          sellingPrice: Number(product.sellingPrice),

      }

    }

  

    static async updateProduct(id: string, data: Partial<{

      name: string;

      categoryId: string;

      unit: Unit;

      minStock: number;

      currentStock: number;

      averagePurchasePrice: number;

      sellingPrice: number;

      image: string;

    }>) {

      const updateData: any = { ...data };

      

      if (data.minStock !== undefined) updateData.minStock = new Prisma.Decimal(data.minStock);

      if (data.currentStock !== undefined) updateData.currentStock = new Prisma.Decimal(data.currentStock);

      if (data.averagePurchasePrice !== undefined) updateData.averagePurchasePrice = new Prisma.Decimal(data.averagePurchasePrice);
      
      if (data.sellingPrice !== undefined) updateData.sellingPrice = new Prisma.Decimal(data.sellingPrice);

  

      const product = await prisma.product.update({

        where: { id },

        data: updateData

      });

  

          return {

  

              ...product,

  

              minStock: Number(product.minStock),

  

              currentStock: Number(product.currentStock),

  

              averagePurchasePrice: Number(product.averagePurchasePrice),
              
              sellingPrice: Number(product.sellingPrice),

  

          }

  

        }

  

      

  

          static async deleteProduct(id: string) {

  

      

  

            return prisma.product.delete({

  

      

  

              where: { id }

  

      

  

            });

  

      

  

          }

  

      

  

        

  

      

  

  static async getProductHistory(productId: string, batchId?: string) {
    const [procurements, sales, productionUsage, productionOutput, disposals, merges] = await Promise.all([
      prisma.procurementItem.findMany({
        where: { 
            productId,
            batch: batchId ? { id: batchId } : undefined
        },
        include: { procurement: { include: { user: true } } },
        orderBy: { procurement: { date: "desc" } }
      }),
      prisma.saleItem.findMany({
        where: { productId }, // Продажи пока не привязаны к партиям в схеме, оставим так
        include: { sale: { include: { user: true } } },
        orderBy: { sale: { date: "desc" } }
      }),
      prisma.productionMaterial.findMany({
        where: { 
            productId,
            batchId: batchId || undefined
        },
        include: { production: { include: { performer: true } } },
        orderBy: { production: { date: "desc" } }
      }),
      prisma.productionItem.findMany({
        where: { 
            productId,
            batch: batchId ? { id: batchId } : undefined
        },
        include: { production: { include: { performer: true } } },
        orderBy: { production: { date: "desc" } }
      }),
      prisma.disposal.findMany({
        where: { 
            productId,
            batchId: batchId || undefined
        },
        include: { 
            user: true,
            batch: { include: { procurementItem: { include: { procurement: true } } } }
        },
        orderBy: { date: "desc" }
      }),
      prisma.batchMerge.findMany({
        where: { 
            productId,
            OR: batchId ? [
                { targetBatchId: batchId },
                { sourceInfo: { contains: batchId } } // Это упрощенно, для точного поиска нужно расширять схему
            ] : undefined
        },
        include: { user: true },
        orderBy: { date: "desc" }
      })
    ]);

    const history = [
      ...procurements.map(p => ({
        id: p.id,
        date: p.procurement.date,
        type: "PROCUREMENT" as const,
        quantity: Number(p.quantity),
        price: Number(p.pricePerUnit),
        total: Number(p.quantity) * Number(p.pricePerUnit),
        counterparty: p.procurement.supplier || "Поставщик",
        performedBy: p.procurement.user?.name || "Система"
      })),
      ...sales.map(s => ({
        id: s.id,
        date: s.sale.date,
        type: "SALE" as const,
        quantity: -Number(s.quantity),
        price: Number(s.pricePerUnit),
        total: Number(s.quantity) * Number(s.pricePerUnit),
        counterparty: s.sale.customer || "Клиент",
        performedBy: s.sale.user?.name || "Система"
      })),
      ...productionUsage.map(pm => ({
        id: pm.id,
        date: pm.production.date,
        type: "PRODUCTION_USAGE" as const,
        quantity: -Number(pm.quantityUsed),
        counterparty: "Цех (списание)",
        performedBy: pm.production.performer.name
      })),
      ...productionOutput.map(pi => ({
        id: pi.id,
        date: pi.production.date,
        type: "PRODUCTION_OUTPUT" as const,
        quantity: Number(pi.quantityProduced),
        counterparty: "Цех (выпуск)",
        performedBy: pi.production.performer.name
      })),
      ...disposals.map(d => ({
        id: d.id,
        date: d.date,
        type: "DISPOSAL" as const,
        quantity: -Number(d.quantity),
        counterparty: d.batch 
            ? `${d.reason || 'Списание'} (из партии ${d.batch.id.slice(0,8)})`
            : (d.reason || "Списание"),
        performedBy: d.user.name
      })),
      ...merges.flatMap(m => ([
        {
          id: `${m.id}-out`,
          date: m.date,
          type: "MERGE" as const,
          quantity: -Number(m.quantityMerged),
          counterparty: `Ушло в: ${m.targetInfo}`,
          performedBy: m.user.name
        },
        {
          id: `${m.id}-in`,
          date: m.date,
          type: "MERGE" as const,
          quantity: Number(m.quantityMerged),
          counterparty: `Пришло из: ${m.sourceInfo}`,
          performedBy: m.user.name
        }
      ]))
    ];

    return history.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  static async createDisposal(data: {
    productId: string;
    quantity: number;
    reason?: string;
    userId: string;
    batchId?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const disposal = await tx.disposal.create({
        data: {
          productId: data.productId,
          batchId: data.batchId,
          quantity: new Prisma.Decimal(data.quantity),
          reason: data.reason,
          userId: data.userId
        }
      });

      // 1. Уменьшаем общий остаток товара
      await tx.product.update({
        where: { id: data.productId },
        data: {
          currentStock: {
            decrement: new Prisma.Decimal(data.quantity)
          }
        }
      });

      // 2. Если указана партия, уменьшаем её остаток
      if (data.batchId) {
          await tx.batch.update({
              where: { id: data.batchId },
              data: {
                  remainingQuantity: {
                      decrement: new Prisma.Decimal(data.quantity)
                  }
              }
          });
      }

      return disposal;
    });
  }

    static async mergeBatches(data: {

      productId: string; // Целевой товар

      sourceBatchId: string;

      targetBatchId: string;

      userId: string;

      quantity?: number;

    }) {

      return prisma.$transaction(async (tx) => {

        const source = await tx.batch.findUnique({ 

          where: { id: data.sourceBatchId },

          include: { 

              product: { select: { name: true } },

              procurementItem: { include: { procurement: true } },

              productionItem: { include: { production: true } }

          }

        });

        const target = await tx.batch.findUnique({ 

          where: { id: data.targetBatchId },

          include: { product: { select: { name: true } } }

        });

  

        if (!source || !target) throw new Error("Партии не найдены");

  

        const qtyToMerge = data.quantity || Number(source.remainingQuantity);

        

        if (qtyToMerge > Number(source.remainingQuantity)) {

            throw new Error("Недостаточно остатка в исходной партии");

        }

  

        // Если товары разные, корректируем общие остатки в таблице Product

        if (source.productId !== target.productId) {

            await tx.product.update({

                where: { id: source.productId },

                data: { currentStock: { decrement: new Prisma.Decimal(qtyToMerge) } }

            });

            await tx.product.update({

                where: { id: target.productId },

                data: { currentStock: { increment: new Prisma.Decimal(qtyToMerge) } }

            });

        }

  

        const sPrice = Number(source.pricePerUnit);

        const tQty = Number(target.remainingQuantity);

        const tPrice = Number(target.pricePerUnit);

  

        const totalTargetQty = tQty + qtyToMerge;

        const newTargetPrice = (qtyToMerge * sPrice + tQty * tPrice) / totalTargetQty;

  

        await tx.batch.update({

          where: { id: data.targetBatchId },

          data: {

            remainingQuantity: new Prisma.Decimal(totalTargetQty),

            initialQuantity: { increment: new Prisma.Decimal(qtyToMerge) },

            pricePerUnit: new Prisma.Decimal(newTargetPrice)

          }

        });

  

        // Запись о слиянии (в историю цели)

        await tx.batchMerge.create({

          data: {

            productId: target.productId,

            targetBatchId: data.targetBatchId,

            sourceInfo: `${source.product.name}: ${source.productionItem ? 'Варка' : 'Закуп'} от ${source.createdAt.toLocaleDateString()}`,

            targetInfo: `${target.product.name}: Партия #${target.id.slice(0,8)}`,

            quantityMerged: new Prisma.Decimal(qtyToMerge),

            priceAtMerge: source.pricePerUnit,

            userId: data.userId

          }

        });

  

        // Если товары разные, запись в историю источника (расход)

        if (source.productId !== target.productId) {

            await tx.batchMerge.create({

              data: {

                productId: source.productId,

                targetBatchId: data.targetBatchId,

                sourceInfo: `${source.product.name}: Партия #${source.id.slice(0,8)}`,

                targetInfo: `Перенос в ${target.product.name} (#${target.id.slice(0,8)})`,

                quantityMerged: new Prisma.Decimal(qtyToMerge),

                priceAtMerge: source.pricePerUnit,

                userId: data.userId

              }

            });

        }

  

        if (qtyToMerge === Number(source.remainingQuantity)) {

            await tx.batch.delete({ where: { id: data.sourceBatchId } });

        } else {

            await tx.batch.update({

                where: { id: data.sourceBatchId },

                data: { remainingQuantity: { decrement: new Prisma.Decimal(qtyToMerge) } }

            });

        }

  

        return { totalTargetQty, newTargetPrice };

      });

    }

  

    static async getBatches(productId: string) {

      const batches = await prisma.batch.findMany({

        where: { 

          productId,

          remainingQuantity: { gt: 0 } 

        },

        orderBy: { createdAt: 'desc' },

        include: {

          product: { select: { name: true, categoryId: true } },

          procurementItem: {

              include: { procurement: { select: { supplier: true, date: true } } }

          },

                  productionItem: {

                      include: {

                          production: {

                              include: { 

                                  performer: { select: { name: true } },

                                  materials: {

                                      include: {

                                          product: { select: { name: true, unit: true } }

                                      }

                                  }

                              }

                          }

                      }

                  }

                }

              });

          

                  const recipes = await prisma.recipe.findMany();

          

              

          

                  return batches.map(b => {

          

                    const production = b.productionItem?.production;

          

                    let recipeInfo = null;

          

                    

          

                    if (production?.note) {

          

                        const recipeMatch = production.note.match(/\[RecipeID:(.*?)\]/);

          

                        const recipeId = recipeMatch ? recipeMatch[1] : null;

          

                        if (recipeId) {

          

                            recipeInfo = recipes.find(r => r.id === recipeId);

          

                        }

          

                    }

          

              

          

                    return {

          

                      ...b,

          

                      initialQuantity: Number(b.initialQuantity),

          

                      remainingQuantity: Number(b.remainingQuantity),

          

                      pricePerUnit: Number(b.pricePerUnit),

          

                      production: production ? {

          

                          ...production,

          

                          recipe: recipeInfo ? { name: recipeInfo.name, description: recipeInfo.description } : null,

          

                          initialWeight: Number(production.initialWeight),

          

                          finalWeight: Number(production.finalWeight),

          

                          totalCost: Number(production.totalCost),

          

                          materials: production.materials.map((m: any) => ({

          

                              ...m,

          

                              quantityUsed: Number(m.quantityUsed)

          

                          }))

          

                      } : null,

          

                      info: b.productionItem 

          

                          ? `Варка от ${b.productionItem.production.date.toLocaleDateString()} (${b.productionItem.production.performer.name})`

          

                          : (b.procurementItem?.procurement?.supplier || "Склад")

          

                    };

          

                  });

          

              

          

    }

  

    static async getBatchesByCategory(categoryId: string) {

      const batches = await prisma.batch.findMany({

        where: { 

          product: { categoryId },

          remainingQuantity: { gt: 0 } 

        },

        orderBy: { createdAt: 'desc' },

        include: {

          product: { select: { name: true } },

          procurementItem: {

              include: { procurement: { select: { supplier: true, date: true } } }

          },

                  productionItem: {

                      include: { production: { 

                          include: { 

                              performer: { select: { name: true } },

                              materials: {

                                  include: {

                                      product: { select: { name: true, unit: true } }

                                  }

                              }

                          } 

                      } }

                  }

                }

              });

          

              return batches.map(b => ({

                ...b,

                productName: b.product.name,

                initialQuantity: Number(b.initialQuantity),

                remainingQuantity: Number(b.remainingQuantity),

                pricePerUnit: Number(b.pricePerUnit),

                production: b.productionItem?.production ? {

                    ...b.productionItem.production,

                    initialWeight: Number(b.productionItem.production.initialWeight),

                    finalWeight: Number(b.productionItem.production.finalWeight),

                    totalCost: Number(b.productionItem.production.totalCost),

                    materials: b.productionItem.production.materials.map((m: any) => ({

                        ...m,

                        quantityUsed: Number(m.quantityUsed)

                    }))

                } : null,

                info: b.productionItem 

                    ? `Варка от ${b.productionItem.production.date.toLocaleDateString()} (${b.productionItem.production.performer.name})`

                    : (b.procurementItem?.procurement?.supplier || "Склад")

              }));

          

    }

  }

  