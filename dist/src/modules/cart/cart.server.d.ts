import { Request, Response } from "express";
export declare const cartServer: {
    addToCart: (req: Request, res: Response) => Promise<void>;
    getCart: (req: Request, res: Response) => Promise<void>;
    updateCartItem: (req: Request, res: Response) => Promise<void>;
    removeCartItem: (req: Request, res: Response) => Promise<void>;
    checkout: (req: Request, res: Response) => Promise<void>;
};
export default cartServer;
//# sourceMappingURL=cart.server.d.ts.map