import { Request, Response } from "express";
import { helpService } from "./help.service";
import { AppError } from "../../utils/app-error";

const createPublicHelpRequest = async (req: Request, res: Response) => {
    try {
        const { name, phoneNumber, orderId, subject, message } = req.body as {
            name?: string;
            phoneNumber?: string;
            orderId?: string;
            subject?: string;
            message?: string;
        };

        if (!name?.trim()) {
            throw new AppError(400, "Name is required");
        }

        if (!phoneNumber?.trim()) {
            throw new AppError(400, "Phone number is required");
        }

        if (!subject?.trim() && !message?.trim()) {
            throw new AppError(400, "Subject or message is required");
        }

        const finalSubject = subject?.trim() || "Customer Support Request";
        const finalMessage = message?.trim() || `Order ID: ${orderId || "N/A"}\n\nCustomer: ${name}\nPhone: ${phoneNumber}`;

        const request = await helpService.createPublicHelpRequest({
            subject: finalSubject,
            message: finalMessage,
            phoneNumber: phoneNumber?.trim(),
            userName: name?.trim(),
            orderId: orderId?.trim(),
        });

        res.status(201).json({
            success: true,
            message: "Help request submitted successfully",
            data: request,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};

const createHelpRequest = async (req: Request, res: Response) => {
    try {
        const { subject, message, phoneNumber, productName, productId, userName, address } = req.body as {
            subject?: string;
            message?: string;
            phoneNumber?: string;
            productName?: string;
            productId?: string;
            userName?: string;
            address?: string;
        };

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
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};

const getAllHelpRequests = async (req: Request, res: Response) => {
    try {
        const requests = await helpService.getAllHelpRequests();
        res.status(200).json({ success: true, data: requests });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};

const getHelpRequestById = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};

const updateHelpRequestStatus = async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : undefined;
        const { status } = req.body as { status?: unknown };

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
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};

export const helpController = {
    createPublicHelpRequest,
    createHelpRequest,
    getAllHelpRequests,
    getHelpRequestById,
    updateHelpRequestStatus,
};

export default helpController;
