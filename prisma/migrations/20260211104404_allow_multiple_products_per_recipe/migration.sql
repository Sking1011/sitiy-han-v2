/*
  Warnings:

  - You are about to drop the column `productId` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_productId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "RecipeProduct" (
    "recipeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "RecipeProduct_pkey" PRIMARY KEY ("recipeId","productId")
);

-- AddForeignKey
ALTER TABLE "RecipeProduct" ADD CONSTRAINT "RecipeProduct_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeProduct" ADD CONSTRAINT "RecipeProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
