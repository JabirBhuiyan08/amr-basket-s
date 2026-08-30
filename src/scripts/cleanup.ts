import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Force cleaning up all data...");
  
  // Force delete categories (skip relations if any)
  const result = await prisma.category.deleteMany({});
  console.log(`Deleted ${result.count} categories`);
  
  const productResult = await prisma.product.deleteMany({});
  console.log(`Deleted ${productResult.count} products`);
  
  const imageResult = await prisma.productImage.deleteMany({});
  console.log(`Deleted ${imageResult.count} product images`);
  
  const seoResult = await prisma.productSEO.deleteMany({});
  console.log(`Deleted ${seoResult.count} product SEO records`);
  
  console.log("All data cleaned up.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Cleanup failed:", e);
  process.exit(1);
});
