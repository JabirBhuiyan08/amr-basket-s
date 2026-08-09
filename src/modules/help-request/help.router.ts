import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { helpController } from "./help.controller";

const router = Router();

// Public route for customer help requests (no auth required)
router.post("/public", helpController.createPublicHelpRequest);

// Authenticated user routes
router.post("/", auth(), helpController.createHelpRequest);

// Admin routes
router.get("/", auth(UserRole.ADMIN), helpController.getAllHelpRequests);
router.get("/:id", auth(UserRole.ADMIN), helpController.getHelpRequestById);
router.patch("/:id/status", auth(UserRole.ADMIN), helpController.updateHelpRequestStatus);

export const helpRouter = router;
