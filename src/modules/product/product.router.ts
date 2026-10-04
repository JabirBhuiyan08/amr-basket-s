import express,{ Router } from 'express';
import { productController } from './product.controller';
import auth, { UserRole } from '../../middlewares/auth';


const router = express.Router();


// Public routes
router.get('/admin', auth(UserRole.ADMIN), productController.getAdminProducts.bind(productController));
router.get('/', productController.getAllProducts.bind(productController));
router.get('/search', productController.searchProducts.bind(productController));
router.get('/category/:categoryId', productController.getProductsByCategory.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));

// Product changes are restricted to administrators.
router.post('/', auth(UserRole.ADMIN), productController.createProduct.bind(productController));
router.put('/:id', auth(UserRole.ADMIN), productController.updateProduct.bind(productController));
router.delete('/:id', auth(UserRole.ADMIN), productController.deleteProduct.bind(productController));

// Stock management
router.patch('/stock/:id', auth(UserRole.ADMIN), productController.updateStock.bind(productController));

// Image management
router.post('/images/:id', auth(UserRole.ADMIN), productController.addProductImage.bind(productController));
router.delete('/images/:id/:imageId', auth(UserRole.ADMIN), productController.deleteProductImage.bind(productController));

// SEO management
router.patch('/seo/:id', auth(UserRole.ADMIN), productController.updateProductSEO.bind(productController));

export const productRouter: Router = router;