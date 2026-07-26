import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

const ensureVisitor = async (input: {
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
}) => {
    const sessionId = input.sessionId || `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const existingVisitor = await prisma.visitor.findFirst({
        where: { sessionId },
    });

    if (existingVisitor) {
        return existingVisitor;
    }

    return prisma.visitor.create({
        data: {
            sessionId,
            ipAddress: input.ipAddress || null,
            userAgent: input.userAgent || null,
            userId: input.userId || null,
        },
    });
};

const trackPageView = async (input: {
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
    pageUrl: string;
    pageTitle?: string;
    productId?: string;
    categoryId?: string;
    referrer?: string;
    timeSpent?: number;
}) => {
    const visitor = await ensureVisitor(input);

    return prisma.pageView.create({
        data: {
            visitorId: visitor.id,
            pageUrl: input.pageUrl,
            pageTitle: input.pageTitle || null,
            productId: input.productId || null,
            categoryId: input.categoryId || null,
            referrer: input.referrer || null,
            timeSpent: input.timeSpent || null,
        },
    });
};

const trackProductView = async (input: {
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
    productId: string;
    pageUrl?: string;
    pageTitle?: string;
}) => {
    if (!input.productId) {
        throw new AppError(400, "Product ID is required");
    }

    await trackPageView({
        ...input,
        pageUrl: input.pageUrl || `/product/${input.productId}`,
        pageTitle: input.pageTitle || "Product View",
        productId: input.productId,
    });

    return { success: true, message: "Product view tracked" };
};

const trackCartActivity = async (input: {
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
    productId: string;
    action: "ADD_TO_CART" | "REMOVE_FROM_CART" | "VIEW_CART";
    quantity?: number;
}) => {
    if (!input.productId) {
        throw new AppError(400, "Product ID is required");
    }

    const visitor = await ensureVisitor(input);

    await prisma.pageView.create({
        data: {
            visitorId: visitor.id,
            pageUrl: "/cart",
            pageTitle: input.action,
            productId: input.productId,
            referrer: input.action,
            timeSpent: input.quantity || null,
        },
    });

    return { success: true, message: `Cart activity tracked: ${input.action}` };
};

const getVisitorAnalytics = async () => {
    const [totalVisitors, totalPageViews, totalProductViews, cartAdds, orders] = await Promise.all([
        prisma.visitor.count(),
        prisma.pageView.count(),
        prisma.pageView.count({ where: { productId: { not: null } } }),
        prisma.pageView.count({ where: { pageTitle: "ADD_TO_CART" } }),
        prisma.order.count(),
    ]);

    const topProducts = await prisma.pageView.groupBy({
        by: ["productId"],
        where: { productId: { not: null } },
        _count: { productId: true },
        orderBy: { _count: { productId: "desc" } },
        take: 10,
    });

    const productDetails = await Promise.all(
        topProducts.map(async (item) => {
            const product = await prisma.product.findUnique({
                where: { id: item.productId! },
                select: { id: true, name: true },
            });

            return {
                productId: item.productId,
                productName: product?.name || "Unknown",
                views: item._count.productId,
            };
        })
    );

    const abandonedCarts = await prisma.pageView.findMany({
        where: { pageTitle: "ADD_TO_CART" },
        select: { id: true, productId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 20,
    });

    return {
        summary: {
            totalVisitors,
            totalPageViews,
            totalProductViews,
            cartAdditions: cartAdds,
            completedOrders: orders,
            abandonedCartEvents: abandonedCarts.length,
        },
        topProducts: productDetails,
        abandonedCarts,
    };
};

export const visitorService = {
    trackPageView,
    trackProductView,
    trackCartActivity,
    getVisitorAnalytics,
};
