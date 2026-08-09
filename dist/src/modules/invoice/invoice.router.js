import { Router } from "express";
import auth from "../../middlewares/auth";
import { invoiceController } from "./invoice.controller";
const router = Router();
router.get("/order/:orderId", auth(), invoiceController.getInvoiceByOrderId);
// Serve the invoice as a downloadable/viewable PDF.
// Registered before the generic "/:invoiceId" route so the ".pdf" suffix
// is matched correctly.
router.get(/^\/(.+)\.pdf$/, auth(), invoiceController.streamInvoicePdf);
router.get("/:invoiceId", auth(), invoiceController.getInvoiceById);
export const invoiceRouter = router;
//# sourceMappingURL=invoice.router.js.map