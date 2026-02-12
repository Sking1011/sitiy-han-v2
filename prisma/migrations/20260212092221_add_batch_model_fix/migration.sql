-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "procurementItemId" TEXT,
    "initialQuantity" DECIMAL(10,3) NOT NULL,
    "remainingQuantity" DECIMAL(10,3) NOT NULL,
    "pricePerUnit" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Batch_procurementItemId_key" ON "Batch"("procurementItemId");

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_procurementItemId_fkey" FOREIGN KEY ("procurementItemId") REFERENCES "ProcurementItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
