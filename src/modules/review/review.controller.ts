import { Request, Response } from 'express';
import { reviewService } from './review.service';
import { AppError } from '../../utils/app-error';
import {
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewQueryDTO,
  ReviewStatus,
} from './review.types';

const handleError = (error: any, res: Response) => {
  console.error('Review Controller Error:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

// Helper to parse query params
const parseReviewQuery = (req: Request): ReviewQueryDTO => {
  const query: ReviewQueryDTO = {};

  if (req.query.page) {
    const page = parseInt(req.query.page as string);
    if (!isNaN(page) && page > 0) query.page = page;
  }

  if (req.query.limit) {
    const limit = parseInt(req.query.limit as string);
    if (!isNaN(limit) && limit > 0) query.limit = limit;
  }

  if (req.query.productId) {
    query.productId = req.query.productId as string;
  }

  if (req.query.userId) {
    query.userId = req.query.userId as string;
  }

  if (req.query.status) {
    const status = req.query.status as string;
    if (Object.values(ReviewStatus).includes(status as ReviewStatus)) {
      query.status = status as ReviewStatus;
    }
  }

  if (req.query.minRating) {
    const minRating = parseInt(req.query.minRating as string);
    if (!isNaN(minRating) && minRating >= 1 && minRating <= 5) {
      query.minRating = minRating;
    }
  }

  if (req.query.maxRating) {
    const maxRating = parseInt(req.query.maxRating as string);
    if (!isNaN(maxRating) && maxRating >= 1 && maxRating <= 5) {
      query.maxRating = maxRating;
    }
  }

  if (req.query.sortBy) {
    query.sortBy = req.query.sortBy as string;
  }

  if (req.query.sortOrder) {
    const sortOrder = req.query.sortOrder as string;
    if (sortOrder === 'asc' || sortOrder === 'desc') {
      query.sortOrder = sortOrder;
    }
  }

  return query;
};

// Get all reviews
const getAllReviews = async (req: Request, res: Response) => {
  try {
    const query = parseReviewQuery(req);
    const result = await reviewService.getAllReviews(query);

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Get review by ID
const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError(400, 'Review ID is required');
    }

    const review = await reviewService.getReviewById(id as string);

    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Get reviews by product
const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const status = req.query.status as ReviewStatus || ReviewStatus.APPROVED;

    if (!productId) {
      throw new AppError(400, 'Product ID is required');
    }

    const result = await reviewService.getReviewsByProduct(productId as string, page, limit, status);

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Get review statistics
const getReviewStats = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      throw new AppError(400, 'Product ID is required');
    }

    const stats = await reviewService.getReviewStats(productId as string);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Create a review
const createReview = async (req: Request, res: Response) => {
  try {
    const data: CreateReviewDTO = req.body;

    if (!req.user?.id) {
      throw new AppError(401, 'Please log in to submit a review');
    }

    // Validate required fields
    if (!data.productId) {
      throw new AppError(400, 'Product ID is required');
    }

    if (data.rating === undefined || data.rating === null) {
      throw new AppError(400, 'Rating is required');
    }

    if (data.rating < 1 || data.rating > 5) {
      throw new AppError(400, 'Rating must be between 1 and 5');
    }

    const review = await reviewService.createReview({
      ...data,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully',
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Update a review
const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: UpdateReviewDTO = req.body;

    if (!id) {
      throw new AppError(400, 'Review ID is required');
    }

    if (!req.user?.id) {
      throw new AppError(401, 'Please log in to update a review');
    }

    // Check if review exists
    const existingReview = await reviewService.getReviewById(id as string);
    if (!existingReview) {
      throw new AppError(404, 'Review not found');
    }

    if (req.user.role !== 'ADMIN' && existingReview.userId !== req.user.id) {
      throw new AppError(403, 'You can only update your own reviews');
    }

    const review = await reviewService.updateReview(id as string, data);

    res.status(200).json({
      success: true,
      data: review,
      message: 'Review updated successfully',
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Delete a review
const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError(400, 'Review ID is required');
    }

    if (!req.user?.id) {
      throw new AppError(401, 'Please log in to delete a review');
    }

    const existingReview = await reviewService.getReviewById(id as string);
    if (!existingReview) {
      throw new AppError(404, 'Review not found');
    }

    if (req.user.role !== 'ADMIN' && existingReview.userId !== req.user.id) {
      throw new AppError(403, 'You can only delete your own reviews');
    }

    const deleted = await reviewService.deleteReview(id as string);

    if (!deleted) {
      throw new AppError(404, 'Review not found');
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Update review status (admin only)
const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      throw new AppError(400, 'Review ID is required');
    }

    if (!status) {
      throw new AppError(400, 'Status is required');
    }

    if (!Object.values(ReviewStatus).includes(status)) {
      throw new AppError(400, 'Invalid status');
    }

    const review = await reviewService.updateReviewStatus(id as string, status);

    res.status(200).json({
      success: true,
      data: review,
      message: 'Review status updated successfully',
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Mark review as helpful
const markReviewHelpful = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError(400, 'Review ID is required');
    }

    const review = await reviewService.markReviewHelpful(id as string);

    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    res.status(200).json({
      success: true,
      data: review,
      message: 'Review marked as helpful',
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const reviewController = {
  getAllReviews,
  getReviewById,
  getReviewsByProduct,
  getReviewStats,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
  markReviewHelpful,
};