import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
const createInvoiceForOrder = async (orderId) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: { product: true },
            },
        },
    });
    if (!order) {
        throw new AppError(404, "Order not found");
    }
    const existingInvoice = await prisma.invoice.findUnique({
        where: { orderId },
    });
    if (existingInvoice) {
        return existingInvoice;
    }
    const invoiceNumber = `INV-${Date.now()}-${order.id.slice(0, 6).toUpperCase()}`;
    return prisma.invoice.create({
        data: {
            orderId,
            invoiceNumber,
            pdfUrl: `/invoices/${invoiceNumber}.pdf`,
            sentAt: new Date(),
        },
    });
};
const getInvoiceByOrderId = async (orderId) => {
    return prisma.invoice.findUnique({
        where: { orderId },
        include: {
            order: {
                include: {
                    items: {
                        include: { product: true },
                    },
                },
            },
        },
    });
};
const getInvoiceByInvoiceNumber = async (invoiceNumber) => {
    return prisma.invoice.findUnique({
        where: { invoiceNumber },
        include: {
            order: {
                include: {
                    items: {
                        include: { product: true },
                    },
                },
            },
        },
    });
};
const getInvoiceById = async (id) => {
    return prisma.invoice.findUnique({
        where: { id },
        include: {
            order: {
                include: {
                    items: {
                        include: { product: true },
                    },
                },
            },
        },
    });
};
export const invoiceService = {
    createInvoiceForOrder,
    getInvoiceByOrderId,
    getInvoiceById,
    getInvoiceByInvoiceNumber,
};
//# sourceMappingURL=invoice.service.js.map