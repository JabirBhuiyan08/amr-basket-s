
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductQueryDTO,
  ProductImageDTO,
  ProductSEOUpdateDTO
} from './product.types';

import slugify from 'slugify';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/app-error';
import { Prisma } from '../../../generated/prisma/client';
import { any } from 'zod';


const VALID_SORT_FIELDS: readonly string[] = [
  'name',
  'price',
  'discountPrice',
  'stockQuantity',
  'inStock',
  'createdAt',
  'updatedAt',
] as const;

type ValidSortField = typeof VALID_SORT_FIELDS[number];


const getAllProducts = async (query: ProductQueryDTO) => {
  const {
    page = 1,
    limit = 10,
    search,
    categoryId,
    minPrice,
    maxPrice,
    inStock,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    minRating,
  } = query;

  const safeSortBy = VALID_SORT_FIELDS.includes(sortBy)
    ? sortBy as ValidSortField
    : 'createdAt';

  const skip = (page - 1) * limit;
  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { id: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (inStock !== undefined) {
    where.inStock = inStock;
  }

  if (minRating !== undefined) {
    where.reviews = {
      some: {
        rating: {
          gte: minRating,
        },
      },
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        seo: true,
        reviews: {
          where: {
            status: 'APPROVED',
          },
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: {
              where: {
                status: 'APPROVED',
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
    prisma.product.count({ where }),
  ]);

  const productsWithRating = products.map((product: any) => {
    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0
      ? reviews.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / reviews.length
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
}

const getProductById = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        seo: true,
        reviews: {
          where: {
            status: 'APPROVED',
          },
          include: {
            images: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    const reviews = product.reviews || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / totalReviews
      : 0;

    const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
      const rating = i + 1;
      const count = reviews.filter((r: { rating: number }) => r.rating === rating).length;
      return {
        rating,
        count,
        percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
      };
    });

    return {
      ...product,
      averageRating,
      totalReviews,
      ratingDistribution,
    };
  } catch (error) {
    console.error('getProductById error:', error);
    throw error;
  }
};

const getProductsByCategory = async (categoryId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const subcategories = await prisma.category.findMany({
    where: {
      parentId: categoryId,
    },
    select: {
      id: true,
    },
  });

  const categoryIds = [categoryId, ...subcategories.map((c: any) => c.id)];

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryIds,
        },
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        reviews: {
          where: {
            status: 'APPROVED',
          },
          select: {
            rating: true,
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
      where: {
        categoryId: {
          in: categoryIds,
        },
      },
    }),
  ]);

  const productsWithRating = products.map((product: any) => {
    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0
      ? reviews.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / reviews.length
      : 0;

    const { reviews: _, ...productWithoutReviews } = product;
    return {
      ...productWithoutReviews,
      averageRating: avgRating,
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
}

const searchProducts = async (query: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const searchWhere: Prisma.ProductWhereInput = {
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { metaTitle: { contains: query, mode: 'insensitive' } },
      { metaKeywords: { contains: query, mode: 'insensitive' } },
    ],
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: searchWhere,
      include: {
        images: {
          where: {
            isPrimary: true,
          },
          take: 1,
        },
        reviews: {
          where: {
            status: 'APPROVED',
          },
          select: {
            rating: true,
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
      where: searchWhere,
    }),
  ]);

  const productsWithRating = products.map((product: any) => {
    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0
      ? reviews.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / reviews.length
      : 0;

    const { reviews: _, ...productWithoutReviews } = product;
    return {
      ...productWithoutReviews,
      averageRating: avgRating,
    };
  });

  return {
    data: productsWithRating,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      searchQuery: query,
    },
  };
}

const createProduct = async (data: CreateProductDTO) => {
  const { seo, images, categoryId, sku, ...productData } = data;

  // Validate SKU if provided
  if (sku) {
    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku: sku }
    });
    
    if (existingProduct) {
      throw new AppError(400, 'SKU already exists');
    }
    
    // Validate SKU format (optional)
    if (sku.length < 3 || sku.length > 20) {
      throw new AppError(400, 'SKU must be between 3 and 20 characters');
    }
  }

  const slug = seo?.slug || slugify(productData.name, { lower: true, strict: true });

  if (seo?.slug) {
    const existing = await prisma.productSEO.findUnique({
      where: { slug: seo.slug },
    });
    if (existing) {
      throw new AppError(400, 'Slug already exists');
    }
  }

  let discountPrice: number | null = null;
  if (productData.discount && productData.discount > 0) {
    discountPrice = Number(productData.price) * (1 - productData.discount / 100);
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Build create data
    const createData: Prisma.ProductCreateInput = {
      name: productData.name,
      price: productData.price,
    };

    // Add SKU if provided
    if (sku) {
      createData.sku = sku;
    }

    // Add optional fields
    if (productData.description !== undefined) {
      createData.description = productData.description;
    }
    if (productData.discount !== undefined) {
      createData.discount = productData.discount;
    }
    if (productData.inStock !== undefined) {
      createData.inStock = productData.inStock;
    } else {
      createData.inStock = true;
    }
    if (productData.stockQuantity !== undefined) {
      createData.stockQuantity = productData.stockQuantity;
    } else {
      createData.stockQuantity = 0;
    }
    if (productData.metaTitle !== undefined) {
      createData.metaTitle = productData.metaTitle;
    }
    if (productData.metaDescription !== undefined) {
      createData.metaDescription = productData.metaDescription;
    }
    if (productData.metaKeywords !== undefined) {
      createData.metaKeywords = productData.metaKeywords;
    }
    if (discountPrice !== null) {
      createData.discountPrice = discountPrice;
    }
    if (categoryId) {
      createData.category = {
        connect: { id: categoryId }
      };
    }
    if (seo) {
      const seoCreateData: Prisma.ProductSEOUncheckedCreateWithoutProductInput = {
        slug,
      };

      if (seo.metaTitle !== undefined) {
        seoCreateData.metaTitle = seo.metaTitle;
      }
      if (seo.metaDescription !== undefined) {
        seoCreateData.metaDescription = seo.metaDescription;
      }
      if (seo.metaKeywords !== undefined) {
        seoCreateData.metaKeywords = seo.metaKeywords;
      }

      createData.seo = {
        create: seoCreateData,
      };
    }

    const product = await tx.product.create({
      data: createData,
      include: {
        category: true,
        images: true,
        seo: true,
      },
    });

    // Handle images
    if (images && images.length > 0) {
      const imageData = images.map((img, index) => {
        const data: any = {
          productId: product.id,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary || index === 0,
          order: index,
        };
        
        if (img.altText && img.altText.trim() !== '') {
          data.altText = img.altText;
        }
        
        return data;
      });
      
      await tx.productImage.createMany({
        data: imageData,
      });
    }

    // Return the complete product
    return tx.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        seo: true,
      },
    });
  });
};

const updateProduct = async (id: string, data: UpdateProductDTO) => {
  const { seo, categoryId, sku, images, ...productData } = data;

  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      seo: true,
    },
  });

  if (!existingProduct) {
    throw new AppError(404, 'Product not found');
  }

  // If updating SKU, check if it's already taken by another product
  if (sku && sku !== existingProduct.sku) {
    const productWithSameSku = await prisma.product.findUnique({
      where: { sku },
    });

    if (productWithSameSku) {
      throw new AppError(400, 'SKU already exists');
    }
  }

  let discountPrice: number | null = existingProduct.discountPrice ? existingProduct.discountPrice.toNumber() : null;
  if (productData.discount !== undefined) {
    const price = productData.price ?? existingProduct.price;
    if (productData.discount > 0) {
      discountPrice = Number(price) * (1 - productData.discount / 100);
    } else {
      discountPrice = null;
    }
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Update product fields
    const updateData: Prisma.ProductUpdateInput = {};

    if (productData.name !== undefined) updateData.name = productData.name;
    if (productData.price !== undefined) updateData.price = productData.price;
    if (productData.description !== undefined) updateData.description = productData.description;
    if (productData.discount !== undefined) updateData.discount = productData.discount;
    if (discountPrice !== existingProduct.discountPrice) updateData.discountPrice = discountPrice;
    if (productData.stockQuantity !== undefined) updateData.stockQuantity = productData.stockQuantity;
    if (productData.inStock !== undefined) updateData.inStock = productData.inStock;
    if (productData.metaTitle !== undefined) updateData.metaTitle = productData.metaTitle;
    if (productData.metaDescription !== undefined) updateData.metaDescription = productData.metaDescription;
    if (productData.metaKeywords !== undefined) updateData.metaKeywords = productData.metaKeywords;
    if (sku !== undefined) updateData.sku = sku;

    if (categoryId !== undefined) {
      if (categoryId) {
        updateData.category = { connect: { id: categoryId } };
      } else {
        updateData.category = { disconnect: true };
      }
    }

    const updatedProduct = await tx.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: true,
        seo: true,
      },
    });

    // Update images if provided
    if (images !== undefined) {
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      if (images.length > 0) {
        const imageData = images.map((img, index) => {
          const data: any = {
            productId: id,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary || index === 0,
            order: index,
          };

          if (img.altText && img.altText.trim() !== '') {
            data.altText = img.altText;
          }

          return data;
        });

        await tx.productImage.createMany({
          data: imageData,
        });
      }
    }

    // Update or create SEO
    if (seo) {
      const slug = seo.slug || existingProduct.seo?.slug || existingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (existingProduct.seo) {
        const seoUpdateData: any = { slug };
        if (seo.metaTitle !== undefined) seoUpdateData.metaTitle = seo.metaTitle;
        if (seo.metaDescription !== undefined) seoUpdateData.metaDescription = seo.metaDescription;
        if (seo.metaKeywords !== undefined) seoUpdateData.metaKeywords = seo.metaKeywords;

        await tx.productSEO.update({
          where: { id: existingProduct.seo.id },
          data: seoUpdateData,
        });
      } else {
        const seoCreateData: any = {
          productId: id,
          slug,
        };
        if (seo.metaTitle !== undefined) seoCreateData.metaTitle = seo.metaTitle;
        if (seo.metaDescription !== undefined) seoCreateData.metaDescription = seo.metaDescription;
        if (seo.metaKeywords !== undefined) seoCreateData.metaKeywords = seo.metaKeywords;

        await tx.productSEO.create({
          data: seoCreateData,
        });
      }
    }

    // Return the complete updated product
    return tx.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        seo: true,
      },
    });
  });
};

const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return false;
  }

  await prisma.product.delete({
    where: { id },
  });

  return true;
}

const updateStock = async (id: string, quantity: number, operation: 'add' | 'subtract') => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return null;
  }

  const newQuantity = operation === 'add'
    ? Number(product.stockQuantity) + quantity
    : Number(product.stockQuantity) - quantity;

  if (newQuantity < 0) {
    throw new AppError(400, 'Insufficient stock');
  }

  return prisma.product.update({
    where: { id },
    data: {
      stockQuantity: newQuantity,
      inStock: newQuantity > 0,
    },
    include: {
      images: true,
      category: true,
    },
  });
}

const addProductImage = async (productId: string, imageData: ProductImageDTO) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return null;
  }

  const maxOrder = await prisma.productImage.aggregate({
    where: { productId },
    _max: {
      order: true,
    },
  });

  const order = (maxOrder._max.order ?? -1) + 1;

  if (imageData.isPrimary) {
    await prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });
  }

  const createImageData: Prisma.ProductImageCreateInput = {
    product: {
      connect: { id: productId }
    },
    imageUrl: imageData.imageUrl,
    isPrimary: imageData.isPrimary ?? false,
    order,
  };

  if (imageData.altText !== undefined) {
    createImageData.altText = imageData.altText;
  }

  await prisma.productImage.create({
    data: createImageData,
  });

  return prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        orderBy: {
          order: 'asc',
        },
      },
      category: true,
      seo: true,
    },
  });
}

const deleteProductImage = async (productId: string, imageId: string) => {
  const image = await prisma.productImage.findFirst({
    where: {
      id: imageId,
      productId,
    },
  });

  if (!image) {
    return false;
  }

  await prisma.productImage.delete({
    where: { id: imageId },
  });

  return true;
}

const updateProductSEO = async (id: string, seoData: ProductSEOUpdateDTO) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return null;
  }

  if (seoData.slug) {
    const existing = await prisma.productSEO.findFirst({
      where: {
        slug: seoData.slug,
        NOT: {
          productId: id,
        },
      },
    });
    if (existing) {
      throw new AppError(400, 'Slug already exists');
    }
  }

  const updateData: Prisma.ProductSEOUpdateInput = {};

  if (seoData.metaTitle !== undefined) {
    updateData.metaTitle = seoData.metaTitle;
  }
  if (seoData.metaDescription !== undefined) {
    updateData.metaDescription = seoData.metaDescription;
  }
  if (seoData.metaKeywords !== undefined) {
    updateData.metaKeywords = seoData.metaKeywords;
  }
  if (seoData.slug !== undefined) {
    updateData.slug = seoData.slug;
  }

  // Helper function to build object without undefined values
  function buildSEOData(data: any) {
    const result: any = {};
    if (data.metaTitle !== undefined) result.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) result.metaDescription = data.metaDescription;
    if (data.metaKeywords !== undefined) result.metaKeywords = data.metaKeywords;
    if (data.slug !== undefined) result.slug = data.slug;
    return result;
  }

  // Then use it:
  if (Object.keys(updateData).length > 0) {
    const cleanData = buildSEOData(updateData);

    await prisma.productSEO.upsert({
      where: { productId: id },
      update: updateData,
      create: {
        productId: id,
        ...cleanData,
      },
    });
  }

  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
      seo: true,
    },
  });
}



export const productService = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  addProductImage,
  deleteProductImage,
  updateProductSEO,
}