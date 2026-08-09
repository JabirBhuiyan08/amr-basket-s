import { Router } from "express";
import { visitorController } from "./visitor.controller";
const router = Router();
router.post("/track-page", visitorController.trackPageView);
router.post("/track-product", visitorController.trackProductView);
router.post("/track-cart", visitorController.trackCartActivity);
router.get("/analytics", visitorController.getVisitorAnalytics);
router.get("/product-analytics", visitorController.getProductAnalytics);
export const visitorRouter = router;
//# sourceMappingURL=visitor.router.js.map