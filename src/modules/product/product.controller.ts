import { Request, Response } from 'express';

import { AppError } from '../../utils/app-error';

import {
    CreateProductDTO,
    UpdateProductDTO,
    ProductQueryDTO,
    ProductImageDTO,
    ProductSEOUpdateDTO
} from './product.types';
import { productService } from './product.service';

// Get all products with filtering, sorting, and pagination
const getAllProducts = async (req: Request, res: Response) => {
    try {
        const query = {
            page: req.query.page ? parseInt(req.query.page as string) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
            search: req.query.search as string,
            categoryId: req.query.categoryId as string,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
            inStock: req.query.inStock !== undefined ? req.query.inStock === 'true' : undefined,
            sortBy: req.query.sortBy as string,
            sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc',
            minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
        };

        const result = await productService.getAllProducts(query as ProductQueryDTO);

        res.status(200).json({
            success: true,
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        handleError(error, res);
    }
}

// Get a single product by ID
const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await productService.getProductById(id as string);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error('PRODUCT_CONTROLLER_ERROR:', error);
        handleError(error, res);
    }
}

// Get products by category
const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

        const result = await productService.getProductsByCategory(categoryId as string, page, limit);

        res.status(200).json({
            success: true,
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        handleError(error, res);
    }
}

// Search products
const searchProducts = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string') {
            throw new AppError(400, 'Search query is required');
        }

        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

        const result = await productService.searchProducts(q, page, limit);

        res.status(200).json({
            success: true,
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        handleError(error, res);
    }
}

// Create a new product
// Create a new product
const createProduct = async (req: Request, res: Response) => {
    try {
        // Debug: Log the entire request body and headers
        console.log('===== CREATE PRODUCT DEBUG =====');
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Request Body:', req.body);
        console.log('Request Body Type:', typeof req.body);
        console.log('Request Body Keys:', req.body ? Object.keys(req.body) : 'No body');
        console.log('================================');

        const data: CreateProductDTO = req.body;

        // Validate required fields
        if (!data || !data.name) {
            console.log('Validation failed: name is missing');
            throw new AppError(400, 'Name and price are required');
        }

        if (data.price === undefined || data.price === null) {
            console.log('Validation failed: price is missing');
            throw new AppError(400, 'Name and price are required');
        }

        const product = await productService.createProduct(data);

        res.status(201).json({
            success: true,
            data: product,
            message: 'Product created successfully',
        });
    } catch (error) {
        handleError(error, res);
    }
}

// Update a product
const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data: UpdateProductDTO = req.body;

        // Check if product exists
        const existingProduct = await productService.getProductById(id as string);
        if (!existingProduct) {
            throw new AppError(404, 'Product not found');
        }

        const product = await productService.updateProduct(id as string, data);

        res.status(200).json({
            success: true,
            data: product,
            message: 'Product updated successfully',
        });
    } catch (error) {
        handleError(error, res);
    }
}

// Delete a product
const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await productService.deleteProduct(id as string);

        if (!deleted) {
            throw new AppError(404, 'Product not found');
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        handleError(error, res);
    }
}

// Update product stock
const updateStock = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity, operation } = req.body;

        if (quantity === undefined || !operation) {
            throw new AppError(400, 'Quantity and operation are required');
        }

        if (typeof quantity !== 'number' || quantity <= 0) {
            throw new AppError(400, 'Quantity must be a positive number');
        }

        if (!['add', 'subtract'].includes(operation)) {
            throw new AppError(400, 'Operation must be either "add" or "subtract"');
        }

        const product = await productService.updateStock(id as string, quantity, operation);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        res.status(200).json({
            success: true,
            data: product,
            message: `Stock ${operation}ed successfully`,
        });
    } catch (error) {
        handleError(error, res);
    }
}

// Add product image
const addProductImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const imageData: ProductImageDTO = req.body;

        if (!imageData.imageUrl) {
            throw new AppError(400, 'Image URL is required');
        }

        const product = await productService.addProductImage(id as string, imageData);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        res.status(201).json({
            success: true,
            data: product,
            message: 'Image added successfully',
        });
    } catch (error) {
        handleError(error, res);
    }
}

// Delete product image
const deleteProductImage = async (req: Request, res: Response) => {
    try {
        const { id, imageId } = req.params;

        const deleted = await productService.deleteProductImage(id as string, imageId as string);

        if (!deleted) {
            throw new AppError(404, 'Image not found');
        }

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
        });
    } catch (error) {
        handleError(error, res);
    }
}

// Update product SEO
const updateProductSEO = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const seoData: ProductSEOUpdateDTO = req.body;

        const product = await productService.updateProductSEO(id as string, seoData);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        res.status(200).json({
            success: true,
            data: product,
            message: 'SEO updated successfully',
        });
    } catch (error) {
        handleError(error, res);
    }
}

// Error handler
const handleError = (error: any, res: Response) => {
    console.error('Product Controller Error:', error);
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            error: error.message,
        });
    }

    return res.status(500).json({
        success: false,
        error: error?.message || 'Internal server error',
    });
}


export const productController = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    addProductImage,
    deleteProductImage,
    updateProductSEO,
}