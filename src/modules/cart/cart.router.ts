import { Router } from "express";
import auth, { optionalAuth } from "../../middlewares/auth";
import { cartController } from "./cart.controller";

const router = Router();

router.get("/", optionalAuth(), cartController.getCart);
router.post("/items", optionalAuth(), cartController.addToCart);
router.put("/items/:productId", optionalAuth(), cartController.updateCartItem);
router.delete("/items/:productId", optionalAuth(), cartController.removeCartItem);
router.post("/checkout", auth(), cartController.checkout);

export const cartRouter = router;
