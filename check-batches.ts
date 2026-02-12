const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const batches = await prisma.batch.findMany({
    include: {
        product: true,
        procurementItem: true
    }
  });
  console.log("Total batches found:", batches.length);
  batches.forEach(b => {
      console.log(`Batch ID: ${b.id}, Product: ${b.product.name}, Initial: ${b.initialQuantity}, Remaining: ${b.remainingQuantity}, Price: ${b.pricePerUnit}`);
  });

  const products = await prisma.product.findMany({
      where: { currentStock: { gt: 0 } },
      select: { id: true, name: true, currentStock: true }
  });
  console.log("\nProducts with stock:", products.length);
  products.forEach(p => {
      console.log(`Product: ${p.name}, Stock: ${p.currentStock}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());