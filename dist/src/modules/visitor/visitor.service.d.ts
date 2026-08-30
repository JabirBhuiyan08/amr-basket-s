export declare const visitorService: {
    trackPageView: (input: {
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
    }) => Promise<{
        createdAt: Date;
        id: string;
        categoryId: string | null;
        productId: string | null;
        referrer: string | null;
        pageUrl: string;
        pageTitle: string | null;
        timeSpent: number | null;
        visitorId: string;
    }>;
    trackProductView: (input: {
        sessionId?: string;
        ipAddress?: string;
        userAgent?: string;
        userId?: string;
        productId: string;
        pageUrl?: string;
        pageTitle?: string;
    }) => Promise<{
        success: boolean;
        message: string;
    }>;
    trackCartActivity: (input: {
        sessionId?: string;
        ipAddress?: string;
        userAgent?: string;
        userId?: string;
        productId: string;
        action: "ADD_TO_CART" | "REMOVE_FROM_CART" | "VIEW_CART";
        quantity?: number;
    }) => Promise<{
        success: boolean;
        message: string;
    }>;
    getVisitorAnalytics: () => Promise<{
        summary: {
            totalVisitors: number;
            totalPageViews: number;
            totalProductViews: number;
            cartAdditions: number;
            completedOrders: number;
            abandonedCartEvents: number;
        };
        topProducts: {
            productId: string | null;
            productName: string;
            views: number;
        }[];
        abandonedCarts: {
            createdAt: Date;
            id: string;
            productId: string | null;
        }[];
    }>;
    getProductAnalytics: () => Promise<{
        productId: string;
        name: string;
        price: number;
        image: string | null;
        views: number;
        cartAdditions: number;
        orderedQuantity: number;
        revenue: number;
    }[]>;
};
//# sourceMappingURL=visitor.service.d.ts.map