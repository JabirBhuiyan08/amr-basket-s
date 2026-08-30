import { Request, Response } from 'express';
export declare const categoryController: {
    getAllCategories: (req: Request, res: Response) => Promise<void>;
    getCategoryById: (req: Request, res: Response) => Promise<void>;
    getCategoryBySlug: (req: Request, res: Response) => Promise<void>;
    getCategoryTree: (req: Request, res: Response) => Promise<void>;
    getCategoryProducts: (req: Request, res: Response) => Promise<void>;
    createCategory: (req: Request, res: Response) => Promise<void>;
    updateCategory: (req: Request, res: Response) => Promise<void>;
    deleteCategory: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=category.controller.d.ts.map