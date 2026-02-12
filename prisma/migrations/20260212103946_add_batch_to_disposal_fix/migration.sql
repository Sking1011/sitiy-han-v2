-- AlterTable
ALTER TABLE "Disposal" ADD COLUMN     "batchId" TEXT;

-- AddForeignKey
ALTER TABLE "Disposal" ADD CONSTRAINT "Disposal_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
