import express,{ Router } from 'express';
import { productController } from './product.controller';


const router = express.Router();


// Public routes
router.get('/', productController.getAllProducts.bind(productController));
router.get('/search', productController.searchProducts.bind(productController));
router.get('/category/:categoryId', productController.getProductsByCategory.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));

// Protected routes (add authentication middleware as needed)
router.post('/', productController.createProduct.bind(productController));
router.put('/:id', productController.updateProduct.bind(productController));
router.delete('/:id', productController.deleteProduct.bind(productController));

// Stock management
router.patch('/stock/:id', productController.updateStock.bind(productController));

// Image management
router.post('/images/:id', productController.addProductImage.bind(productController));
router.delete('/images/:id/:imageId', productController.deleteProductImage.bind(productController));

// SEO management
router.patch('/seo/:id', productController.updateProductSEO.bind(productController));

export const productRouter: Router = router;