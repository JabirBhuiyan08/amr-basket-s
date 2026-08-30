import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seed...");

  // Check if data already exists
  const existingCategories = await prisma.category.count();
  const existingProducts = await prisma.product.count();

  if (existingCategories > 0 || existingProducts > 0) {
    console.log(`Database already has ${existingCategories} categories and ${existingProducts} products.`);
    console.log("Skipping seed to avoid duplicates.");
    await prisma.$disconnect();
    return;
  }

  // Create categories
  console.log("Creating categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electronics",
        description: "Latest gadgets, smartphones, laptops, and electronic devices",
        slug: "electronics",
        metaTitle: "Electronics - Latest Gadgets & Devices",
        metaDescription: "Shop the latest electronics including smartphones, laptops, tablets, and more.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Clothing",
        description: "Fashionable clothing for men, women, and kids",
        slug: "clothing",
        metaTitle: "Clothing - Fashion for Everyone",
        metaDescription: "Discover trendy clothing for men, women, and kids at great prices.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Home & Garden",
        description: "Furniture, decor, and garden supplies",
        slug: "home-garden",
        metaTitle: "Home & Garden - Furniture & Decor",
        metaDescription: "Transform your home with our furniture, decor, and garden supplies.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Sports",
        description: "Sports equipment, activewear, and fitness gear",
        slug: "sports",
        metaTitle: "Sports - Equipment & Activewear",
        metaDescription: "Get active with our sports equipment, activewear, and fitness gear.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Books",
        description: "Bestselling books, textbooks, and e-books",
        slug: "books",
        metaTitle: "Books - Bestsellers & More",
        metaDescription: "Explore our collection of bestselling books, textbooks, and e-books.",
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories.`);

  // Create products for each category
  console.log("Creating products...");

  const products = [
    // Electronics
    {
      name: "Wireless Bluetooth Headphones",
      description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
      price: 2999,
      discount: 15,
      inStock: true,
      stockQuantity: 50,
      categoryId: categories[0].id,
      sku: "ELEC-001",
      metaTitle: "Wireless Bluetooth Headphones - Premium Sound",
      metaDescription: "Buy wireless Bluetooth headphones with noise cancellation and 30-hour battery.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", altText: "Wireless Headphones", isPrimary: true, order: 0 },
        { imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500", altText: "Headphones Side View", isPrimary: false, order: 1 },
      ],
      seo: { slug: "wireless-bluetooth-headphones", metaTitle: "Wireless Bluetooth Headphones", metaDescription: "Premium wireless headphones" },
    },
    {
      name: "Smartphone 12 Pro",
      description: "Latest smartphone with 6.5-inch display, 128GB storage, and advanced camera system.",
      price: 79999,
      discount: 10,
      inStock: true,
      stockQuantity: 30,
      categoryId: categories[0].id,
      sku: "ELEC-002",
      metaTitle: "Smartphone 12 Pro - Latest Model",
      metaDescription: "Get the latest smartphone with advanced features and camera.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", altText: "Smartphone", isPrimary: true, order: 0 },
      ],
      seo: { slug: "smartphone-12-pro", metaTitle: "Smartphone 12 Pro", metaDescription: "Latest smartphone model" },
    },
    {
      name: "Laptop 15-inch",
      description: "Powerful laptop with Intel i7 processor, 16GB RAM, and 512GB SSD.",
      price: 89999,
      discount: 8,
      inStock: true,
      stockQuantity: 20,
      categoryId: categories[0].id,
      sku: "ELEC-003",
      metaTitle: "Laptop 15-inch - Powerful Performance",
      metaDescription: "High-performance laptop for work and gaming.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500", altText: "Laptop", isPrimary: true, order: 0 },
      ],
      seo: { slug: "laptop-15-inch", metaTitle: "Laptop 15-inch", metaDescription: "Powerful laptop" },
    },
    {
      name: "Smart Watch",
      description: "Fitness smartwatch with heart rate monitor, GPS, and 7-day battery.",
      price: 4999,
      discount: 20,
      inStock: true,
      stockQuantity: 40,
      categoryId: categories[0].id,
      sku: "ELEC-004",
      metaTitle: "Smart Watch - Fitness Tracker",
      metaDescription: "Smartwatch with fitness tracking and GPS.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", altText: "Smart Watch", isPrimary: true, order: 0 },
      ],
      seo: { slug: "smart-watch", metaTitle: "Smart Watch", metaDescription: "Fitness smartwatch" },
    },
    {
      name: "Wireless Earbuds",
      description: "Compact wireless earbuds with crystal clear sound and touch controls.",
      price: 1999,
      discount: 0,
      inStock: true,
      stockQuantity: 60,
      categoryId: categories[0].id,
      sku: "ELEC-005",
      metaTitle: "Wireless Earbuds - Compact Design",
      metaDescription: "Compact wireless earbuds with clear sound.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500", altText: "Wireless Earbuds", isPrimary: true, order: 0 },
      ],
      seo: { slug: "wireless-earbuds", metaTitle: "Wireless Earbuds", metaDescription: "Compact wireless earbuds" },
    },
    {
      name: "Tablet 10-inch",
      description: "Versatile tablet with 10-inch display, perfect for work and entertainment.",
      price: 34999,
      discount: 5,
      inStock: true,
      stockQuantity: 25,
      categoryId: categories[0].id,
      sku: "ELEC-006",
      metaTitle: "Tablet 10-inch - Versatile Device",
      metaDescription: "10-inch tablet for work and entertainment.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500", altText: "Tablet", isPrimary: true, order: 0 },
      ],
      seo: { slug: "tablet-10-inch", metaTitle: "Tablet 10-inch", metaDescription: "Versatile tablet" },
    },
    // Clothing
    {
      name: "Men's Casual T-Shirt",
      description: "Comfortable cotton t-shirt for everyday wear. Available in multiple colors.",
      price: 599,
      discount: 25,
      inStock: true,
      stockQuantity: 100,
      categoryId: categories[1].id,
      sku: "CLO-001",
      metaTitle: "Men's Casual T-Shirt - Comfortable Cotton",
      metaDescription: "Shop comfortable cotton t-shirts for men.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", altText: "T-Shirt", isPrimary: true, order: 0 },
      ],
      seo: { slug: "mens-casual-tshirt", metaTitle: "Men's Casual T-Shirt", metaDescription: "Comfortable cotton t-shirt" },
    },
    {
      name: "Women's Summer Dress",
      description: "Elegant summer dress perfect for casual outings and special occasions.",
      price: 1499,
      discount: 30,
      inStock: true,
      stockQuantity: 60,
      categoryId: categories[1].id,
      sku: "CLO-002",
      metaTitle: "Women's Summer Dress - Elegant Style",
      metaDescription: "Beautiful summer dress for women.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500", altText: "Summer Dress", isPrimary: true, order: 0 },
      ],
      seo: { slug: "womens-summer-dress", metaTitle: "Women's Summer Dress", metaDescription: "Elegant summer dress" },
    },
    {
      name: "Denim Jacket",
      description: "Classic denim jacket with a modern fit. Perfect for layering.",
      price: 2499,
      discount: 15,
      inStock: true,
      stockQuantity: 35,
      categoryId: categories[1].id,
      sku: "CLO-003",
      metaTitle: "Denim Jacket - Classic Style",
      metaDescription: "Classic denim jacket for all seasons.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500", altText: "Denim Jacket", isPrimary: true, order: 0 },
      ],
      seo: { slug: "denim-jacket", metaTitle: "Denim Jacket", metaDescription: "Classic denim jacket" },
    },
    {
      name: "Formal Shirt",
      description: "Premium formal shirt for office and formal occasions.",
      price: 1299,
      discount: 0,
      inStock: true,
      stockQuantity: 80,
      categoryId: categories[1].id,
      sku: "CLO-004",
      metaTitle: "Formal Shirt - Premium Quality",
      metaDescription: "Premium formal shirt for office wear.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500", altText: "Formal Shirt", isPrimary: true, order: 0 },
      ],
      seo: { slug: "formal-shirt", metaTitle: "Formal Shirt", metaDescription: "Premium formal shirt" },
    },
    {
      name: "Casual Hoodie",
      description: "Warm and comfortable hoodie for casual wear.",
      price: 1899,
      discount: 10,
      inStock: true,
      stockQuantity: 50,
      categoryId: categories[1].id,
      sku: "CLO-005",
      metaTitle: "Casual Hoodie - Warm & Comfortable",
      metaDescription: "Warm hoodie for casual wear.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500", altText: "Hoodie", isPrimary: true, order: 0 },
      ],
      seo: { slug: "casual-hoodie", metaTitle: "Casual Hoodie", metaDescription: "Warm comfortable hoodie" },
    },
    // Home & Garden
    {
      name: "Modern Sofa Set",
      description: "3-seater modern sofa with premium fabric upholstery and wooden legs.",
      price: 34999,
      discount: 12,
      inStock: true,
      stockQuantity: 10,
      categoryId: categories[2].id,
      sku: "HOME-001",
      metaTitle: "Modern Sofa Set - Premium Comfort",
      metaDescription: "3-seater modern sofa for your living room.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500", altText: "Sofa", isPrimary: true, order: 0 },
      ],
      seo: { slug: "modern-sofa-set", metaTitle: "Modern Sofa Set", metaDescription: "Premium comfort sofa" },
    },
    {
      name: "Indoor Plant Set",
      description: "Set of 3 beautiful indoor plants with decorative pots.",
      price: 1299,
      discount: 0,
      inStock: true,
      stockQuantity: 25,
      categoryId: categories[2].id,
      sku: "HOME-002",
      metaTitle: "Indoor Plant Set - Decorative Plants",
      metaDescription: "Beautiful indoor plants for your home.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500", altText: "Indoor Plants", isPrimary: true, order: 0 },
      ],
      seo: { slug: "indoor-plant-set", metaTitle: "Indoor Plant Set", metaDescription: "Decorative indoor plants" },
    },
    {
      name: "Kitchen Knife Set",
      description: "Professional 6-piece kitchen knife set with wooden block.",
      price: 2999,
      discount: 18,
      inStock: true,
      stockQuantity: 45,
      categoryId: categories[2].id,
      sku: "HOME-003",
      metaTitle: "Kitchen Knife Set - Professional Quality",
      metaDescription: "Professional kitchen knife set for cooking enthusiasts.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500", altText: "Kitchen Knives", isPrimary: true, order: 0 },
      ],
      seo: { slug: "kitchen-knife-set", metaTitle: "Kitchen Knife Set", metaDescription: "Professional kitchen knives" },
    },
    {
      name: "Coffee Table",
      description: "Minimalist coffee table with solid wood top and metal legs.",
      price: 4999,
      discount: 0,
      inStock: true,
      stockQuantity: 15,
      categoryId: categories[2].id,
      sku: "HOME-004",
      metaTitle: "Coffee Table - Minimalist Design",
      metaDescription: "Minimalist coffee table for your living room.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500", altText: "Coffee Table", isPrimary: true, order: 0 },
      ],
      seo: { slug: "coffee-table", metaTitle: "Coffee Table", metaDescription: "Minimalist coffee table" },
    },
    {
      name: "Bed Sheet Set",
      description: "Luxury cotton bed sheet set with 4 pillowcases. Queen size.",
      price: 1999,
      discount: 22,
      inStock: true,
      stockQuantity: 30,
      categoryId: categories[2].id,
      sku: "HOME-005",
      metaTitle: "Bed Sheet Set - Luxury Cotton",
      metaDescription: "Luxury cotton bed sheet set for queen bed.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500", altText: "Bed Sheets", isPrimary: true, order: 0 },
      ],
      seo: { slug: "bed-sheet-set", metaTitle: "Bed Sheet Set", metaDescription: "Luxury cotton bed sheets" },
    },
    // Sports
    {
      name: "Yoga Mat",
      description: "Extra thick yoga mat with non-slip surface. Perfect for yoga and Pilates.",
      price: 899,
      discount: 20,
      inStock: true,
      stockQuantity: 80,
      categoryId: categories[3].id,
      sku: "SPORT-001",
      metaTitle: "Yoga Mat - Extra Thick Non-Slip",
      metaDescription: "Premium yoga mat for comfortable workouts.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500", altText: "Yoga Mat", isPrimary: true, order: 0 },
      ],
      seo: { slug: "yoga-mat", metaTitle: "Yoga Mat", metaDescription: "Extra thick non-slip yoga mat" },
    },
    {
      name: "Dumbbell Set",
      description: "Adjustable dumbbell set from 5kg to 25kg. Perfect for home workouts.",
      price: 5999,
      discount: 10,
      inStock: true,
      stockQuantity: 15,
      categoryId: categories[3].id,
      sku: "SPORT-002",
      metaTitle: "Dumbbell Set - Adjustable Weights",
      metaDescription: "Adjustable dumbbell set for home gym.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500", altText: "Dumbbells", isPrimary: true, order: 0 },
      ],
      seo: { slug: "dumbbell-set", metaTitle: "Dumbbell Set", metaDescription: "Adjustable dumbbell weights" },
    },
    {
      name: "Running Shoes",
      description: "Lightweight running shoes with responsive cushioning and breathable mesh.",
      price: 3499,
      discount: 15,
      inStock: true,
      stockQuantity: 55,
      categoryId: categories[3].id,
      sku: "SPORT-003",
      metaTitle: "Running Shoes - Lightweight & Comfortable",
      metaDescription: "Lightweight running shoes for runners.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", altText: "Running Shoes", isPrimary: true, order: 0 },
      ],
      seo: { slug: "running-shoes", metaTitle: "Running Shoes", metaDescription: "Lightweight running shoes" },
    },
    {
      name: "Yoga Block Pair",
      description: "High-density foam yoga blocks for support and stability.",
      price: 499,
      discount: 0,
      inStock: true,
      stockQuantity: 100,
      categoryId: categories[3].id,
      sku: "SPORT-004",
      metaTitle: "Yoga Block Pair - High Density Foam",
      metaDescription: "Foam yoga blocks for yoga practice.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500", altText: "Yoga Blocks", isPrimary: true, order: 0 },
      ],
      seo: { slug: "yoga-block-pair", metaTitle: "Yoga Block Pair", metaDescription: "High density foam yoga blocks" },
    },
    // Books
    {
      name: "The Art of Programming",
      description: "Comprehensive guide to programming fundamentals and best practices.",
      price: 899,
      discount: 0,
      inStock: true,
      stockQuantity: 70,
      categoryId: categories[4].id,
      sku: "BOOK-001",
      metaTitle: "The Art of Programming - Guide",
      metaDescription: "Learn programming fundamentals with this comprehensive guide.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500", altText: "Programming Book", isPrimary: true, order: 0 },
      ],
      seo: { slug: "art-of-programming", metaTitle: "The Art of Programming", metaDescription: "Programming guide book" },
    },
    {
      name: "Healthy Cooking Recipes",
      description: "Over 200 healthy and delicious recipes for every meal.",
      price: 599,
      discount: 10,
      inStock: true,
      stockQuantity: 90,
      categoryId: categories[4].id,
      sku: "BOOK-002",
      metaTitle: "Healthy Cooking Recipes - 200+ Recipes",
      metaDescription: "Discover healthy and delicious recipes.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500", altText: "Cookbook", isPrimary: true, order: 0 },
      ],
      seo: { slug: "healthy-cooking-recipes", metaTitle: "Healthy Cooking Recipes", metaDescription: "200+ healthy recipes" },
    },
    {
      name: "Science Fiction Collection",
      description: "Collection of 5 bestselling science fiction novels.",
      price: 1299,
      discount: 25,
      inStock: true,
      stockQuantity: 40,
      categoryId: categories[4].id,
      sku: "BOOK-003",
      metaTitle: "Science Fiction Collection - 5 Books",
      metaDescription: "Bestselling science fiction novel collection.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500", altText: "Sci-Fi Books", isPrimary: true, order: 0 },
      ],
      seo: { slug: "science-fiction-collection", metaTitle: "Science Fiction Collection", metaDescription: "5 bestselling sci-fi novels" },
    },
    {
      name: "Mystery Thriller Box Set",
      description: "Box set of 4 gripping mystery and thriller novels.",
      price: 999,
      discount: 0,
      inStock: true,
      stockQuantity: 55,
      categoryId: categories[4].id,
      sku: "BOOK-004",
      metaTitle: "Mystery Thriller Box Set - 4 Books",
      metaDescription: "Gripping mystery and thriller novel collection.",
      images: [
        { imageUrl: "https://images.unsplash.com/photo-1543002588-bfa740fdedcc?w=500", altText: "Mystery Books", isPrimary: true, order: 0 },
      ],
      seo: { slug: "mystery-thriller-box-set", metaTitle: "Mystery Thriller Box Set", metaDescription: "4 gripping mystery novels" },
    },
  ];

  for (const productData of products) {
    const { images, seo, categoryId, discount, price, ...productFields } = productData;

    // Calculate discountPrice if discount is provided
    const discountPrice = discount && discount > 0 ? Number(price) * (1 - discount / 100) : null;

    // Build the data object explicitly to handle optional fields
    const createData: any = {
      ...productFields,
      price,
      discountPrice,
      category: {
        connect: { id: categoryId }
      }
    };

    // Only add seo if it exists
    if (seo) {
      createData.seo = {
        create: {
          slug: seo.slug,
          metaTitle: seo.metaTitle,
          metaDescription: seo.metaDescription,
        }
      };
    }

    const product = await prisma.product.create({
      data: createData,
      include: {
        category: true,
        images: true,
        seo: true,
      },
    });

    // Create images
    if (images && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((img, index) => ({
          productId: product.id,
          imageUrl: img.imageUrl,
          altText: img.altText,
          isPrimary: img.isPrimary,
          order: img.order ?? index,
        })),
      });
    }
  }

  console.log(`Created ${products.length} products.`);

  // Summary
  const totalCategories = await prisma.category.count();
  const totalProducts = await prisma.product.count();
  const totalImages = await prisma.productImage.count();

  console.log("\n=== Seed Summary ===");
  console.log(`Categories: ${totalCategories}`);
  console.log(`Products: ${totalProducts}`);
  console.log(`Product Images: ${totalImages}`);
  console.log("Seed completed successfully!");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});