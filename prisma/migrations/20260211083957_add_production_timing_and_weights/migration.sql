-- AlterEnum
ALTER TYPE "ProductionStatus" ADD VALUE 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "Production" ADD COLUMN     "boilingTime" INTEGER,
ADD COLUMN     "dryingTime" INTEGER,
ADD COLUMN     "finalWeight" DECIMAL(10,3),
ADD COLUMN     "initialWeight" DECIMAL(10,3),
ADD COLUMN     "prepTime" INTEGER,
ADD COLUMN     "smokingTime" INTEGER,
ADD COLUMN     "totalCost" DECIMAL(12,2);
