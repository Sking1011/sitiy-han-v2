-- CreateTable
CREATE TABLE "BatchMerge" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sourceInfo" TEXT NOT NULL,
    "targetBatchId" TEXT NOT NULL,
    "quantityMerged" DECIMAL(10,3) NOT NULL,
    "priceAtMerge" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BatchMerge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BatchMerge" ADD CONSTRAINT "BatchMerge_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchMerge" ADD CONSTRAINT "BatchMerge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
