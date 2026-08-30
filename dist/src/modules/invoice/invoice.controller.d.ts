import { Request, Response } from "express";
export declare const invoiceController: {
    getInvoiceByOrderId: (req: Request, res: Response) => Promise<void>;
    getInvoiceById: (req: Request, res: Response) => Promise<void>;
    streamInvoicePdf: (req: Request, res: Response) => Promise<void>;
};
export default invoiceController;
//# sourceMappingURL=invoice.controller.d.ts.map