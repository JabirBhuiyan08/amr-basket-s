import { Request, Response } from "express";
import { invoiceService } from "./invoice.service";
import { AppError } from "../../utils/app-error";
import { generateInvoicePdf, InvoicePdfData } from "../../lib/pdf";

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

const streamInvoicePdf = async (req: Request, res: Response) => {
    try {
        // The .pdf route captures the invoice number before the ".pdf" suffix.
        const path = (req.path || "").replace(/^\/+/, "");
        const match = path.match(/^(.+)\.pdf$/i);
        const invoiceNumber = match ? match[1] : (typeof req.params.invoiceNumber === "string" ? req.params.invoiceNumber : undefined);

        if (!invoiceNumber) {
            throw new AppError(400, "Invoice number is required");
        }

        const invoice = await invoiceService.getInvoiceByInvoiceNumber(invoiceNumber);
        if (!invoice) {
            throw new AppError(404, "Invoice not found");
        }

        if (req.user?.role !== "ADMIN" && invoice.order.userId !== req.user?.id) {
            throw new AppError(403, "You can only view your own invoices");
        }

        const order = invoice.order as {
            orderNumber: string;
            createdAt: Date | string;
            status: string;
            totalAmount: unknown;
            subtotal: unknown;
            shippingCost: unknown | null;
            tax: unknown | null;
            shippingAddress: unknown;
            items: Array<{
                quantity: number;
                price: unknown;
                total: unknown;
                product?: { name?: string } | null;
            }>;
        };

        const shippingAddress =
            typeof order.shippingAddress === "object" && order.shippingAddress ? (order.shippingAddress as Record<string, unknown>) : {};

        const data: InvoicePdfData = {
            invoiceNumber: invoice.invoiceNumber,
            orderNumber: order.orderNumber,
            orderDate: new Date(order.createdAt).toLocaleDateString(),
            status: order.status,
            customerName:
                typeof shippingAddress.fullName === "string"
                    ? shippingAddress.fullName
                    : typeof shippingAddress.name === "string"
                    ? shippingAddress.name
                    : "Unknown",
            customerAddress: [
                shippingAddress.address,
                shippingAddress.city,
                shippingAddress.state,
                shippingAddress.zip,
                shippingAddress.postalCode,
                shippingAddress.country,
            ]
                .filter((value): value is string => typeof value === "string")
                .join(", "),
            customerPhone: typeof shippingAddress.phone === "string" ? shippingAddress.phone : "",
            items: (order.items || []).map((item) => ({
                productName: item.product?.name || "Unknown",
                quantity: Number(item.quantity) || 0,
                price: Number(item.price).toFixed(2),
                total: Number(item.total).toFixed(2),
            })),
            subtotal: Number(order.subtotal).toFixed(2),
            shippingCost: Number(order.shippingCost || 0).toFixed(2),
            tax: Number(order.tax || 0).toFixed(2),
            total: Number(order.totalAmount).toFixed(2),
        };

        const buffer = generateInvoicePdf(data);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
            "Content-Length": buffer.length.toString(),
        });
        res.send(buffer);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};

export const invoiceController = {
    getInvoiceByOrderId,
    getInvoiceById,
    streamInvoicePdf,
};

export default invoiceController;
