import { CreateProductDTO, UpdateProductDTO, ProductQueryDTO, ProductImageDTO, ProductSEOUpdateDTO } from './product.types';
export declare const productService: {
    getAllProducts: (query: ProductQueryDTO) => Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getProductById: (id: string) => Promise<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            rating: number;
            count: number;
            percentage: number;
        }[];
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            slug: string | null;
            image: string | null;
            parentId: string | null;
        } | null;
        images: {
            createdAt: Date;
            id: string;
            order: number;
            productId: string;
            imageUrl: string;
            altText: string | null;
            isPrimary: boolean;
        }[];
        seo: {
            updatedAt: Date;
            id: string;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            productId: string;
            slug: string | null;
        } | null;
        reviews: ({
            images: {
                createdAt: Date;
                id: string;
                imageUrl: string;
                reviewId: string;
            }[];
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            productId: string;
            userId: string;
            rating: number;
            title: string | null;
            comment: string | null;
            status: import("../../../generated/prisma/enums").ReviewStatus;
            helpful: number;
        })[];
        _count: {
            reviews: number;
        };
        name: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        discountPrice: import("@prisma/client-runtime-utils").Decimal | null;
        stockQuantity: number;
        inStock: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        sku: string | null;
        description: string | null;
        discount: import("@prisma/client-runtime-utils").Decimal | null;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
    } | null>;
    getProductsByCategory: (categoryId: string, page?: number, limit?: number) => Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    searchProducts: (query: string, page?: number, limit?: number) => Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            searchQuery: string;
        };
    }>;
    createProduct: (data: CreateProductDTO) => Promise<({
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            slug: string | null;
            image: string | null;
            parentId: string | null;
        } | null;
        images: {
            createdAt: Date;
            id: string;
            order: number;
            productId: string;
            imageUrl: string;
            altText: string | null;
            isPrimary: boolean;
        }[];
        seo: {
            updatedAt: Date;
            id: string;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            productId: string;
            slug: string | null;
        } | null;
    } & {
        name: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        discountPrice: import("@prisma/client-runtime-utils").Decimal | null;
        stockQuantity: number;
        inStock: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        sku: string | null;
        description: string | null;
        discount: import("@prisma/client-runtime-utils").Decimal | null;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
    }) | null>;
    updateProduct: (id: string, data: UpdateProductDTO) => Promise<void>;
    deleteProduct: (id: string) => Promise<boolean>;
    updateStock: (id: string, quantity: number, operation: "add" | "subtract") => Promise<({
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            slug: string | null;
            image: string | null;
            parentId: string | null;
        } | null;
        images: {
            createdAt: Date;
            id: string;
            order: number;
            productId: string;
            imageUrl: string;
            altText: string | null;
            isPrimary: boolean;
        }[];
    } & {
        name: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        discountPrice: import("@prisma/client-runtime-utils").Decimal | null;
        stockQuantity: number;
        inStock: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        sku: string | null;
        description: string | null;
        discount: import("@prisma/client-runtime-utils").Decimal | null;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
    }) | null>;
    addProductImage: (productId: string, imageData: ProductImageDTO) => Promise<({
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            slug: string | null;
            image: string | null;
            parentId: string | null;
        } | null;
        images: {
            createdAt: Date;
            id: string;
            order: number;
            productId: string;
            imageUrl: string;
            altText: string | null;
            isPrimary: boolean;
        }[];
        seo: {
            updatedAt: Date;
            id: string;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            productId: string;
            slug: string | null;
        } | null;
    } & {
        name: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        discountPrice: import("@prisma/client-runtime-utils").Decimal | null;
        stockQuantity: number;
        inStock: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        sku: string | null;
        description: string | null;
        discount: import("@prisma/client-runtime-utils").Decimal | null;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
    }) | null>;
    deleteProductImage: (productId: string, imageId: string) => Promise<boolean>;
    updateProductSEO: (id: string, seoData: ProductSEOUpdateDTO) => Promise<({
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            slug: string | null;
            image: string | null;
            parentId: string | null;
        } | null;
        images: {
            createdAt: Date;
            id: string;
            order: number;
            productId: string;
            imageUrl: string;
            altText: string | null;
            isPrimary: boolean;
        }[];
        seo: {
            updatedAt: Date;
            id: string;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            productId: string;
            slug: string | null;
        } | null;
    } & {
        name: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        discountPrice: import("@prisma/client-runtime-utils").Decimal | null;
        stockQuantity: number;
        inStock: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        sku: string | null;
        description: string | null;
        discount: import("@prisma/client-runtime-utils").Decimal | null;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
    }) | null>;
};
//# sourceMappingURL=product.service.d.ts.map