import { CreateCategoryDTO, UpdateCategoryDTO, CategoryQueryDTO } from './category.types';
export declare const categoryService: {
    getAllCategories: (query: CategoryQueryDTO) => Promise<{
        data: ({
            _count: {
                children: number;
                products: number;
            };
            children: ({
                _count: {
                    products: number;
                };
            } & {
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
            })[];
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getCategoryById: (id: string) => Promise<({
        _count: {
            children: number;
            products: number;
        };
        parent: {
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
        children: ({
            _count: {
                products: number;
            };
        } & {
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
        })[];
        products: ({
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
        })[];
    } & {
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
    }) | null>;
    getCategoryBySlug: (slug: string) => Promise<({
        _count: {
            children: number;
            products: number;
        };
        parent: {
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
        children: ({
            _count: {
                products: number;
            };
        } & {
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
        })[];
        products: ({
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
        })[];
    } & {
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
    }) | null>;
    getCategoryTree: () => Promise<any[]>;
    createCategory: (data: CreateCategoryDTO) => Promise<{
        parent: {
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
        children: {
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
        }[];
    } & {
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
    }>;
    updateCategory: (id: string, data: UpdateCategoryDTO) => Promise<{
        parent: {
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
        children: {
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
        }[];
    } & {
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
    }>;
    deleteCategory: (id: string) => Promise<boolean>;
    getCategoryProducts: (categoryId: string, page?: number, limit?: number) => Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
};
//# sourceMappingURL=category.service.d.ts.map