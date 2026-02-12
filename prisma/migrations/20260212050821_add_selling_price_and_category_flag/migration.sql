-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isFinished" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sellingPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;
