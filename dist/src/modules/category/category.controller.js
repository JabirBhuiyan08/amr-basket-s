import { categoryService } from './category.service';
import { AppError } from '../../utils/app-error';
const handleError = (error, res) => {
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
const getAllCategories = async (req, res) => {
    try {
        const query = {};
        if (req.query.page) {
            query.page = parseInt(req.query.page);
        }
        if (req.query.limit) {
            query.limit = parseInt(req.query.limit);
        }
        if (req.query.search) {
            query.search = req.query.search;
        }
        if (req.query.parentId) {
            query.parentId = req.query.parentId;
        }
        if (req.query.sortBy) {
            query.sortBy = req.query.sortBy;
        }
        if (req.query.sortOrder) {
            query.sortOrder = req.query.sortOrder;
        }
        const result = await categoryService.getAllCategories(query);
        res.status(200).json({
            success: true,
            data: result.data,
            meta: result.meta,
        });
    }
    catch (error) {
        handleError(error, res);
    }
};
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            throw new AppError(404, 'Category not found');
        }
        res.status(200).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        handleError(error, res);
    }
};
const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryService.getCategoryBySlug(slug);
        if (!category) {
            throw new AppError(404, 'Category not found');
        }
        res.status(200).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        handleError(error, res);
    }
};
const getCategoryTree = async (req, res) => {
    try {
        const tree = await categoryService.getCategoryTree();
        res.status(200).json({
            success: true,
            data: tree,
        });
    }
    catch (error) {
        handleError(error, res);
    }
};
const getCategoryProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const result = await categoryService.getCategoryProducts(id, page, limit);
        res.status(200).json({
            success: true,
            data: result.data,
            meta: result.meta,
        });
    }
    catch (error) {
        handleError(error, res);
    }
};
const createCategory = async (req, res) => {
    try {
        const data = req.body;
        if (!data.name) {
            throw new AppError(400, 'Category name is required');
        }
        const category = await categoryService.createCategory(data);
        res.status(201).json({
            success: true,
            data: category,
            message: 'Category created successfully',
        });
    }
    catch (error) {
        handleError(error, res);
    }
};
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const category = await categoryService.updateCategory(id, data);
        res.status(200).json({
            success: true,
            data: category,
            message: 'Category updated successfully',
        });
    }
    catch (error) {
        handleError(error, res);
    }
};
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await categoryService.deleteCategory(id);
        if (!deleted) {
            throw new AppError(404, 'Category not found');
        }
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    }
    catch (error) {
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
//# sourceMappingURL=category.controller.js.map