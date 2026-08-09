import { Request, Response } from "express";
export declare const visitorController: {
    trackPageView: (req: Request, res: Response) => Promise<void>;
    trackProductView: (req: Request, res: Response) => Promise<void>;
    trackCartActivity: (req: Request, res: Response) => Promise<void>;
    getVisitorAnalytics: (req: Request, res: Response) => Promise<void>;
    getProductAnalytics: (req: Request, res: Response) => Promise<void>;
};
export default visitorController;
//# sourceMappingURL=visitor.controller.d.ts.map