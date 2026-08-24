import { Request, Response } from 'express';
import { authService } from './auth.service';
import { AppError } from '../../utils/app-error';

const googleAuth = async (req: Request, res: Response) => {
  try {
    const { code, redirectUri }: { code?: string; redirectUri?: string } = req.body;

    if (!code) {
      throw new AppError(400, 'Authorization code is required');
    }

    const result = await authService.googleAuth({ code, redirectUri });

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error || 'Google authentication failed',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    console.error('Google auth controller error:', error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return res.status(statusCode).json({
      success: false,
      error: error?.message || 'Google authentication failed',
    });
  }
};

const me = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'You are not authorized');
    }

    const result = await authService.getCurrentUser(userId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error || 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return res.status(statusCode).json({
      success: false,
      error: error?.message || 'Failed to get current user',
    });
  }
};

export const authController = {
  googleAuth,
  me,
};
