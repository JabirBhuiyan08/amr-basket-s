import { Router } from "express";
import auth from "../../middlewares/auth";
import { invoiceController } from "./invoice.controller";
const router = Router();
router.get("/order/:orderId", auth(), invoiceController.getInvoiceByOrderId);
router.get("/:invoiceId", auth(), invoiceController.getInvoiceById);
export const invoiceRouter = router;
//# sourceMappingURL=invoice.router.js.map