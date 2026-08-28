import {
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewQueryDTO,
  ReviewStatus,
  ReviewStatsDTO,
} from './review.types';

import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/app-error';
import { Prisma } from '../../../generated/prisma/client';
import { emitAdminNotification } from '../../socket/socketManager';

const VALID_SORT_FIELDS: readonly string[] = [
  'rating',
  'helpful',
  'createdAt',
  'updatedAt',
] as const;

type ValidSortField = typeof VALID_SORT_FIELDS[number];

// Get all reviews with filtering and pagination
const getAllReviews = async (query: ReviewQueryDTO) => {
  const {
    page = 1,
    limit = 10,
    productId,
    userId,
    status,
    minRating,
    maxRating,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const safeSortBy = VALID_SORT_FIELDS.includes(sortBy as string)
    ? sortBy as ValidSortField
    : 'createdAt';

  const skip = (page - 1) * limit;
  const where: Prisma.ReviewWhereInput = {};

  if (productId) {
    where.productId = productId;
  }

  if (userId) {
    where.userId = userId;
  }

  if (status) {
    where.status = status;
  }

  if (minRating !== undefined || maxRating !== undefined) {
    where.rating = {};
    if (minRating !== undefined) where.rating.gte = minRating;
    if (maxRating !== undefined) where.rating.lte = maxRating;
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: {
              where: { isPrimary: true },
              take: 1,
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
    prisma.review.count({ where }),
  ]);

  return {
    data: reviews,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get review by ID
const getReviewById = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          description: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!review) {
    return null;
  }

  return review;
};

// Get reviews by product
const getReviewsByProduct = async (
  productId: string,
  page: number = 1,
  limit: number = 10,
  status: ReviewStatus = ReviewStatus.APPROVED
) => {
  const skip = (page - 1) * limit;

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true },
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: {
        productId,
        status,
      },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.review.count({
      where: {
        productId,
        status,
      },
    }),
  ]);

  return {
    data: reviews,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get review statistics for a product
const getReviewStats = async (productId: string): Promise<ReviewStatsDTO> => {
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  const reviews = await prisma.review.findMany({
    where: {
      productId,
      status: ReviewStatus.APPROVED,
    },
    select: {
      rating: true,
    },
  });

  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    return {
      productId,
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: Array.from({ length: 5 }, (_, i) => ({
        rating: i + 1,
        count: 0,
        percentage: 0,
      })),
    };
  }

  const sumRatings = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = sumRatings / totalReviews;

  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = i + 1;
    const count = reviews.filter((r) => r.rating === rating).length;
    return {
      rating,
      count,
      percentage: (count / totalReviews) * 100,
    };
  });

  return {
    productId,
    averageRating,
    totalReviews,
    ratingDistribution,
  };
};

// Create a review
const createReview = async (data: CreateReviewDTO) => {
  const { productId, rating, title, comment, images, userId } = data;

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new AppError(400, 'Rating must be between 1 and 5');
  }

  if (!userId) {
    throw new AppError(400, 'User ID is required to submit a review');
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Enforce one review per user per product using the unique constraint.
    // If the user already has a review for this product, update it instead of creating a duplicate.
    const review = await tx.review.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        rating,
        ...(title !== undefined ? { title } : {}),
        ...(comment !== undefined ? { comment } : {}),
        status: ReviewStatus.PENDING,
      } as any,
      create: {
        userId,
        productId,
        rating,
        ...(title !== undefined ? { title } : {}),
        ...(comment !== undefined ? { comment } : {}),
        status: ReviewStatus.PENDING,
      } as any,
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Handle images if provided
    if (images && images.length > 0) {
      const imageData = images.map((img) => ({
        reviewId: review.id,
        imageUrl: img.imageUrl,
      }));

      await tx.reviewImage.createMany({
        data: imageData,
      });
    }

    // Get the complete review with images
    const createdReview = await tx.review.findUnique({
      where: { id: review.id },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (createdReview) {
      emitAdminNotification({
        id: createdReview.id,
        title: 'New Product Review',
        message: `New ${createdReview.rating}-star review for ${createdReview.product?.name || 'a product'}`,
        type: 'info',
      });
    }

    return createdReview;
  });
};

// Update a review
const updateReview = async (id: string, data: UpdateReviewDTO) => {
  const { rating, title, comment, status, reply, images } = data;

  // Check if review exists
  const existingReview = await prisma.review.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!existingReview) {
    throw new AppError(404, 'Review not found');
  }

  // Validate rating if provided
  if (rating !== undefined && (rating < 1 || rating > 5)) {
    throw new AppError(400, 'Rating must be between 1 and 5');
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const updateData: any = {};

    if (rating !== undefined) {
      updateData.rating = rating;
    }
    if (title !== undefined) {
      updateData.title = title;
    }
    if (comment !== undefined) {
      updateData.comment = comment;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (reply !== undefined) {
      updateData.reply = reply;
    }

    // Update review
    if (Object.keys(updateData).length > 0) {
      await tx.review.update({
        where: { id },
        data: updateData,
      });
    }

    // Update images if provided
    if (images !== undefined) {
      // Delete existing images
      await tx.reviewImage.deleteMany({
        where: { reviewId: id },
      });

      // Create new images
      if (images.length > 0) {
        const imageData = images.map((img) => ({
          reviewId: id,
          imageUrl: img.imageUrl,
        }));

        await tx.reviewImage.createMany({
          data: imageData,
        });
      }
    }

    // Get updated review
    return tx.review.findUnique({
      where: { id },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  });
};

// Reply to a review (admin only)
const replyReview = async (id: string, reply: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  const updated = await prisma.review.update({
    where: { id },
    data: { reply: reply || null },
    include: {
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  emitAdminNotification({
    id: updated.id,
    title: 'Review Replied',
    message: `Reply saved for review on ${updated.product?.name || 'a product'}`,
    type: 'success',
  });

  return updated;
};

// Delete a review
const deleteReview = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    return false;
  }

  await prisma.review.delete({
    where: { id },
  });

  return true;
};

// Update review status (for admin)
const updateReviewStatus = async (id: string, status: ReviewStatus) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  const updatedReview = await prisma.review.update({
    where: { id },
    data: { status },
    include: {
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  emitAdminNotification({
    id: updatedReview.id,
    title: 'Review Status Updated',
    message: `Review for ${updatedReview.product?.name || 'product'} marked as ${status}`,
    type: 'success',
  });

  return updatedReview;
};

// Mark review as helpful (toggle like/unlike)
const markReviewHelpful = async (reviewId: string, userId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  const existingLike = await prisma.reviewLike.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  });

  if (existingLike) {
    // Unlike: remove the like and decrement helpful count
    await prisma.reviewLike.delete({
      where: { id: existingLike.id },
    });

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        helpful: {
          decrement: 1,
        },
      },
    });

    const updated = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        images: true,
      },
    });

    return updated;
  }

  // Like: create a like and increment helpful count
  await prisma.reviewLike.create({
    data: {
      userId,
      reviewId,
    },
  });

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      helpful: {
        increment: 1,
      },
    },
    include: {
      images: true,
    },
  });

  return updated;
};

export const reviewService = {
  getAllReviews,
  getReviewById,
  getReviewsByProduct,
  getReviewStats,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
  replyReview,
  markReviewHelpful,
};