
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: true
        }
      }
    }
  });

  console.log("Recipes found:", recipes.length);
  recipes.forEach(r => {
    console.log(`Recipe: ${r.name}`);
    r.ingredients.forEach(i => {
      console.log(`  - Ingredient: ${i.ingredient.name} (ID: ${i.ingredientId}), isMain: ${i.isMain}`);
    });
  });
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
