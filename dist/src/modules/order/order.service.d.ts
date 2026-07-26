export declare const orderService: {
    getOrdersForUser: (userId: string) => Promise<({
        invoice: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            invoiceNumber: string;
            pdfUrl: string | null;
            sentAt: Date | null;
            orderId: string;
        } | null;
        items: ({
            product: {
                images: {
                    createdAt: Date;
                    id: string;
                    order: number;
                    productId: string;
                    imageUrl: string;
                    altText: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                discountPrice: import("@prisma/client-runtime-utils").Decimal | null;
                stockQuantity: number;
                inStock: boolean;
                createdAt: Date;
                updatedAt: Date;
                id: string;
                sku: string | null;
                description: string | null;
                discount: import("@prisma/client-runtime-utils").Decimal | null;
                categoryId: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
            };
        } & {
            price: import("@prisma/client-runtime-utils").Decimal;
            createdAt: Date;
            id: string;
            discount: import("@prisma/client-runtime-utils").Decimal | null;
            productId: string;
            total: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            orderId: string;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: string;
        userId: string;
        status: import("../../../generated/prisma/enums").OrderStatus;
        shippingAddress: import("@prisma/client/runtime/client").JsonValue;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        paymentMethod: string | null;
        notes: string | null;
        orderNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal | null;
        shippingCost: import("@prisma/client-runtime-utils").Decimal | null;
        discountTotal: import("@prisma/client-runtime-utils").Decimal | null;
        isDelivered: boolean;
        deliveredAt: Date | null;
        paymentStatus: import("../../../generated/prisma/enums").PaymentStatus;
        invoiceNumber: string | null;
    })[]>;
    getAllOrders: () => Promise<({
        invoice: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            invoiceNumber: string;
            pdfUrl: string | null;
            sentAt: Date | null;
            orderId: string;
        } | null;
        items: ({
            product: {
                images: {
                    createdAt: Date;
                    id: string;
                    order: number;
                    productId: string;
                    imageUrl: string;
                    altText: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                discountPrice: import("@prisma/client-runtime-utils").Decimal | null;
                stockQuantity: number;
                inStock: boolean;
                createdAt: Date;
                updatedAt: Date;
                id: string;
                sku: string | null;
                description: string | null;
                discount: import("@prisma/client-runtime-utils").Decimal | null;
                categoryId: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
            };
        } & {
            price: import("@prisma/client-runtime-utils").Decimal;
            createdAt: Date;
            id: string;
            discount: import("@prisma/client-runtime-utils").Decimal | null;
            productId: string;
            total: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            orderId: string;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: string;
        userId: string;
        status: import("../../../generated/prisma/enums").OrderStatus;
        shippingAddress: import("@prisma/client/runtime/client").JsonValue;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        paymentMethod: string | null;
        notes: string | null;
        orderNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal | null;
        shippingCost: import("@prisma/client-runtime-utils").Decimal | null;
        discountTotal: import("@prisma/client-runtime-utils").Decimal | null;
        isDelivered: boolean;
        deliveredAt: Date | null;
        paymentStatus: import("../../../generated/prisma/enums").PaymentStatus;
        invoiceNumber: string | null;
    })[]>;
    getOrderById: (id: string) => Promise<({
        invoice: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            invoiceNumber: string;
            pdfUrl: string | null;
            sentAt: Date | null;
            orderId: string;
        } | null;
        items: ({
            product: {
                images: {
                    createdAt: Date;
                    id: string;
                    order: number;
                    productId: string;
                    imageUrl: string;
                    altText: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                discountPrice: import("@prisma/client-runtime-utils").Decimal | null;
                stockQuantity: number;
                inStock: boolean;
                createdAt: Date;
                updatedAt: Date;
                id: string;
                sku: string | null;
                description: string | null;
                discount: import("@prisma/client-runtime-utils").Decimal | null;
                categoryId: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
            };
        } & {
            price: import("@prisma/client-runtime-utils").Decimal;
            createdAt: Date;
            id: string;
            discount: import("@prisma/client-runtime-utils").Decimal | null;
            productId: string;
            total: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            orderId: string;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: string;
        userId: string;
        status: import("../../../generated/prisma/enums").OrderStatus;
        shippingAddress: import("@prisma/client/runtime/client").JsonValue;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        paymentMethod: string | null;
        notes: string | null;
        orderNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal | null;
        shippingCost: import("@prisma/client-runtime-utils").Decimal | null;
        discountTotal: import("@prisma/client-runtime-utils").Decimal | null;
        isDelivered: boolean;
        deliveredAt: Date | null;
        paymentStatus: import("../../../generated/prisma/enums").PaymentStatus;
        invoiceNumber: string | null;
    }) | null>;
    updateOrderStatus: (id: string, status: string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        userId: string;
        status: import("../../../generated/prisma/enums").OrderStatus;
        shippingAddress: import("@prisma/client/runtime/client").JsonValue;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        paymentMethod: string | null;
        notes: string | null;
        orderNumber: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal | null;
        shippingCost: import("@prisma/client-runtime-utils").Decimal | null;
        discountTotal: import("@prisma/client-runtime-utils").Decimal | null;
        isDelivered: boolean;
        deliveredAt: Date | null;
        paymentStatus: import("../../../generated/prisma/enums").PaymentStatus;
        invoiceNumber: string | null;
    }>;
};
//# sourceMappingURL=order.service.d.ts.map