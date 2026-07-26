import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

const createHelpRequest = async (input: {
    userId: string;
    subject: string;
    message: string;
    phoneNumber?: string | undefined;
    productName?: string | undefined;
    productId?: string | undefined;
    userName?: string | undefined;
    address?: string | undefined;
}) => {
    if (!input.subject?.trim()) {
        throw new AppError(400, "Subject is required");
    }

    if (!input.message?.trim()) {
        throw new AppError(400, "Message is required");
    }

    if (!input.userId) {
        throw new AppError(400, "User is required");
    }

    return prisma.helpRequest.create({
        data: {
            userId: input.userId,
            subject: input.subject.trim(),
            message: input.message.trim(),
            phoneNumber: input.phoneNumber?.trim() || null,
            status: "OPEN",
        },
    });
};

const getAllHelpRequests = async () => {
    return prisma.helpRequest.findMany({
        orderBy: { createdAt: "desc" },
    });
};

const getHelpRequestById = async (id: string) => {
    return prisma.helpRequest.findUnique({ where: { id } });
};

const updateHelpRequestStatus = async (id: string, status: string) => {
    const validStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

    if (!validStatuses.includes(status)) {
        throw new AppError(400, "Invalid help request status");
    }

    const existing = await prisma.helpRequest.findUnique({ where: { id } });

    if (!existing) {
        throw new AppError(404, "Help request not found");
    }

    return prisma.helpRequest.update({
        where: { id },
        data: {
            status: status as any,
            resolvedAt: status === "RESOLVED" || status === "CLOSED" ? new Date() : null,
        },
    });
};

export const helpService = {
    createHelpRequest,
    getAllHelpRequests,
    getHelpRequestById,
    updateHelpRequestStatus,
};
