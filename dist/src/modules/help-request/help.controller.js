import { helpService } from "./help.service";
import { AppError } from "../../utils/app-error";
const createHelpRequest = async (req, res) => {
    try {
        const { subject, message, phoneNumber, productName, productId, userName, address } = req.body;
        if (!req.user?.id) {
            throw new AppError(401, "Please log in to submit a help request");
        }
        const normalizedPhone = typeof phoneNumber === "string" ? phoneNumber : undefined;
        const request = await helpService.createHelpRequest({
            userId: req.user.id,
            subject: subject || `${productName || "Product"} issue`,
            message: message || `Product: ${productName || "Unknown"}\nProduct ID: ${productId || "N/A"}\nUser: ${userName || req.user.name}\nPhone: ${phoneNumber || "N/A"}\nAddress: ${address || "N/A"}`,
            phoneNumber: normalizedPhone,
        });
        res.status(201).json({
            success: true,
            message: "Help request submitted successfully",
            data: request,
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const getAllHelpRequests = async (req, res) => {
    try {
        const requests = await helpService.getAllHelpRequests();
        res.status(200).json({ success: true, data: requests });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const getHelpRequestById = async (req, res) => {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : undefined;
        if (!id) {
            throw new AppError(400, "Help request ID is required");
        }
        const request = await helpService.getHelpRequestById(id);
        if (!request) {
            throw new AppError(404, "Help request not found");
        }
        res.status(200).json({ success: true, data: request });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const updateHelpRequestStatus = async (req, res) => {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : undefined;
        const { status } = req.body;
        if (!id) {
            throw new AppError(400, "Help request ID is required");
        }
        const normalizedStatus = typeof status === "string" ? status : "RESOLVED";
        const request = await helpService.updateHelpRequestStatus(id, normalizedStatus);
        res.status(200).json({
            success: true,
            message: "Help request status updated",
            data: request,
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
export const helpController = {
    createHelpRequest,
    getAllHelpRequests,
    getHelpRequestById,
    updateHelpRequestStatus,
};
export default helpController;
//# sourceMappingURL=help.controller.js.map