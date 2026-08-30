import { orderService } from "./order.service";
import { AppError } from "../../utils/app-error";
const serializeOrder = (order) => {
    const shippingAddress = typeof order.shippingAddress === "object" && order.shippingAddress ? order.shippingAddress : {};
    return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        activeStatus: order.status,
        totalAmount: Number(order.totalAmount).toFixed(2),
        subtotal: Number(order.subtotal).toFixed(2),
        shippingCost: Number(order.shippingCost || 0).toFixed(2),
        tax: Number(order.tax || 0).toFixed(2),
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        customerName: shippingAddress.fullName || shippingAddress.name || "Unknown",
        userId: order.userId,
        user: order.user ? {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
            phone: order.user.phone,
        } : null,
        deliveryLocation: shippingAddress,
        orderTime: order.createdAt,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt,
        items: (order.items || []).map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product?.name || "Unknown",
            sku: item.product?.sku || null,
            quantity: item.quantity,
            price: Number(item.price).toFixed(2),
            total: Number(item.total).toFixed(2),
            productImage: item.product?.images?.[0]?.imageUrl || null,
        })),
        invoice: order.invoice ? {
            id: order.invoice.id,
            invoiceNumber: order.invoice.invoiceNumber,
            pdfUrl: order.invoice.pdfUrl,
            sentAt: order.invoice.sentAt,
        } : null,
    };
};
const getOrders = async (req, res) => {
    try {
        if (!req.user?.id) {
            throw new AppError(401, "Please log in to view orders");
        }
        const orders = req.user.role === "ADMIN"
            ? await orderService.getAllOrders()
            : await orderService.getOrdersForUser(req.user.id);
        res.status(200).json({
            success: true,
            data: orders.map(serializeOrder),
        });
    }
    catch (error) {
        console.error("GET_ORDERS_ERROR:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json({
            success: true,
            data: orders.map(serializeOrder),
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const getOrderById = async (req, res) => {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : undefined;
        if (!id) {
            throw new AppError(400, "Order ID is required");
        }
        const order = await orderService.getOrderById(id);
        if (!order) {
            throw new AppError(404, "Order not found");
        }
        if (req.user?.role !== "ADMIN" && order.userId !== req.user?.id) {
            throw new AppError(403, "You can only view your own orders");
        }
        res.status(200).json({
            success: true,
            data: serializeOrder(order),
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : undefined;
        const { status } = req.body;
        if (!id) {
            throw new AppError(400, "Order ID is required");
        }
        if (typeof status !== "string" || !status.trim()) {
            throw new AppError(400, "Order status is required");
        }
        const updatedOrder = await orderService.updateOrderStatus(id, status);
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: serializeOrder(updatedOrder),
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const updatePaymentStatus = async (req, res) => {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : undefined;
        const { paymentStatus } = req.body;
        if (!id) {
            throw new AppError(400, "Order ID is required");
        }
        if (typeof paymentStatus !== "string" || !paymentStatus.trim()) {
            throw new AppError(400, "Payment status is required");
        }
        const updatedOrder = await orderService.updatePaymentStatus(id, paymentStatus);
        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            data: serializeOrder(updatedOrder),
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const getTotalSales = async (req, res) => {
    try {
        const result = await orderService.getTotalSales();
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
export const orderController = {
    getOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    getTotalSales,
};
export default orderController;
//# sourceMappingURL=order.controller.js.map