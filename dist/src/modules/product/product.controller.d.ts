import { Request, Response } from 'express';
export declare const productController: {
    getAllProducts: (req: Request, res: Response) => Promise<void>;
    getProductById: (req: Request, res: Response) => Promise<void>;
    getProductsByCategory: (req: Request, res: Response) => Promise<void>;
    searchProducts: (req: Request, res: Response) => Promise<void>;
    createProduct: (req: Request, res: Response) => Promise<void>;
    updateProduct: (req: Request, res: Response) => Promise<void>;
    deleteProduct: (req: Request, res: Response) => Promise<void>;
    updateStock: (req: Request, res: Response) => Promise<void>;
    addProductImage: (req: Request, res: Response) => Promise<void>;
    deleteProductImage: (req: Request, res: Response) => Promise<void>;
    updateProductSEO: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=product.controller.d.ts.map