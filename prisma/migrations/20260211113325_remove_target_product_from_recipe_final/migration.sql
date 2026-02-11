/*
  Warnings:

  - You are about to drop the column `productId` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_productId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "productId";
