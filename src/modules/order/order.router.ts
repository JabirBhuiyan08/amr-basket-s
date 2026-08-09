import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { orderController } from "./order.controller";

const router = Router();

router.get("/", auth(), orderController.getOrders);
router.get("/admin", auth(UserRole.ADMIN), orderController.getAllOrders);
router.get("/:id", auth(), orderController.getOrderById);
router.patch("/:id/status", auth(UserRole.ADMIN), orderController.updateOrderStatus);
router.patch("/:id/payment", auth(UserRole.ADMIN), orderController.updatePaymentStatus);

export const orderRouter = router;
