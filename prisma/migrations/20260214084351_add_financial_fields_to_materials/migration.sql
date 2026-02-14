-- AlterTable
ALTER TABLE "ProductionMaterial" ADD COLUMN     "details" TEXT,
ADD COLUMN     "priceAtMoment" DECIMAL(10,2),
ADD COLUMN     "totalCost" DECIMAL(12,2);
