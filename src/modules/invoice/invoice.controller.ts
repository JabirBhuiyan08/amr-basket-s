import { Request, Response } from "express";
import { invoiceService } from "./invoice.service";
import { AppError } from "../../utils/app-error";

const getInvoiceByOrderId = async (req: Request, res: Response) => {
    try {
        const orderId = typeof req.params.orderId === "string" ? req.params.orderId : undefined;
        if (!orderId) {
            throw new AppError(400, "Order ID is required");
        }

        const invoice = await invoiceService.getInvoiceByOrderId(orderId);
        if (!invoice) {
            throw new AppError(404, "Invoice not found");
        }

        if (req.user?.role !== "ADMIN" && invoice.order.userId !== req.user?.id) {
            throw new AppError(403, "You can only view your own invoices");
        }

        res.status(200).json({ success: true, data: invoice });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};

const getInvoiceById = async (req: Request, res: Response) => {
    try {
        const invoiceId = typeof req.params.invoiceId === "string" ? req.params.invoiceId : undefined;
        if (!invoiceId) {
            throw new AppError(400, "Invoice ID is required");
        }

        const invoice = await invoiceService.getInvoiceById(invoiceId);
        if (!invoice) {
            throw new AppError(404, "Invoice not found");
        }

        if (req.user?.role !== "ADMIN" && invoice.order.userId !== req.user?.id) {
            throw new AppError(403, "You can only view your own invoices");
        }

        res.status(200).json({ success: true, data: invoice });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};

export const invoiceController = {
    getInvoiceByOrderId,
    getInvoiceById,
};

export default invoiceController;
