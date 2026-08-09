import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { invoiceService } from "../invoice/invoice.service";

const getOrdersForUser = async (userId: string) => {
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
    try {
        return await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
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
    } catch (error) {
        console.error("getAllOrders error:", error);
        // Fallback: return orders without user relation if it fails
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
    }
};

const getOrderById = async (id: string) => {
    try {
        return await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
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
    } catch (error) {
        console.error("getOrderById error:", error);
        // Fallback: return order without user relation if it fails
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
    }
};

const normalizeStatus = (status: string) => {
    const input = status.toUpperCase();

    if (input === "PACKING") return "PROCESSING";
    if (input === "DELIVERING") return "SHIPPED";
    if (input === "PROCESS") return "PROCESSING";
    if (input === "SHIPPED") return "SHIPPED";
    if (input === "PENDING") return "PENDING";
    if (input === "DELIVERED") return "DELIVERED";
    if (input === "CANCELLED") return "CANCELLED";
    if (input === "REFUNDED") return "REFUNDED";

    return input;
};

const updateOrderStatus = async (id: string, status: string) => {
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
            status: normalizedStatus as any,
            isDelivered: normalizedStatus === "DELIVERED",
            deliveredAt: normalizedStatus === "DELIVERED" ? new Date() : null,
        },
    });

    if (normalizedStatus === "DELIVERED") {
        await invoiceService.createInvoiceForOrder(updatedOrder.id);
    }

    return updatedOrder;
};

const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    const normalized = paymentStatus.toUpperCase();
    const valid = ["PENDING", "PAID", "FAILED", "REFUNDED"];

    if (!valid.includes(normalized)) {
        throw new AppError(400, "Invalid payment status");
    }

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
        throw new AppError(404, "Order not found");
    }

    return prisma.order.update({
        where: { id },
        data: { paymentStatus: normalized as any },
    });
};

export const orderService = {
    getOrdersForUser,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
};
