import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { invoiceService } from "../invoice/invoice.service";
const getOrdersForUser = async (userId) => {
    return prisma.order.findMany({
        where: { userId },
        include: {
            invoice: true,
            items: {
                include: {
                    product: {
                        include: {
                            images: {
                                orderBy: { order: "asc" },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};
const getAllOrders = async () => {
    return prisma.order.findMany({
        include: {
            invoice: true,
            items: {
                include: {
                    product: {
                        include: {
                            images: {
                                orderBy: { order: "asc" },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};
const getOrderById = async (id) => {
    return prisma.order.findUnique({
        where: { id },
        include: {
            invoice: true,
            items: {
                include: {
                    product: {
                        include: {
                            images: {
                                orderBy: { order: "asc" },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
        },
    });
};
const normalizeStatus = (status) => {
    const input = status.toUpperCase();
    if (input === "PACKING")
        return "PROCESSING";
    if (input === "DELIVERING")
        return "SHIPPED";
    if (input === "PROCESS")
        return "PROCESSING";
    if (input === "SHIPPED")
        return "SHIPPED";
    if (input === "PENDING")
        return "PENDING";
    if (input === "DELIVERED")
        return "DELIVERED";
    if (input === "CANCELLED")
        return "CANCELLED";
    if (input === "REFUNDED")
        return "REFUNDED";
    return input;
};
const updateOrderStatus = async (id, status) => {
    const normalizedStatus = normalizeStatus(status);
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
    if (!validStatuses.includes(normalizedStatus)) {
        throw new AppError(400, "Invalid order status");
    }
    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
        throw new AppError(404, "Order not found");
    }
    const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
            status: normalizedStatus,
            isDelivered: normalizedStatus === "DELIVERED",
            deliveredAt: normalizedStatus === "DELIVERED" ? new Date() : null,
        },
    });
    if (normalizedStatus === "DELIVERED") {
        await invoiceService.createInvoiceForOrder(updatedOrder.id);
    }
    return updatedOrder;
};
export const orderService = {
    getOrdersForUser,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
};
//# sourceMappingURL=order.service.js.map