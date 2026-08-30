import { Request, Response } from "express";
export declare const orderController: {
    getOrders: (req: Request, res: Response) => Promise<void>;
    getAllOrders: (req: Request, res: Response) => Promise<void>;
    getOrderById: (req: Request, res: Response) => Promise<void>;
    updateOrderStatus: (req: Request, res: Response) => Promise<void>;
    updatePaymentStatus: (req: Request, res: Response) => Promise<void>;
    getTotalSales: (req: Request, res: Response) => Promise<void>;
};
export default orderController;
//# sourceMappingURL=order.controller.d.ts.map