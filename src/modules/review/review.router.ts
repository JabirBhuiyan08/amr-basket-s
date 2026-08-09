import { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { reviewController } from './review.controller';

const router = Router();

// Public routes (no authentication required)
router.get('/', reviewController.getAllReviews);
router.get('/product/stats/:productId', reviewController.getReviewStats);
router.get('/product/:productId', reviewController.getReviewsByProduct);
router.get('/:id', reviewController.getReviewById);

// Authenticated user routes
router.post('/', auth(), reviewController.createReview);
router.put('/:id', auth(), reviewController.updateReview);
router.delete('/:id', auth(), reviewController.deleteReview);

// Admin routes
router.patch('/status/:id', auth(UserRole.ADMIN), reviewController.updateReviewStatus);
router.patch('/reply/:id', auth(UserRole.ADMIN), reviewController.replyReview);
router.patch('/helpful/:id', auth(), reviewController.markReviewHelpful);

export const reviewRouter = router;