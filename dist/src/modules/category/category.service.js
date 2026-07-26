import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/app-error';
import slugify from 'slugify';
const VALID_SORT_FIELDS = [
    'name',
    'createdAt',
    'updatedAt',
];
const getAllCategories = async (query) => {
    const { page = 1, limit = 10, search, parentId, sortBy = 'createdAt', sortOrder = 'desc', } = query;
    const safeSortBy = VALID_SORT_FIELDS.includes(sortBy)
        ? sortBy
        : 'createdAt';
    const skip = (page - 1) * limit;
    const where = {};
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }
    if (parentId !== undefined) {
        where.parentId = parentId || null;
    }
    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            where,
            include: {
                _count: {
                    select: {
                        products: true,
                        children: true,
                    },
                },
                children: {
                    include: {
                        _count: {
                            select: {
                                products: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                [safeSortBy]: sortOrder,
            },
            skip,
            take: limit,
        }),
        prisma.category.count({ where }),
    ]);
    return {
        data: categories,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const getCategoryById = async (id) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            parent: true,
            children: {
                include: {
                    _count: {
                        select: {
                            products: true,
                        },
                    },
                },
            },
            products: {
                take: 10,
                include: {
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                },
            },
            _count: {
                select: {
                    products: true,
                    children: true,
                },
            },
        },
    });
    if (!category) {
        return null;
    }
    return category;
};
const getCategoryBySlug = async (slug) => {
    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            parent: true,
            children: {
                include: {
                    _count: {
                        select: {
                            products: true,
                        },
                    },
                },
            },
            products: {
                take: 10,
                include: {
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                },
            },
            _count: {
                select: {
                    products: true,
                    children: true,
                },
            },
        },
    });
    if (!category) {
        return null;
    }
    return category;
};
const getCategoryTree = async () => {
    // Get all categories
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });
    // Build tree structure
    const categoryMap = new Map();
    const roots = [];
    // First pass: create nodes
    categories.forEach((category) => {
        categoryMap.set(category.id, {
            ...category,
            children: [],
        });
    });
    // Second pass: build tree
    categories.forEach((category) => {
        const node = categoryMap.get(category.id);
        if (category.parentId) {
            const parent = categoryMap.get(category.parentId);
            if (parent) {
                parent.children.push(node);
            }
            else {
                // Parent doesn't exist, treat as root
                roots.push(node);
            }
        }
        else {
            roots.push(node);
        }
    });
    return roots;
};
const createCategory = async (data) => {
    const { name, description, slug, image, parentId, metaTitle, metaDescription, metaKeywords } = data;
    // Generate slug if not provided
    const categorySlug = slug || slugify(name, { lower: true, strict: true });
    // Check if slug already exists
    if (categorySlug) {
        const existing = await prisma.category.findUnique({
            where: { slug: categorySlug },
        });
        if (existing) {
            throw new AppError(400, 'Slug already exists');
        }
    }
    // Check if parent exists
    if (parentId) {
        const parent = await prisma.category.findUnique({
            where: { id: parentId },
        });
        if (!parent) {
            throw new AppError(400, 'Parent category not found');
        }
    }
    const createData = {
        name,
        slug: categorySlug,
    };
    if (description !== undefined) {
        createData.description = description;
    }
    if (image !== undefined) {
        createData.image = image;
    }
    if (parentId !== undefined) {
        createData.parentId = parentId;
    }
    if (metaTitle !== undefined) {
        createData.metaTitle = metaTitle;
    }
    if (metaDescription !== undefined) {
        createData.metaDescription = metaDescription;
    }
    if (metaKeywords !== undefined) {
        createData.metaKeywords = metaKeywords;
    }
    return prisma.category.create({
        data: createData,
        include: {
            parent: true,
            children: true,
        },
    });
};
const updateCategory = async (id, data) => {
    const { name, description, slug, image, parentId, metaTitle, metaDescription, metaKeywords } = data;
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
        where: { id },
    });
    if (!existingCategory) {
        throw new AppError(404, 'Category not found');
    }
    // Check if trying to set parent to itself
    if (parentId === id) {
        throw new AppError(400, 'Category cannot be its own parent');
    }
    // Check if parent exists
    if (parentId) {
        const parent = await prisma.category.findUnique({
            where: { id: parentId },
        });
        if (!parent) {
            throw new AppError(400, 'Parent category not found');
        }
    }
    // Check if slug already exists
    if (slug) {
        const existing = await prisma.category.findFirst({
            where: {
                slug,
                NOT: {
                    id,
                },
            },
        });
        if (existing) {
            throw new AppError(400, 'Slug already exists');
        }
    }
    const updateData = {};
    if (name !== undefined) {
        updateData.name = name;
    }
    if (description !== undefined) {
        updateData.description = description;
    }
    if (slug !== undefined) {
        updateData.slug = slug;
    }
    if (image !== undefined) {
        updateData.image = image;
    }
    if (parentId !== undefined) {
        updateData.parentId = parentId;
    }
    if (metaTitle !== undefined) {
        updateData.metaTitle = metaTitle;
    }
    if (metaDescription !== undefined) {
        updateData.metaDescription = metaDescription;
    }
    if (metaKeywords !== undefined) {
        updateData.metaKeywords = metaKeywords;
    }
    return prisma.category.update({
        where: { id },
        data: updateData,
        include: {
            parent: true,
            children: true,
        },
    });
};
const deleteCategory = async (id) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            children: true,
            products: {
                take: 1,
            },
        },
    });
    if (!category) {
        return false;
    }
    // Check if category has children
    if (category.children.length > 0) {
        throw new AppError(400, 'Cannot delete category with child categories. Delete children first.');
    }
    // Check if category has products
    if (category.products.length > 0) {
        throw new AppError(400, 'Cannot delete category with products. Move or delete products first.');
    }
    await prisma.category.delete({
        where: { id },
    });
    return true;
};
const getCategoryProducts = async (categoryId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!category) {
        throw new AppError(404, 'Category not found');
    }
    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where: {
                categoryId,
            },
            include: {
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
                reviews: {
                    where: { status: 'APPROVED' },
                    select: {
                        rating: true,
                    },
                },
                _count: {
                    select: {
                        reviews: {
                            where: { status: 'APPROVED' },
                        },
                    },
                },
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.product.count({
            where: { categoryId },
        }),
    ]);
    const productsWithRating = products.map((product) => {
        const reviews = product.reviews || [];
        const avgRating = reviews.length > 0
            ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
            : 0;
        const { reviews: _, ...productWithoutReviews } = product;
        return {
            ...productWithoutReviews,
            averageRating: avgRating,
            totalReviews: product._count.reviews,
        };
    });
    return {
        data: productsWithRating,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
export const categoryService = {
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    getCategoryTree,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryProducts,
};
//# sourceMappingURL=category.service.js.map