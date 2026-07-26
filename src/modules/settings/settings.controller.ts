import { Request, Response } from "express";
import { settingsService } from "./settings.service";
import { AppError } from "../../utils/app-error";

const getAllSettings = async (req: Request, res: Response) => {
    try {
        const settings = await settingsService.getAllSettings();
        res.status(200).json({ success: true, data: settings });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};

const getSettingByKey = async (req: Request, res: Response) => {
    try {
        const key = typeof req.params.key === "string" ? req.params.key : undefined;
        if (!key) {
            throw new AppError(400, "Setting key is required");
        }

        const setting = await settingsService.getSettingByKey(key);
        if (!setting) {
            throw new AppError(404, "Setting not found");
        }

        res.status(200).json({ success: true, data: setting });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};

const setSetting = async (req: Request, res: Response) => {
    try {
        const key = typeof req.params.key === "string" ? req.params.key : undefined;
        const { value, description } = req.body as { value?: unknown; description?: string };

        if (!key) {
            throw new AppError(400, "Setting key is required");
        }

        const setting = await settingsService.setSetting(key, value, description);
        res.status(200).json({ success: true, data: setting, message: "Setting updated successfully" });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};

const deleteSetting = async (req: Request, res: Response) => {
    try {
        const key = typeof req.params.key === "string" ? req.params.key : undefined;
        if (!key) {
            throw new AppError(400, "Setting key is required");
        }

        const deleted = await settingsService.deleteSetting(key);
        if (!deleted) {
            throw new AppError(404, "Setting not found");
        }

        res.status(200).json({ success: true, message: "Setting deleted successfully" });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
    }
};

export const settingsController = {
    getAllSettings,
    getSettingByKey,
    setSetting,
    deleteSetting,
};

export default settingsController;
