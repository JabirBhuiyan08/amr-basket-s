import { Request, Response } from "express";
export declare const cartController: {
    addToCart: (req: Request, res: Response) => Promise<void>;
    getCart: (req: Request, res: Response) => Promise<void>;
    updateCartItem: (req: Request, res: Response) => Promise<void>;
    removeCartItem: (req: Request, res: Response) => Promise<void>;
    checkout: (req: Request, res: Response) => Promise<void>;
    mergeCart: (req: Request, res: Response) => Promise<void>;
};
export default cartController;
//# sourceMappingURL=cart.controller.d.ts.map