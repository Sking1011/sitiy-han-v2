-- AlterTable
ALTER TABLE "Disposal" ADD COLUMN     "details" TEXT,
ADD COLUMN     "pricePerUnit" DECIMAL(10,2),
ADD COLUMN     "totalCost" DECIMAL(12,2);
