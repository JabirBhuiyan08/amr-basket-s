export interface CreateReviewDTO {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: Array<{
    imageUrl: string;
  }>;
  userId?: string;
}

export interface UpdateReviewDTO {
  rating?: number;
  title?: string;
  comment?: string;
  status?: ReviewStatus;
  reply?: string;
  images?: Array<{
    imageUrl: string;
  }>;
}

export interface ReviewQueryDTO {
  page?: number;
  limit?: number;
  productId?: string;
  userId?: string;
  status?: ReviewStatus;
  minRating?: number;
  maxRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  HIDDEN = 'HIDDEN',
  REJECTED = 'REJECTED'
}

export interface ReviewResponseDTO {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  status: ReviewStatus;
  helpful: number;
  images?: ReviewImageDTO[];
  user?: {
    id: string;
    name?: string;
    email?: string;
  };
  product?: {
    id: string;
    name: string;
    price: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewImageDTO {
  id: string;
  reviewId: string;
  imageUrl: string;
  createdAt: Date;
}

export interface ReviewStatsDTO {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}