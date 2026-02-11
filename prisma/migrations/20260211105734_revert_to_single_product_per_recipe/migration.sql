/*
  Warnings:

  - You are about to drop the `RecipeProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecipeProduct" DROP CONSTRAINT "RecipeProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeProduct" DROP CONSTRAINT "RecipeProduct_recipeId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "productId" TEXT NOT NULL;

-- DropTable
DROP TABLE "RecipeProduct";

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
