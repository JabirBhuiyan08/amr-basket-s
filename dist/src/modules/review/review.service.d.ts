import { CreateReviewDTO, UpdateReviewDTO, ReviewQueryDTO, ReviewStatus, ReviewStatsDTO } from './review.types';
export declare const reviewService: {
    getAllReviews: (query: ReviewQueryDTO) => Promise<{
        data: ({
            product: {
                name: string;
                id: string;
                images: {
                    createdAt: Date;
                    id: string;
                    order: number;
                    productId: string;
                    imageUrl: string;
                    altText: string | null;
                    isPrimary: boolean;
                }[];
            };
            images: {
                createdAt: Date;
                id: string;
                imageUrl: string;
                reviewId: string;
            }[];
            user: {
                name: string;
                id: string;
                email: string;
            };
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
            reply: string | null;
            helpful: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getReviewById: (id: string) => Promise<({
        product: {
            name: string;
            id: string;
            description: string | null;
            images: {
                createdAt: Date;
                id: string;
                order: number;
                productId: string;
                imageUrl: string;
                altText: string | null;
                isPrimary: boolean;
            }[];
        };
        images: {
            createdAt: Date;
            id: string;
            imageUrl: string;
            reviewId: string;
        }[];
        user: {
            name: string;
            id: string;
            email: string;
        };
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
        reply: string | null;
        helpful: number;
    }) | null>;
    getReviewsByProduct: (productId: string, page?: number, limit?: number, status?: ReviewStatus) => Promise<{
        data: ({
            images: {
                createdAt: Date;
                id: string;
                imageUrl: string;
                reviewId: string;
            }[];
            user: {
                name: string;
                id: string;
                email: string;
            };
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
            reply: string | null;
            helpful: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getReviewStats: (productId: string) => Promise<ReviewStatsDTO>;
    createReview: (data: CreateReviewDTO) => Promise<({
        product: {
            name: string;
            id: string;
        };
        images: {
            createdAt: Date;
            id: string;
            imageUrl: string;
            reviewId: string;
        }[];
        user: {
            name: string;
            id: string;
            email: string;
        };
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
        reply: string | null;
        helpful: number;
    }) | null>;
    updateReview: (id: string, data: UpdateReviewDTO) => Promise<({
        product: {
            name: string;
            id: string;
        };
        images: {
            createdAt: Date;
            id: string;
            imageUrl: string;
            reviewId: string;
        }[];
        user: {
            name: string;
            id: string;
            email: string;
        };
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
        reply: string | null;
        helpful: number;
    }) | null>;
    deleteReview: (id: string) => Promise<boolean>;
    updateReviewStatus: (id: string, status: ReviewStatus) => Promise<{
        product: {
            name: string;
            id: string;
        };
        images: {
            createdAt: Date;
            id: string;
            imageUrl: string;
            reviewId: string;
        }[];
        user: {
            name: string;
            id: string;
            email: string;
        };
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
        reply: string | null;
        helpful: number;
    }>;
    replyReview: (id: string, reply: string) => Promise<{
        product: {
            name: string;
            id: string;
        };
        images: {
            createdAt: Date;
            id: string;
            imageUrl: string;
            reviewId: string;
        }[];
        user: {
            name: string;
            id: string;
            email: string;
        };
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
        reply: string | null;
        helpful: number;
    }>;
    markReviewHelpful: (reviewId: string, userId: string) => Promise<({
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
        reply: string | null;
        helpful: number;
    }) | null>;
};
//# sourceMappingURL=review.service.d.ts.map