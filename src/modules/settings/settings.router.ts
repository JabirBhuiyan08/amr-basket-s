import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { settingsController } from "./settings.controller";

const router = Router();

router.get("/", settingsController.getAllSettings);
router.get("/:key", settingsController.getSettingByKey);
router.post("/:key", auth(UserRole.ADMIN), settingsController.setSetting);
router.delete("/:key", auth(UserRole.ADMIN), settingsController.deleteSetting);

export const settingsRouter = router;
