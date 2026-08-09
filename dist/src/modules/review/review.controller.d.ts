import { Request, Response } from 'express';
export declare const reviewController: {
    getAllReviews: (req: Request, res: Response) => Promise<void>;
    getReviewById: (req: Request, res: Response) => Promise<void>;
    getReviewsByProduct: (req: Request, res: Response) => Promise<void>;
    getReviewStats: (req: Request, res: Response) => Promise<void>;
    createReview: (req: Request, res: Response) => Promise<void>;
    updateReview: (req: Request, res: Response) => Promise<void>;
    deleteReview: (req: Request, res: Response) => Promise<void>;
    updateReviewStatus: (req: Request, res: Response) => Promise<void>;
    replyReview: (req: Request, res: Response) => Promise<void>;
    markReviewHelpful: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=review.controller.d.ts.map