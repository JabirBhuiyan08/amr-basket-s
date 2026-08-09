import { visitorService } from "./visitor.service";
import { AppError } from "../../utils/app-error";
const trackPageView = async (req, res) => {
    try {
        const body = req.body;
        const result = await visitorService.trackPageView({
            ...body,
            pageUrl: body.pageUrl || req.originalUrl || "/",
            pageTitle: body.pageTitle || "Page View",
        });
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};
const trackProductView = async (req, res) => {
    try {
        const body = req.body;
        const result = await visitorService.trackProductView({
            ...body,
            productId: body.productId || "",
        });
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};
const trackCartActivity = async (req, res) => {
    try {
        const body = req.body;
        if (!body.productId) {
            throw new AppError(400, "Product ID is required");
        }
        const result = await visitorService.trackCartActivity({
            ...body,
            productId: body.productId,
            action: body.action || "ADD_TO_CART",
        });
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};
const getVisitorAnalytics = async (req, res) => {
    try {
        const analytics = await visitorService.getVisitorAnalytics();
        res.status(200).json({ success: true, data: analytics });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};
const getProductAnalytics = async (req, res) => {
    try {
        const analytics = await visitorService.getProductAnalytics();
        res.status(200).json({ success: true, data: analytics });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};
export const visitorController = {
    trackPageView,
    trackProductView,
    trackCartActivity,
    getVisitorAnalytics,
    getProductAnalytics,
};
export default visitorController;
//# sourceMappingURL=visitor.controller.js.map