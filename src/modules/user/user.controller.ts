import { Request, Response } from 'express';
import { userService } from './user.service';
import { AppError } from '../../utils/app-error';

const listUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'You are not authorized!');
    }

    const search =
      typeof req.query.search === 'string' ? req.query.search : undefined;
    const page = typeof req.query.page === 'string' ? Number(req.query.page) : undefined;
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;

    const result = await userService.listUsers({ search, page, limit });

    res.status(200).json({
      success: true,
      data: result.users,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || 'Something went wrong' });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'You are not authorized!');
    }

    const userId = req.user.id;
    const { name, email, phone, image } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
      image?: string;
    };

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError(400, 'Invalid email address');
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone ? phone : null;
    if (image !== undefined) data.image = image ? image : null;

    const updated = await userService.updateProfile(userId, data as any);

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    const isConflict = error.code === 'P2002';
    res.status(error.statusCode || (isConflict ? 409 : 500)).json({
      success: false,
      error: error.message || 'Something went wrong',
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'You are not authorized!');
    }

    const userId = String(req.params.id);
    const { name, email, phone } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
    };

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError(400, 'Invalid email address');
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone ? phone : null;

    const updated = await userService.updateUser(userId, data as any);

    res.status(200).json({
      success: true,
      data: updated,
      message: 'User updated successfully',
    });
  } catch (error: any) {
    const isConflict = error.code === 'P2002';
    res.status(error.statusCode || (isConflict ? 409 : 500)).json({
      success: false,
      error: error.message || 'Something went wrong',
    });
  }
};

export const userController = {
  updateProfile,
  updateUser,
  listUsers,
};
export default userController;
