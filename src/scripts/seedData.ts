import { prisma } from "../lib/prisma";

async function seedData() {
    try {
        console.log("***** Data Seeding Started....")

        // Seed Categories
        const categories = [
            { name: "Electronics", description: "Electronic devices and gadgets", slug: "electronics" },
            { name: "Clothing", description: "Fashion and apparel", slug: "clothing" },
            { name: "Home & Garden", description: "Home decor and garden supplies", slug: "home-garden" },
            { name: "Books", description: "Books and publications", slug: "books" },
            { name: "Sports", description: "Sports equipment and accessories", slug: "sports" },
        ];

        console.log("***** Seeding categories...")
        for (const categoryData of categories) {
            const existing = await prisma.category.findUnique({
                where: { slug: categoryData.slug }
            });

            if (!existing) {
                await prisma.category.create({
                    data: categoryData
                });
                console.log(`Created category: ${categoryData.name}`);
            } else {
                console.log(`Category already exists: ${categoryData.name}`);
            }
        }

        // Seed Products
        const electronicsCategory = await prisma.category.findUnique({
            where: { slug: "electronics" }
        });

        const clothingCategory = await prisma.category.findUnique({
            where: { slug: "clothing" }
        });

        const homeCategory = await prisma.category.findUnique({
            where: { slug: "home-garden" }
        });

        const booksCategory = await prisma.category.findUnique({
            where: { slug: "books" }
        });

        const sportsCategory = await prisma.category.findUnique({
            where: { slug: "sports" }
        });

        const products = [
            {
                name: "Wireless Bluetooth Headphones",
                description: "High-quality wireless headphones with noise cancellation",
                price: 79.99,
                discount: 10.00,
                inStock: true,
                stockQuantity: 50,
                categoryId: electronicsCategory?.id,
                sku: "WBH-001",
                metaTitle: "Wireless Bluetooth Headphones - Best Price",
                metaDescription: "Buy high-quality wireless headphones with noise cancellation",
                metaKeywords: "headphones, bluetooth, wireless, audio",
            },
            {
                name: "Smartphone Case",
                description: "Protective case for smartphones",
                price: 19.99,
                discount: 0,
                inStock: true,
                stockQuantity: 200,
                categoryId: electronicsCategory?.id,
                sku: "SPC-002",
                metaTitle: "Smartphone Case - Protective Cover",
                metaDescription: "Buy protective smartphone cases online",
                metaKeywords: "phone case, smartphone, protective",
            },
            {
                name: "Men's Cotton T-Shirt",
                description: "Comfortable cotton t-shirt for men",
                price: 24.99,
                discount: 5.00,
                inStock: true,
                stockQuantity: 100,
                categoryId: clothingCategory?.id,
                sku: "MCT-003",
                metaTitle: "Men's Cotton T-Shirt",
                metaDescription: "Buy comfortable cotton t-shirts for men",
                metaKeywords: "t-shirt, cotton, men, clothing",
            },
            {
                name: "Women's Running Shoes",
                description: "Lightweight running shoes for women",
                price: 89.99,
                discount: 15.00,
                inStock: true,
                stockQuantity: 30,
                categoryId: clothingCategory?.id,
                sku: "WRS-004",
                metaTitle: "Women's Running Shoes",
                metaDescription: "Buy lightweight running shoes for women",
                metaKeywords: "shoes, running, women, sports",
            },
            {
                name: "Indoor Plant Pot",
                description: "Decorative pot for indoor plants",
                price: 29.99,
                discount: 0,
                inStock: true,
                stockQuantity: 75,
                categoryId: homeCategory?.id,
                sku: "IPP-005",
                metaTitle: "Indoor Plant Pot - Decorative",
                metaDescription: "Buy decorative pots for indoor plants",
                metaKeywords: "plant pot, indoor, decor, garden",
            },
            {
                name: "JavaScript Programming Book",
                description: "Learn JavaScript programming from scratch",
                price: 39.99,
                discount: 8.00,
                inStock: true,
                stockQuantity: 40,
                categoryId: booksCategory?.id,
                sku: "JPB-006",
                metaTitle: "JavaScript Programming Book",
                metaDescription: "Learn JavaScript programming with this comprehensive book",
                metaKeywords: "javascript, programming, book, learn",
            },
            {
                name: "Yoga Mat",
                description: "Non-slip yoga mat for exercise",
                price: 34.99,
                discount: 0,
                inStock: true,
                stockQuantity: 60,
                categoryId: sportsCategory?.id,
                sku: "YMT-007",
                metaTitle: "Yoga Mat - Non-Slip Exercise Mat",
                metaDescription: "Buy non-slip yoga mats for exercise and yoga",
                metaKeywords: "yoga, mat, exercise, fitness",
            },
            {
                name: "Coffee Maker",
                description: "Automatic coffee maker for home use",
                price: 129.99,
                discount: 20.00,
                inStock: true,
                stockQuantity: 15,
                categoryId: homeCategory?.id,
                sku: "CMK-008",
                metaTitle: "Coffee Maker - Automatic",
                metaDescription: "Buy automatic coffee makers for home use",
                metaKeywords: "coffee, maker, automatic, home",
            },
        ];

        console.log("***** Seeding products...")
        for (const productData of products) {
            if (!productData.categoryId) {
                console.log(`Skipping product ${productData.name} - no category found`);
                continue;
            }

            const existing = await prisma.product.findFirst({
                where: { sku: productData.sku }
            });

            if (!existing) {
                await prisma.product.create({
                    data: productData
                });
                console.log(`Created product: ${productData.name}`);
            } else {
                console.log(`Product already exists: ${productData.name}`);
            }
        }

        console.log("******* SUCCESS - DATA SEEDED SUCCESSFULLY ******")
    } catch (error) {
        console.error("Error during data seeding:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seedData()
