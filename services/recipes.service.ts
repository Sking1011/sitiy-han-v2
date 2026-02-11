import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class RecipesService {
  static async getRecipes() {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
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
        }
      }))
    }));
  }

  static async getProductsForRecipes() {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    });

    return products.map(p => ({
      ...p,
      averagePurchasePrice: Number(p.averagePurchasePrice),
      currentStock: Number(p.currentStock),
    }));
  }

  static async createRecipe(data: {
    name: string;
    description?: string;
    ingredients: {
      ingredientId: string;
      quantity: number;
      isMain: boolean;
    }[];
  }) {
    return prisma.recipe.create({
      data: {
        name: data.name,
        description: data.description,
        ingredients: {
          create: data.ingredients.map(i => ({
            ingredientId: i.ingredientId,
            quantity: new Prisma.Decimal(i.quantity),
            isMain: i.isMain
          }))
        }
      },
      include: {
        ingredients: true
      }
    });
  }

  static async updateRecipe(id: string, data: {
    name?: string;
    description?: string;
    ingredients?: {
      ingredientId: string;
      quantity: number;
      isMain: boolean;
    }[];
  }) {
    return prisma.$transaction(async (tx) => {
      if (data.ingredients) {
        await tx.recipeIngredient.deleteMany({
          where: { recipeId: id }
        });
      }

      return tx.recipe.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          ingredients: data.ingredients ? {
            create: data.ingredients.map(i => ({
              ingredientId: i.ingredientId,
              quantity: new Prisma.Decimal(i.quantity),
              isMain: i.isMain
            }))
          } : undefined
        },
        include: {
          ingredients: true
        }
      });
    });
  }

  static async deleteRecipe(id: string) {
    return prisma.recipe.delete({
      where: { id }
    });
  }
}