import { Router } from 'express';
import { categoryController } from './category.controller';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/tree', categoryController.getCategoryTree);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/products/:id', categoryController.getCategoryProducts);
router.get('/:id', categoryController.getCategoryById);

// Admin/Protected routes (add authentication middleware as needed)
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export const categoryRouter = router;