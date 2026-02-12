/*
  Warnings:

  - A unique constraint covering the columns `[productionItemId]` on the table `Batch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Batch" ADD COLUMN     "productionItemId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Batch_productionItemId_key" ON "Batch"("productionItemId");

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_productionItemId_fkey" FOREIGN KEY ("productionItemId") REFERENCES "ProductionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
