import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { helpController } from "./help.controller";
const router = Router();
router.post("/", auth(), helpController.createHelpRequest);
router.get("/", auth(UserRole.ADMIN), helpController.getAllHelpRequests);
router.get("/:id", auth(UserRole.ADMIN), helpController.getHelpRequestById);
router.patch("/:id/status", auth(UserRole.ADMIN), helpController.updateHelpRequestStatus);
export const helpRouter = router;
//# sourceMappingURL=help.router.js.map