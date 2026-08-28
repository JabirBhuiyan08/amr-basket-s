import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { getIO } from "../../socket/socketManager";

const getCartIdentifier = (req: Request) => {
    if (req.user?.id) {
        return req.user.id;
    }

    const headerGuestId = req.headers["x-guest-id"];
    if (typeof headerGuestId === "string" && headerGuestId.trim()) {
        return headerGuestId.trim();
    }

    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const agent = req.get("user-agent") || "unknown";

    return `guest:${ip}:${agent.slice(0, 40)}`;
};

const normalizeQuantity = (value: unknown) => {
    const parsed = typeof value === "number" ? value : Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
        throw new AppError(400, "Quantity must be a positive integer");
    }

    return parsed;
};

const normalizeAddress = (address: unknown) => {
    if (!address || typeof address !== "object") {
        throw new AppError(400, "Shipping address is required");
    }

    const normalized = address as Record<string, unknown>;
    const line1 = normalized.addressLine1 || normalized.address || normalized.street || normalized.line1;

    if (!line1 || typeof line1 !== "string" || !String(line1).trim()) {
        throw new AppError(400, "Shipping address line is required");
    }

    if (!normalized.city || typeof normalized.city !== "string" || !String(normalized.city).trim()) {
        throw new AppError(400, "City is required in the shipping address");
    }

    if (!normalized.country || typeof normalized.country !== "string" || !String(normalized.country).trim()) {
        throw new AppError(400, "Country is required in the shipping address");
    }

    return {
        addressLine1: String(line1).trim(),
        addressLine2: normalized.addressLine2 ? String(normalized.addressLine2) : undefined,
        city: String(normalized.city).trim(),
        state: normalized.state ? String(normalized.state).trim() : undefined,
        country: String(normalized.country).trim(),
        postalCode: normalized.postalCode ? String(normalized.postalCode).trim() : undefined,
        phone: normalized.phone ? String(normalized.phone).trim() : undefined,
        fullName: normalized.fullName ? String(normalized.fullName).trim() : undefined,
    };
};

const addToCart = async (req: Request, res: Response) => {
    const { productId, quantity = 1 } = req.body as { productId?: unknown; quantity?: unknown };

    const normalizedProductId = typeof productId === "string" ? productId : undefined;

    if (!normalizedProductId) {
        throw new AppError(400, "Product ID is required");
    }

    const parsedQuantity = normalizeQuantity(quantity);
    const cartUserId = getCartIdentifier(req);

    const product = await prisma.product.findUnique({
        where: { id: normalizedProductId },
        select: {
            id: true,
            name: true,
            price: true,
            inStock: true,
            stockQuantity: true,
        },
    });

    if (!product) {
        throw new AppError(404, "Product not found");
    }

    if (!product.inStock || product.stockQuantity < parsedQuantity) {
        throw new AppError(400, "Selected quantity exceeds available stock");
    }

    const existingItem = await prisma.cartItem.findUnique({
        where: {
            userId_productId: {
                userId: cartUserId,
                productId: normalizedProductId,
            },
        },
    });

    const cartItem = existingItem
        ? await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + parsedQuantity },
        })
        : await prisma.cartItem.create({
            data: {
                userId: cartUserId,
                productId: normalizedProductId,
                quantity: parsedQuantity,
            },
        });

    res.status(200).json({
        success: true,
        message: "Product added to cart",
        data: cartItem,
    });
};

const getCart = async (req: Request, res: Response) => {
    const cartUserId = getCartIdentifier(req);

    const cartItems = await prisma.cartItem.findMany({
        where: { userId: cartUserId },
        include: {
            product: {
                include: {
                    images: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
        success: true,
        data: cartItems,
    });
};

const updateCartItem = async (req: Request, res: Response) => {
    const productId = typeof req.params.productId === "string" ? req.params.productId : undefined;
    const { quantity } = req.body as { quantity?: unknown };

    if (!productId) {
        throw new AppError(400, "Product ID is required");
    }

    const parsedQuantity = normalizeQuantity(quantity);
    const cartUserId = getCartIdentifier(req);

    const existingItem = await prisma.cartItem.findUnique({
        where: {
            userId_productId: {
                userId: cartUserId,
                productId,
            },
        },
    });

    if (!existingItem) {
        throw new AppError(404, "Cart item not found");
    }

    const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: parsedQuantity },
    });

    res.status(200).json({
        success: true,
        message: "Cart item updated",
        data: updatedItem,
    });
};

const removeCartItem = async (req: Request, res: Response) => {
    const productId = typeof req.params.productId === "string" ? req.params.productId : undefined;
    const cartUserId = getCartIdentifier(req);

    if (!productId) {
        throw new AppError(400, "Product ID is required");
    }

    const existingItem = await prisma.cartItem.findUnique({
        where: {
            userId_productId: {
                userId: cartUserId,
                productId,
            },
        },
    });

    if (!existingItem) {
        throw new AppError(404, "Cart item not found");
    }

    await prisma.cartItem.delete({ where: { id: existingItem.id } });

    res.status(200).json({
        success: true,
        message: "Cart item removed",
    });
};

const checkout = async (req: Request, res: Response) => {
    if (!req.user?.id) {
        throw new AppError(401, "Please log in to place an order");
    }

    const { shippingAddress, billingAddress, paymentMethod = "COD", notes } = req.body as {
        shippingAddress?: unknown;
        billingAddress?: unknown;
        paymentMethod?: string;
        notes?: string;
    };

    const normalizedAddress = normalizeAddress(shippingAddress);

    if (!req.user?.id) {
        throw new AppError(401, "Authentication required");
    }

    const cartItems = await prisma.cartItem.findMany({
        where: { userId: req.user.id },
        include: { product: true },
    });

    if (!cartItems.length) {
        throw new AppError(400, "Your cart is empty");
    }

    const subtotal = cartItems.reduce((total, item) => {
        const price = Number(item.product.price);
        return total + price * item.quantity;
    }, 0);

    const shippingCost = 50;
    const totalAmount = subtotal + shippingCost;

    const order = await prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
            data: {
                userId: req.user!.id,
                orderNumber: `ORD-${Date.now()}`,
                 subtotal: subtotal.toFixed(2),
                 shippingCost: shippingCost.toFixed(2),
                 tax: "0.00",
                 totalAmount: totalAmount.toFixed(2),
                shippingAddress: normalizedAddress,
                billingAddress: billingAddress ? normalizeAddress(billingAddress) : normalizedAddress,
                paymentMethod: paymentMethod ?? "COD",
                notes: notes ?? null,
            },
        });

        await tx.orderItem.createMany({
            data: cartItems.map((item) => ({
                orderId: createdOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price.toString(),
                total: (Number(item.product.price) * item.quantity).toFixed(2),
            })),
        });

        const invoiceNumber = `INV-${Date.now()}-${createdOrder.id.slice(0, 6).toUpperCase()}`;
        await tx.invoice.create({
            data: {
                orderId: createdOrder.id,
                invoiceNumber,
                pdfUrl: `/invoices/${invoiceNumber}.pdf`,
                sentAt: new Date(),
            },
        });

        await tx.cartItem.deleteMany({
            where: { userId: req.user!.id },
        });

        return createdOrder;
    });

    try {
        const io = getIO();
        io.to('admin-room').emit('order:created', {
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            customerName: req.user?.name || 'Customer',
            userId: req.user?.id,
            id: order.id,
            createdAt: order.createdAt,
        });
    } catch (err) {
        console.error('Failed to emit order created socket event:', err);
    }

    res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
    });
};

const mergeCart = async (req: Request, res: Response) => {
    if (!req.user?.id) {
        throw new AppError(401, "Authentication required");
    }

    const guestId = req.body?.guestId || req.headers["x-guest-id"];
    const normalizedGuestId = typeof guestId === "string" ? guestId.trim() : "";

    if (!normalizedGuestId) {
        throw new AppError(400, "Guest ID is required");
    }

    if (normalizedGuestId === req.user.id) {
        return res.status(200).json({
            success: true,
            message: "No guest cart items to merge",
            data: { merged: 0 },
        });
    }

    const guestItems = await prisma.cartItem.findMany({
        where: { userId: normalizedGuestId },
    });

    if (!guestItems.length) {
        return res.status(200).json({
            success: true,
            message: "No guest cart items to merge",
            data: { merged: 0 },
        });
    }

    for (const item of guestItems) {
        await prisma.cartItem.upsert({
            where: {
                userId_productId: {
                    userId: req.user.id,
                    productId: item.productId,
                },
            },
            update: {
                quantity: { increment: item.quantity },
            },
            create: {
                userId: req.user.id,
                productId: item.productId,
                quantity: item.quantity,
            },
        });
    }

    await prisma.cartItem.deleteMany({
        where: { userId: normalizedGuestId },
    });

    res.status(200).json({
        success: true,
        message: "Cart merged successfully",
        data: { merged: guestItems.length },
    });
};

export const cartServer = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    checkout,
    mergeCart,
};

export default cartServer;
