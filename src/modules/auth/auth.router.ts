import { Router } from 'express';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';

const router = Router();

// Google OAuth callback - exchanges code for tokens and creates/updates user
router.post('/google', authController.googleAuth);

// Get current authenticated user
router.get('/me', auth(), authController.me);

export const authRouter = router;
