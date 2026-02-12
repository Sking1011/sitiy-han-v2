
import { ProductionService } from "./services/production.service";

async function main() {
  const materials = await ProductionService.getProductionMaterials();
  
  console.log("Materials count:", materials.length);
  
  const productsWithBatches = materials.filter(m => m.batches.length > 0);
  console.log("Products with batches:", productsWithBatches.map(p => ({
      name: p.name,
      batchesCount: p.batches.length
  })));

  // Check specific product if needed
  // const beef = materials.find(m => m.name.includes("Говядина"));
  // if (beef) console.log("Beef batches:", beef.batches);
}

main().catch(console.error);
