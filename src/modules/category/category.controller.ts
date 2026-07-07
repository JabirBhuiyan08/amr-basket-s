import { Request, Response } from 'express';
import { categoryService } from './category.service';
import { AppError } from '../../utils/app-error';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryQueryDTO,
} from './category.types';

const handleError = (error: any, res: Response) => {
  console.error('Category Controller Error:', error);

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

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const query: CategoryQueryDTO = {};

    if (req.query.page) {
      query.page = parseInt(req.query.page as string);
    }
    if (req.query.limit) {
      query.limit = parseInt(req.query.limit as string);
    }
    if (req.query.search) {
      query.search = req.query.search as string;
    }
    if (req.query.parentId) {
      query.parentId = req.query.parentId as string;
    }
    if (req.query.sortBy) {
      query.sortBy = req.query.sortBy as string;
    }
    if (req.query.sortOrder) {
      query.sortOrder = req.query.sortOrder as 'asc' | 'desc';
    }

    const result = await categoryService.getAllCategories(query);

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    handleError(error, res);
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await categoryService.getCategoryById(id as string);

    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    handleError(error, res);
  }
};

const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const category = await categoryService.getCategoryBySlug(slug as string);

    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    handleError(error, res);
  }
};

const getCategoryTree = async (req: Request, res: Response) => {
  try {
    const tree = await categoryService.getCategoryTree();

    res.status(200).json({
      success: true,
      data: tree,
    });
  } catch (error) {
    handleError(error, res);
  }
};

const getCategoryProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await categoryService.getCategoryProducts(id as string, page, limit);

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    handleError(error, res);
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const data: CreateCategoryDTO = req.body;

    if (!data.name) {
      throw new AppError(400, 'Category name is required');
    }

    const category = await categoryService.createCategory(data);

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    handleError(error, res);
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: UpdateCategoryDTO = req.body;

    const category = await categoryService.updateCategory(id as string, data);

    res.status(200).json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    handleError(error, res);
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await categoryService.deleteCategory(id as string);

    if (!deleted) {
      throw new AppError(404, 'Category not found');
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const categoryController = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  getCategoryTree,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
};